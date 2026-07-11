// Shared domain types for the Clinical Care platform.
//
// Single source of truth for entity shapes across the whole monorepo:
//   - apps/web imports these for components, forms, and API-response typing
//   - apps/api imports these for controllers/services and to align with Prisma
//   - packages/shared/schemas.ts derives zod validators from these shapes
//
// These were extracted verbatim from the original apps/web/src/data/mockData.ts
// during the Phase 0 monorepo split. The mock data arrays still live in web and
// now re-import their element types from here, so behaviour is unchanged.

export interface Resident {
  id: string;
  name: string;
  preferredName?: string;
  room: string;
  doa: string; // date of admission
  age: number;
  gender: string;
  status: "Permanent" | "Respite";
  respite: boolean;
  onLeave: boolean;
  acdp: boolean;
  cpr: boolean;
  bgl: boolean;
  mobile: boolean;
  ihi: string;
  anAcc: string;
  task: number;
  alert: boolean;
  doctor: string;
  medicareCard: string;
  concessionNumber: string;
  nok: string;
  residence: string;
  urn: string;
  diagnosis: string;
  allergies: { type: string; description: string; severity: string }[];
  photo?: string;
  // Facility-wide list/dashboard fields — distinct from `status` (which is
  // Permanent/Respite residency type, used on the profile page).
  careLevel: "Low" | "Medium" | "High";
  accountStatus: "Active" | "Inactive";
  nationality?: string;
}

export interface ProgressNote {
  id: string;
  residentId: string;
  date: string;
  time: string;
  category: "clinical" | "personal care" | "behaviour" | "incident";
  note: string;
  author: string;
}

export interface Task {
  id: string;
  residentId: string;
  residentName: string;
  title: string;
  assignedTo: string;
  area: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  dueDate: string;
  notes?: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdBy: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  comments?: string;
}

export interface Checklist {
  id: string;
  residentId: string;
  type:
    | "Acute Respiration Infection"
    | "Behaviour of Concerns Incident Checklist"
    | "New Admission Checklist"
    | "Post Fall Incidents Checklist"
    | "Return from Hospital"
    | "Room Change Checklist"
    | "Skin Integrity Incident Checklist";
  date: string;
  items: ChecklistItem[];
  completedBy?: string;
}

export interface CarePlan {
  id: string;
  residentId: string;
  type: string;
  observations: string;
  goals: string;
  interventions: string;
  reviewDate: string;
  createdBy: string;
  createdAt: string;
  status: "active" | "archived";
}

export interface Wound {
  id: string;
  residentId: string;
  startedDate: string;
  onAdmission: boolean;
  woundType: string;
  location: string;
  dressingProduct: string;
  nextDressing: string;
  lastReview: string;
  nextReview: string;
  status: "active" | "healing" | "healed" | "archived";
  lastPhoto?: string;
}

export interface Movement {
  id: string;
  residentId: string;
  date: string;
  time: string;
  type: string;
  note: string;
  recordedBy: string;
}

export interface FacilityDocument {
  id: string;
  name: string;
  category: string;
  type: "PDF" | "Word" | "Excel" | "Image";
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  shift: "Morning" | "Afternoon" | "Night";
}

export interface AppNotification {
  id: string;
  title: string;
  timeAgo: string;
}

export interface ActivityItem {
  id: string;
  kind: "note" | "task" | "alert" | "assessment" | "careplan";
  title: string;
  author: string;
  timeAgo: string;
}

export interface WeeklyActivityPoint {
  day: string;
  notes: number;
  tasks: number;
  wounds: number;
}

export interface ResidentDoctor {
  id: string;
  residentId: string;
  name: string;
  specialty: string;
  facility: string;
  phone: string;
  email: string;
  primary: boolean;
}

export interface ResidentContact {
  id: string;
  residentId: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  primary: boolean;
}

export interface ResidentCardRecord {
  id: string;
  residentId: string;
  type: "Medicare Card" | "IHI Card" | "Concession Card" | "DVA Card";
  number: string;
  status: "Active" | "Verified" | "Pending" | "N/A";
  detail?: string;
}

export interface VitalReading {
  id: string;
  residentId: string;
  date: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  temperature: number;
  spo2: number;
}

export interface WeightPoint {
  id: string;
  residentId: string;
  week: string;
  value: number;
}

export interface ChartBglPoint {
  id: string;
  residentId: string;
  date: string;
  value: number;
}

export interface BehaviorPoint {
  id: string;
  residentId: string;
  date: string;
  incidents: number;
}

export interface CarePathway {
  id: string;
  residentId: string;
  name: string;
  totalSteps: number;
  completedSteps: number;
  status: "Not Started" | "In Progress" | "Completed";
}

export interface AssessmentRecord {
  id: string;
  residentId: string;
  name: string;
  date: string;
  by: string;
  score: number;
  summary: string;
  status: "Completed" | "Scheduled";
}

export interface AnaccDetail {
  residentId: string;
  fundingClass: string;
  fundingLevel: "Low" | "Medium" | "High";
  dailyRate: string;
  assessmentDate: string;
  nextReview: string;
  domainScores: { label: string; score: number; outOf: number }[];
  ihiNumber: string;
  ihiVerified: boolean;
}

export interface CarePlanCategory {
  slug: string;
  label: string;
}

export interface ClinicalForm {
  id: string;
  name: string;
  category: string;
  updatedDate: string;
}

export interface ResidentDocumentRecord {
  id: string;
  residentId: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
}

// ---------------------------------------------------------------------------
// API DTOs — the exact shapes the backend returns over HTTP. These are the
// contract between apps/api and apps/web (used from Phase 4 onward). They map
// only fields the real database stores, unlike the richer mock-era interfaces
// above (which carried denormalized flags the DB never persisted).
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  shift: string | null;
  facilityId: string;
}

export interface ResidentListItem {
  id: string;
  name: string;
  preferredName: string | null;
  room: string;
  age: number;
  gender: string;
  diagnosis: string;
  careLevel: "Low" | "Medium" | "High";
  accountStatus: "Active" | "Inactive";
  admissionType: "Permanent" | "Respite";
}

export interface ResidentDetail extends ResidentListItem {
  nationality: string | null;
  dateOfAdmission: string;
  onLeave: boolean;
  ihi: string | null;
  medicareCard: string | null;
  concessionNumber: string | null;
  allergies: { type: string; description: string; severity: string }[];
}

export interface ProgressNoteDTO {
  id: string;
  residentId: string;
  category: "clinical" | "personal care" | "behaviour" | "incident";
  note: string;
  authorId: string | null;
  createdAt: string;
}
