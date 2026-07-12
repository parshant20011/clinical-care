// Seed the database with demo data.
//
// `seed-data.ts` holds the demo fixtures (formerly the frontend's mockData.ts —
// moved here once the web app was fully migrated to the API, since its only
// remaining job is seeding). Everything is created under ONE facility to
// exercise the multi-tenant model.
//
// Run:  npm run db:seed -w @clinical/api   (or `prisma db seed`)

import { PrismaClient, Role, Shift } from "@prisma/client";
import bcrypt from "bcryptjs";

import {
  residents,
  staffUsers,
  progressNotes,
  tasks,
  checklists,
  carePlans,
  wounds,
  movements,
  residentDoctors,
  residentContacts,
  residentCards,
  vitalReadings,
  assessmentRecords,
  anaccDetails,
  carePathways,
  residentDocuments,
} from "./seed-data";

const prisma = new PrismaClient();

const SEED_FACILITY_ID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_PASSWORD = "Password123!"; // dev only; real users reset on first login

// --- value mappers: mock strings -> Prisma enums --------------------------

function mapRole(mockRole: string): Role {
  switch (mockRole) {
    case "Registered Nurse": return Role.REGISTERED_NURSE;
    case "Care Manager": return Role.CARE_MANAGER;
    case "Admin": return Role.ADMIN;
    // "Carer" and "Enrolled Nurse" (not a canonical role) both map to CARER.
    default: return Role.CARER;
  }
}

function mapShift(mockShift?: string): Shift | null {
  switch (mockShift) {
    case "Morning": return Shift.MORNING;
    case "Afternoon": return Shift.AFTERNOON;
    case "Night": return Shift.NIGHT;
    default: return null;
  }
}

const noteCategory = (c: string) =>
  c === "personal care" ? "personal_care" : c; // enum-safe

const cardType = (t: string) => t.replace(/ /g, "_"); // "Medicare Card" -> "Medicare_Card"
const cardStatus = (s: string) => (s === "N/A" ? "NA" : s);
const pathwayStatus = (s: string) => s.replace(/ /g, "_"); // "In Progress" -> "In_Progress"

// Deterministic id helpers so re-running the seed is idempotent per facility.
const rid = (mockId: string) => `${SEED_FACILITY_ID}-r-${mockId}`;
const sid = (mockId: string) => `${SEED_FACILITY_ID}-s-${mockId}`;

async function main() {
  console.log("🌱 Seeding database…");

  // Wipe existing seed-facility data for a clean, repeatable seed.
  await prisma.facility.deleteMany({ where: { id: SEED_FACILITY_ID } });

  await prisma.facility.create({
    data: { id: SEED_FACILITY_ID, name: "Amber Aged Care (Demo)", region: "ap-southeast-2" },
  });

  // --- Staff -------------------------------------------------------------
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  for (const u of staffUsers) {
    await prisma.staff.create({
      data: {
        id: sid(u.id),
        facilityId: SEED_FACILITY_ID,
        email: u.email,
        passwordHash,
        name: u.name,
        role: mapRole(u.role),
        shift: mapShift(u.shift),
        active: true,
      },
    });
  }
  const firstStaffId = sid(staffUsers[0].id);
  const staffByName = new Map(staffUsers.map((u) => [u.name, sid(u.id)]));

  // --- Residents + allergies --------------------------------------------
  for (const r of residents) {
    await prisma.resident.create({
      data: {
        id: rid(r.id),
        facilityId: SEED_FACILITY_ID,
        name: r.name,
        preferredName: r.preferredName ?? null,
        room: r.room,
        dateOfAdmission: new Date(r.doa),
        age: r.age,
        gender: r.gender,
        nationality: r.nationality ?? null,
        admissionType: r.status, // "Permanent" | "Respite"
        onLeave: r.onLeave,
        careLevel: r.careLevel,
        accountStatus: r.accountStatus,
        diagnosis: r.diagnosis,
        ihi: r.ihi ?? null,
        medicareCard: r.medicareCard ?? null,
        concessionNumber: r.concessionNumber ?? null,
        allergies: {
          create: (r.allergies ?? []).map((a) => ({
            facilityId: SEED_FACILITY_ID,
            type: a.type,
            description: a.description,
            severity: a.severity as "Low" | "Medium" | "High",
          })),
        },
      },
    });
  }

  // --- Resident-scoped clinical children --------------------------------
  for (const n of progressNotes) {
    await prisma.progressNote.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(n.residentId),
        authorId: staffByName.get(n.author) ?? firstStaffId,
        category: noteCategory(n.category) as any,
        note: n.note,
        createdAt: new Date(`${n.date}T${n.time}:00`),
      },
    });
  }

  for (const t of tasks) {
    await prisma.task.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(t.residentId),
        assignedToId: staffByName.get(t.assignedTo) ?? null,
        title: t.title,
        priority: t.priority,
        status: t.status as any,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        notes: t.notes ?? null,
        createdBy: t.createdBy ?? null,
      },
    });
  }

  for (const c of checklists) {
    await prisma.checklist.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(c.residentId),
        type: c.type,
        date: new Date(c.date),
        completedBy: c.completedBy ?? null,
        items: {
          create: c.items.map((it) => ({
            name: it.name,
            completed: it.completed,
            completedBy: it.completedBy ?? null,
            completedAt: it.completedAt ?? null,
          })),
        },
      },
    });
  }

  for (const p of carePlans) {
    await prisma.carePlan.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(p.residentId),
        type: p.type,
        observations: p.observations,
        goals: p.goals,
        interventions: p.interventions,
        reviewDate: new Date(p.reviewDate),
        createdBy: p.createdBy,
        status: p.status,
      },
    });
  }

  for (const w of wounds) {
    await prisma.wound.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(w.residentId),
        startedDate: new Date(w.startedDate),
        onAdmission: w.onAdmission,
        woundType: w.woundType,
        location: w.location,
        dressingProduct: w.dressingProduct ?? null,
        nextDressing: w.nextDressing ? new Date(w.nextDressing) : null,
        lastReview: w.lastReview ? new Date(w.lastReview) : null,
        nextReview: w.nextReview ? new Date(w.nextReview) : null,
        status: w.status,
      },
    });
  }

  for (const m of movements) {
    await prisma.movement.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(m.residentId),
        date: new Date(m.date),
        time: m.time,
        type: m.type,
        note: m.note,
        recordedBy: m.recordedBy,
      },
    });
  }

  for (const d of residentDoctors) {
    await prisma.residentDoctor.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(d.residentId),
        name: d.name,
        specialty: d.specialty,
        facilityName: d.facility,
        phone: d.phone,
        email: d.email,
        primary: d.primary,
      },
    });
  }

  for (const c of residentContacts) {
    await prisma.contact.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(c.residentId),
        name: c.name,
        relationship: c.relationship,
        phone: c.phone,
        email: c.email,
        primary: c.primary,
      },
    });
  }

  for (const c of residentCards) {
    await prisma.card.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(c.residentId),
        type: cardType(c.type) as any,
        number: c.number,
        status: cardStatus(c.status) as any,
        detail: c.detail ?? null,
      },
    });
  }

  for (const v of vitalReadings) {
    // mock stores date as "Jan 10"; give it a concrete year for the DateTime.
    await prisma.vitalReading.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(v.residentId),
        recordedAt: new Date(`${v.date} 2024`),
        systolic: v.systolic,
        diastolic: v.diastolic,
        pulse: v.pulse,
        temperature: v.temperature,
        spo2: v.spo2,
      },
    });
  }

  for (const a of assessmentRecords) {
    await prisma.assessment.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(a.residentId),
        name: a.name,
        date: new Date(a.date.split("/").reverse().join("-")), // dd/mm/yyyy -> yyyy-mm-dd
        by: a.by,
        score: a.score,
        summary: a.summary,
        status: a.status,
      },
    });
  }

  for (const a of anaccDetails) {
    await prisma.anaccDetail.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(a.residentId),
        fundingClass: a.fundingClass,
        fundingLevel: a.fundingLevel,
        dailyRate: a.dailyRate,
        assessmentDate: new Date(a.assessmentDate.split("/").reverse().join("-")),
        nextReview: new Date(a.nextReview.split("/").reverse().join("-")),
        domainScores: a.domainScores,
        ihiNumber: a.ihiNumber,
        ihiVerified: a.ihiVerified,
      },
    });
  }

  for (const p of carePathways) {
    await prisma.carePathway.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(p.residentId),
        name: p.name,
        totalSteps: p.totalSteps,
        completedSteps: p.completedSteps,
        status: pathwayStatus(p.status) as any,
      },
    });
  }

  for (const d of residentDocuments) {
    await prisma.document.create({
      data: {
        facilityId: SEED_FACILITY_ID,
        residentId: rid(d.residentId),
        name: d.name,
        category: d.category,
        size: d.size,
        uploadDate: new Date(d.uploadDate.split("/").reverse().join("-")),
      },
    });
  }

  const counts = {
    facilities: await prisma.facility.count(),
    staff: await prisma.staff.count(),
    residents: await prisma.resident.count(),
    progressNotes: await prisma.progressNote.count(),
    tasks: await prisma.task.count(),
  };
  console.log("✅ Seed complete:", counts);
  console.log(`   Login with any seed email, password: ${DEFAULT_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
