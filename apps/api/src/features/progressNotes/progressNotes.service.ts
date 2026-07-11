import type { ProgressNote, NoteCategory } from "@prisma/client";
import type { ProgressNoteDTO } from "@clinical/shared";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";

// DB category enum uses "personal_care"; the API/UI use "personal care".
const toApiCategory = (c: NoteCategory): ProgressNoteDTO["category"] =>
  c === "personal_care" ? "personal care" : (c as ProgressNoteDTO["category"]);
const toDbCategory = (c: ProgressNoteDTO["category"]): NoteCategory =>
  (c === "personal care" ? "personal_care" : c) as NoteCategory;

function toDTO(n: ProgressNote): ProgressNoteDTO {
  return {
    id: n.id,
    residentId: n.residentId,
    category: toApiCategory(n.category),
    note: n.note,
    authorId: n.authorId,
    createdAt: n.createdAt.toISOString(),
  };
}

// Confirm the resident belongs to this facility before touching its notes —
// blocks a user from reading/writing another tenant's records via a guessed id.
async function assertResidentInFacility(facilityId: string, residentId: string) {
  const resident = await prisma.resident.findFirst({
    where: { id: residentId, facilityId },
    select: { id: true },
  });
  if (!resident) throw AppError.notFound("Resident not found");
}

export async function listForResident(
  facilityId: string,
  residentId: string,
): Promise<ProgressNoteDTO[]> {
  await assertResidentInFacility(facilityId, residentId);
  const notes = await prisma.progressNote.findMany({
    where: { facilityId, residentId },
    orderBy: { createdAt: "desc" },
  });
  return notes.map(toDTO);
}

export async function create(
  facilityId: string,
  input: {
    residentId: string;
    authorId: string;
    category: ProgressNoteDTO["category"];
    note: string;
  },
): Promise<ProgressNoteDTO> {
  await assertResidentInFacility(facilityId, input.residentId);
  const note = await prisma.progressNote.create({
    data: {
      facilityId,
      residentId: input.residentId,
      authorId: input.authorId,
      category: toDbCategory(input.category),
      note: input.note,
    },
  });
  return toDTO(note);
}
