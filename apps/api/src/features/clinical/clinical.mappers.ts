import type {
  Wound,
  CarePlan,
  Checklist,
  ChecklistItem,
  Movement,
  Assessment,
  CarePathway,
  ResidentDoctor,
  Contact,
  Card,
  VitalReading,
  AnaccDetail,
  Document as ResidentDocumentRow,
} from "@prisma/client";
import type {
  WoundDTO,
  CarePlanDTO,
  ChecklistDTO,
  MovementDTO,
  AssessmentDTO,
  CarePathwayDTO,
  ResidentDoctorDTO,
  ContactDTO,
  CardDTO,
  VitalReadingDTO,
  AnaccDetailDTO,
  ResidentDocumentDTO,
} from "@clinical/shared";

// DB enums use underscores (Postgres can't have spaces); the API/UI use the
// human-readable form. These helpers translate at the boundary.
const unUnderscore = (s: string) => s.replace(/_/g, " ");
const iso = (d: Date) => d.toISOString();
const isoOrNull = (d: Date | null) => (d ? d.toISOString() : null);

export const wound = (w: Wound): WoundDTO => ({
  id: w.id,
  residentId: w.residentId,
  startedDate: iso(w.startedDate),
  onAdmission: w.onAdmission,
  woundType: w.woundType,
  location: w.location,
  dressingProduct: w.dressingProduct,
  nextDressing: isoOrNull(w.nextDressing),
  lastReview: isoOrNull(w.lastReview),
  nextReview: isoOrNull(w.nextReview),
  status: w.status,
});

export const carePlan = (c: CarePlan): CarePlanDTO => ({
  id: c.id,
  residentId: c.residentId,
  type: c.type,
  observations: c.observations,
  goals: c.goals,
  interventions: c.interventions,
  reviewDate: iso(c.reviewDate),
  createdBy: c.createdBy,
  status: c.status,
});

export const checklist = (c: Checklist & { items: ChecklistItem[] }): ChecklistDTO => ({
  id: c.id,
  residentId: c.residentId,
  type: c.type,
  date: iso(c.date),
  completedBy: c.completedBy,
  items: c.items.map((i) => ({
    id: i.id,
    name: i.name,
    completed: i.completed,
    completedBy: i.completedBy,
    completedAt: i.completedAt,
  })),
});

export const movement = (m: Movement): MovementDTO => ({
  id: m.id,
  residentId: m.residentId,
  date: iso(m.date),
  time: m.time,
  type: m.type,
  note: m.note,
  recordedBy: m.recordedBy,
});

export const assessment = (a: Assessment): AssessmentDTO => ({
  id: a.id,
  residentId: a.residentId,
  name: a.name,
  date: iso(a.date),
  by: a.by,
  score: a.score,
  summary: a.summary,
  status: a.status,
});

export const pathway = (p: CarePathway): CarePathwayDTO => ({
  id: p.id,
  residentId: p.residentId,
  name: p.name,
  totalSteps: p.totalSteps,
  completedSteps: p.completedSteps,
  status: unUnderscore(p.status) as CarePathwayDTO["status"],
});

export const doctor = (d: ResidentDoctor): ResidentDoctorDTO => ({
  id: d.id,
  residentId: d.residentId,
  name: d.name,
  specialty: d.specialty,
  facility: d.facilityName,
  phone: d.phone,
  email: d.email,
  primary: d.primary,
});

export const contact = (c: Contact): ContactDTO => ({
  id: c.id,
  residentId: c.residentId,
  name: c.name,
  relationship: c.relationship,
  phone: c.phone,
  email: c.email,
  primary: c.primary,
});

export const card = (c: Card): CardDTO => ({
  id: c.id,
  residentId: c.residentId,
  type: unUnderscore(c.type) as CardDTO["type"],
  number: c.number,
  status: (c.status === "NA" ? "N/A" : c.status) as CardDTO["status"],
  detail: c.detail,
});

export const vital = (v: VitalReading): VitalReadingDTO => ({
  id: v.id,
  residentId: v.residentId,
  recordedAt: iso(v.recordedAt),
  systolic: v.systolic,
  diastolic: v.diastolic,
  pulse: v.pulse,
  temperature: v.temperature,
  spo2: v.spo2,
});

export const anacc = (a: AnaccDetail): AnaccDetailDTO => ({
  id: a.id,
  residentId: a.residentId,
  fundingClass: a.fundingClass,
  fundingLevel: a.fundingLevel,
  dailyRate: a.dailyRate,
  assessmentDate: iso(a.assessmentDate),
  nextReview: iso(a.nextReview),
  domainScores: a.domainScores as AnaccDetailDTO["domainScores"],
  ihiNumber: a.ihiNumber,
  ihiVerified: a.ihiVerified,
});

export const residentDocument = (d: ResidentDocumentRow): ResidentDocumentDTO => ({
  id: d.id,
  residentId: d.residentId,
  name: d.name,
  category: d.category,
  size: d.size,
  uploadDate: iso(d.uploadDate),
});
