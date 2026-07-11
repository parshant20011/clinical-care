import { Router } from "express";
import { createResidentSchema } from "@clinical/shared";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { auditMutations } from "../../middleware/audit.js";
import * as service from "./residents.service.js";
import progressNotesRouter from "../progressNotes/progressNotes.routes.js";

const router = Router();

// Every residents route requires a logged-in user; each verb also checks the
// RBAC permission map. facilityId always comes from req.user (never the client)
// so a request can only ever touch its own tenant's data.
router.use(requireAuth);
router.use(auditMutations("Resident"));

// GET /api/residents
router.get(
  "/",
  requirePermission("residents", "read"),
  asyncHandler(async (req, res) => {
    res.json({ data: await service.list(req.user!.facilityId) });
  }),
);

// GET /api/residents/:id
router.get(
  "/:id",
  requirePermission("residents", "read"),
  asyncHandler(async (req, res) => {
    res.json({ data: await service.getById(req.user!.facilityId, req.params.id) });
  }),
);

// POST /api/residents
router.post(
  "/",
  requirePermission("residents", "create"),
  asyncHandler(async (req, res) => {
    const input = createResidentSchema.parse(req.body);
    const created = await service.create(req.user!.facilityId, input);
    res.status(201).json({ data: created });
  }),
);

// Nested resident-scoped clinical resources.
router.use("/:residentId/progress-notes", progressNotesRouter);

export default router;
