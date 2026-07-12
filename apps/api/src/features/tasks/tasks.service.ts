import type { TaskDTO, CreateTaskInput, UpdateTaskInput } from "@clinical/shared";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";

// Prisma row + the relations we always include for the DTO.
type TaskRow = Awaited<ReturnType<typeof findMany>>[number];

function findMany(facilityId: string, residentId?: string) {
  return prisma.task.findMany({
    where: { facilityId, ...(residentId ? { residentId } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      resident: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });
}

function toDTO(t: TaskRow): TaskDTO {
  return {
    id: t.id,
    residentId: t.residentId,
    residentName: t.resident.name,
    title: t.title,
    assignedToId: t.assignedToId,
    assignedToName: t.assignedTo?.name ?? null,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    notes: t.notes,
    createdBy: t.createdBy,
    createdAt: t.createdAt.toISOString(),
  };
}

export async function list(facilityId: string, residentId?: string): Promise<TaskDTO[]> {
  const rows = await findMany(facilityId, residentId);
  return rows.map(toDTO);
}

export async function create(
  facilityId: string,
  createdBy: string,
  input: CreateTaskInput,
): Promise<TaskDTO> {
  // Both the resident and the assignee must belong to this facility.
  const [resident, assignee] = await Promise.all([
    prisma.resident.findFirst({ where: { id: input.residentId, facilityId }, select: { id: true } }),
    prisma.staff.findFirst({ where: { id: input.assignedToId, facilityId }, select: { id: true } }),
  ]);
  if (!resident) throw AppError.notFound("Resident not found");
  if (!assignee) throw AppError.badRequest("Assignee not found in this facility");

  const created = await prisma.task.create({
    data: {
      facilityId,
      residentId: input.residentId,
      assignedToId: input.assignedToId,
      title: input.title,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      notes: input.notes ?? null,
      createdBy,
    },
    include: {
      resident: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });
  return toDTO(created);
}

export async function update(
  facilityId: string,
  id: string,
  input: UpdateTaskInput,
): Promise<TaskDTO> {
  // Scope the update to the facility so a guessed id can't touch another tenant.
  const existing = await prisma.task.findFirst({ where: { id, facilityId }, select: { id: true } });
  if (!existing) throw AppError.notFound("Task not found");

  const updated = await prisma.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.assignedToId !== undefined ? { assignedToId: input.assignedToId } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.notes !== undefined ? { notes: input.notes } : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: input.dueDate ? new Date(input.dueDate) : null }
        : {}),
    },
    include: {
      resident: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });
  return toDTO(updated);
}
