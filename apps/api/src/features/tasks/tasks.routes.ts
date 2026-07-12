import { Router } from "express";
import { createTaskSchema, updateTaskSchema } from "@clinical/shared";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { auditMutations } from "../../middleware/audit.js";
import * as service from "./tasks.service.js";

const router = Router();

router.use(requireAuth);
router.use(auditMutations("Task"));

// GET /api/tasks            → all tasks in the facility
// GET /api/tasks?residentId=… → tasks for one resident
router.get(
  "/",
  requirePermission("tasks", "read"),
  asyncHandler(async (req, res) => {
    const residentId = typeof req.query.residentId === "string" ? req.query.residentId : undefined;
    res.json({ data: await service.list(req.user!.facilityId, residentId) });
  }),
);

// POST /api/tasks
router.post(
  "/",
  requirePermission("tasks", "create"),
  asyncHandler(async (req, res) => {
    const input = createTaskSchema.parse(req.body);
    const created = await service.create(req.user!.facilityId, req.user!.name, input);
    res.status(201).json({ data: created });
  }),
);

// PATCH /api/tasks/:id  (e.g. mark complete, reassign)
router.patch(
  "/:id",
  requirePermission("tasks", "update"),
  asyncHandler(async (req, res) => {
    const input = updateTaskSchema.parse(req.body);
    const updated = await service.update(req.user!.facilityId, req.params.id, input);
    res.json({ data: updated });
  }),
);

export default router;
