import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import * as map from "./clinical.mappers.js";

// All resident-scoped clinical sub-resources share the same shape:
//   GET /api/residents/:residentId/<resource>
// so rather than 12 near-identical routers, they're registered from one table.
// Each entry says how to fetch the rows and how to map them to a DTO.

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Confirm the resident exists AND belongs to the caller's facility. Runs before
// every clinical read, so a guessed resident id can never leak another tenant's
// clinical records.
async function assertResident(facilityId: string, residentId: string) {
  const found = await prisma.resident.findFirst({
    where: { id: residentId, facilityId },
    select: { id: true },
  });
  if (!found) throw AppError.notFound("Resident not found");
}

type Loader = (facilityId: string, residentId: string) => Promise<unknown>;

const resources: Record<string, Loader> = {
  wounds: async (facilityId, residentId) =>
    (await prisma.wound.findMany({
      where: { facilityId, residentId },
      orderBy: { startedDate: "desc" },
    })).map(map.wound),

  "care-plans": async (facilityId, residentId) =>
    (await prisma.carePlan.findMany({
      where: { facilityId, residentId },
      orderBy: { createdAt: "desc" },
    })).map(map.carePlan),

  checklists: async (facilityId, residentId) =>
    (await prisma.checklist.findMany({
      where: { facilityId, residentId },
      orderBy: { date: "desc" },
      include: { items: true },
    })).map(map.checklist),

  movements: async (facilityId, residentId) =>
    (await prisma.movement.findMany({
      where: { facilityId, residentId },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    })).map(map.movement),

  assessments: async (facilityId, residentId) =>
    (await prisma.assessment.findMany({
      where: { facilityId, residentId },
      orderBy: { date: "desc" },
    })).map(map.assessment),

  pathways: async (facilityId, residentId) =>
    (await prisma.carePathway.findMany({
      where: { facilityId, residentId },
      orderBy: { name: "asc" },
    })).map(map.pathway),

  doctors: async (facilityId, residentId) =>
    (await prisma.residentDoctor.findMany({
      where: { facilityId, residentId },
      orderBy: [{ primary: "desc" }, { name: "asc" }],
    })).map(map.doctor),

  contacts: async (facilityId, residentId) =>
    (await prisma.contact.findMany({
      where: { facilityId, residentId },
      orderBy: [{ primary: "desc" }, { name: "asc" }],
    })).map(map.contact),

  cards: async (facilityId, residentId) =>
    (await prisma.card.findMany({
      where: { facilityId, residentId },
      orderBy: { type: "asc" },
    })).map(map.card),

  vitals: async (facilityId, residentId) =>
    (await prisma.vitalReading.findMany({
      where: { facilityId, residentId },
      orderBy: { recordedAt: "asc" },
    })).map(map.vital),

  documents: async (facilityId, residentId) =>
    (await prisma.document.findMany({
      where: { facilityId, residentId },
      orderBy: { uploadDate: "desc" },
    })).map(map.residentDocument),
};

for (const [path, load] of Object.entries(resources)) {
  router.get(
    `/${path}`,
    requirePermission("clinical", "read"),
    asyncHandler(async (req, res) => {
      const { residentId } = req.params as { residentId: string };
      const facilityId = req.user!.facilityId;
      await assertResident(facilityId, residentId);
      res.json({ data: await load(facilityId, residentId) });
    }),
  );
}

// AN-ACC is one-per-resident, so it returns an object (or null) rather than a list.
router.get(
  "/anacc",
  requirePermission("clinical", "read"),
  asyncHandler(async (req, res) => {
    const { residentId } = req.params as { residentId: string };
    const facilityId = req.user!.facilityId;
    await assertResident(facilityId, residentId);
    const row = await prisma.anaccDetail.findFirst({ where: { facilityId, residentId } });
    res.json({ data: row ? map.anacc(row) : null });
  }),
);

export default router;
