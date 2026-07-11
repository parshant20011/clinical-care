import type { Resident, Allergy } from "@prisma/client";
import type { ResidentDetail, ResidentListItem, CreateResidentInput } from "@clinical/shared";
import { AppError } from "../../lib/AppError.js";
import * as repo from "./residents.repository.js";

type ResidentWithAllergies = Resident & { allergies: Allergy[] };

// Map a DB row → the API DTO. One place that decides what the client sees
// (e.g. we could redact/decrypt identifiers here later).
function toListItem(r: ResidentWithAllergies): ResidentListItem {
  return {
    id: r.id,
    name: r.name,
    preferredName: r.preferredName,
    room: r.room,
    age: r.age,
    gender: r.gender,
    diagnosis: r.diagnosis,
    careLevel: r.careLevel,
    accountStatus: r.accountStatus,
    admissionType: r.admissionType,
  };
}

function toDetail(r: ResidentWithAllergies): ResidentDetail {
  return {
    ...toListItem(r),
    nationality: r.nationality,
    dateOfAdmission: r.dateOfAdmission.toISOString(),
    onLeave: r.onLeave,
    ihi: r.ihi,
    medicareCard: r.medicareCard,
    concessionNumber: r.concessionNumber,
    allergies: r.allergies.map((a) => ({
      type: a.type,
      description: a.description,
      severity: a.severity,
    })),
  };
}

export async function list(facilityId: string): Promise<ResidentListItem[]> {
  const rows = await repo.listResidents(facilityId);
  return rows.map(toListItem);
}

export async function getById(facilityId: string, id: string): Promise<ResidentDetail> {
  const row = await repo.getResident(facilityId, id);
  if (!row) throw AppError.notFound("Resident not found");
  return toDetail(row);
}

export async function create(
  facilityId: string,
  input: CreateResidentInput,
): Promise<ResidentDetail> {
  const row = await repo.createResident(facilityId, {
    name: input.name,
    room: input.room,
    age: input.age,
    gender: input.gender,
    diagnosis: input.diagnosis,
    careLevel: input.careLevel,
    admissionType: input.status,
    dateOfAdmission: new Date(),
  } as any);
  return toDetail(row as any);
}
