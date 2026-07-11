import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "@prisma/client";

// Repository = the ONLY layer that talks to Prisma/the DB for residents.
// Every function takes facilityId first and scopes the query to it, so a
// facility can never read or write another facility's rows (multi-tenancy).

export function listResidents(facilityId: string) {
  return prisma.resident.findMany({
    where: { facilityId },
    orderBy: { name: "asc" },
    include: { allergies: true },
  });
}

export function getResident(facilityId: string, id: string) {
  return prisma.resident.findFirst({
    where: { id, facilityId }, // id AND facility — cross-tenant reads impossible
    include: { allergies: true },
  });
}

export function createResident(facilityId: string, data: Prisma.ResidentCreateInput) {
  return prisma.resident.create({
    data: { ...data, facility: { connect: { id: facilityId } } },
    include: { allergies: true },
  });
}
