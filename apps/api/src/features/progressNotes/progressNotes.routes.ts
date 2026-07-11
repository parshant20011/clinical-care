import { Router } from "express";
import { createProgressNoteSchema } from "@clinical/shared";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { auditMutations } from "../../middleware/audit.js";
import * as service from "./progressNotes.service.js";

// mergeParams lets this nested router read :residentId from the parent
// /residents/:residentId/progress-notes mount.
const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(auditMutations("ProgressNote"));

// GET /api/residents/:residentId/progress-notes
router.get(
  "/",
  requirePermission("clinical", "read"),
  asyncHandler(async (req, res) => {
    const { residentId } = req.params;
    res.json({ data: await service.listForResident(req.user!.facilityId, residentId) });
  }),
);

// POST /api/residents/:residentId/progress-notes
router.post(
  "/",
  requirePermission("clinical", "create"),
  asyncHandler(async (req, res) => {
    const { residentId } = req.params;
    // Body carries category + note; residentId comes from the URL, authorId
    // from the session — never trust the client for those.
    const input = createProgressNoteSchema
      .omit({ residentId: true })
      .parse(req.body);
    const created = await service.create(req.user!.facilityId, {
      residentId,
      authorId: req.user!.id,
      category: input.category,
      note: input.note,
    });
    res.status(201).json({ data: created });
  }),
);

export default router;
