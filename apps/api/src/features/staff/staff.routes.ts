import { Router } from "express";
import type { StaffDTO } from "@clinical/shared";
import { prisma } from "../../lib/prisma.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { auditMutations } from "../../middleware/audit.js";

const router = Router();

router.use(requireAuth);
router.use(auditMutations("Staff"));

// GET /api/staff — the facility's staff list (used by the task-assignee
// dropdown and the Settings > Role Management table). Never returns password
// hashes.
router.get(
  "/",
  requirePermission("staff", "read"),
  asyncHandler(async (req, res) => {
    const rows = await prisma.staff.findMany({
      where: { facilityId: req.user!.facilityId },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true, shift: true, active: true },
    });
    const data: StaffDTO[] = rows.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      role: s.role,
      shift: s.shift,
      active: s.active,
    }));
    res.json({ data });
  }),
);

export default router;
