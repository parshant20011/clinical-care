import { Router } from "express";
import type { DashboardStats, ActivityItemDTO } from "@clinical/shared";
import { prisma } from "../../lib/prisma.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";

const router = Router();
router.use(requireAuth);

// GET /api/dashboard/stats — the six headline numbers. Computed server-side
// with count queries rather than shipping every row to the browser to be
// counted there.
router.get(
  "/stats",
  requirePermission("residents", "read"),
  asyncHandler(async (req, res) => {
    const facilityId = req.user!.facilityId;

    const [totalResidents, activeTasks, pendingAssessments, activeWounds, highCare, urgentTasks] =
      await Promise.all([
        prisma.resident.count({ where: { facilityId } }),
        prisma.task.count({ where: { facilityId, status: { not: "completed" } } }),
        prisma.assessment.count({ where: { facilityId, status: "Scheduled" } }),
        prisma.wound.count({ where: { facilityId, status: { in: ["active", "healing"] } } }),
        prisma.resident.count({ where: { facilityId, careLevel: "High" } }),
        prisma.task.count({ where: { facilityId, priority: "Urgent", status: { not: "completed" } } }),
      ]);

    const data: DashboardStats = {
      totalResidents,
      activeTasks,
      pendingAssessments,
      activeWounds,
      highCare,
      urgentTasks,
    };
    res.json({ data });
  }),
);

// GET /api/dashboard/activity — a real "recent activity" feed built from the
// latest clinical records, rather than a hardcoded list.
router.get(
  "/activity",
  requirePermission("clinical", "read"),
  asyncHandler(async (req, res) => {
    const facilityId = req.user!.facilityId;

    const [notes, tasks] = await Promise.all([
      prisma.progressNote.findMany({
        where: { facilityId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          resident: { select: { name: true } },
          author: { select: { name: true } },
        },
      }),
      prisma.task.findMany({
        where: { facilityId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          resident: { select: { name: true } },
          assignedTo: { select: { name: true } },
        },
      }),
    ]);

    const items: ActivityItemDTO[] = [
      ...notes.map((n) => ({
        id: `note-${n.id}`,
        kind: "note" as const,
        title: `Progress note added for ${n.resident.name}`,
        author: n.author?.name ?? "System",
        at: n.createdAt.toISOString(),
      })),
      ...tasks.map((t) => ({
        id: `task-${t.id}`,
        kind: (t.priority === "Urgent" ? "alert" : "task") as ActivityItemDTO["kind"],
        title:
          t.status === "completed"
            ? `Task completed: ${t.title} — ${t.resident.name}`
            : `${t.priority === "Urgent" ? "Urgent: " : ""}${t.title} — ${t.resident.name}`,
        author: t.assignedTo?.name ?? t.createdBy ?? "System",
        at: t.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 6);

    res.json({ data: items });
  }),
);

export default router;
