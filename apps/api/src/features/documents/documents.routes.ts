import { Router } from "express";
import type { FacilityDocumentDTO } from "@clinical/shared";
import { prisma } from "../../lib/prisma.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { requireAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { auditMutations } from "../../middleware/audit.js";

const router = Router();
router.use(requireAuth);
router.use(auditMutations("Document"));

// GET /api/documents — facility-wide document repository (the Documents page).
// Resident-scoped documents live at /residents/:id/documents instead.
//
// NOTE: the schema currently models documents as resident-scoped only, so the
// facility repository is derived from all of the facility's documents. When
// facility-level (non-resident) documents are modelled, this reads that table.
router.get(
  "/",
  requirePermission("documents", "read"),
  asyncHandler(async (req, res) => {
    const rows = await prisma.document.findMany({
      where: { facilityId: req.user!.facilityId },
      orderBy: { uploadDate: "desc" },
    });
    const data: FacilityDocumentDTO[] = rows.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      type: d.name.toLowerCase().endsWith(".docx") ? "Word" : "PDF",
      size: d.size,
      uploadDate: d.uploadDate.toISOString(),
      uploadedBy: "—",
    }));
    res.json({ data });
  }),
);

export default router;
