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

export const residents: Resident[] = [
  {
    id: "1",
    name: "Margaret Thompson",
    preferredName: "Maggie",
    room: "101",
    doa: "2024-08-07",
    age: 93,
    gender: "Female",
    status: "Permanent",
    respite: false,
    onLeave: false,
    acdp: true,
    cpr: false,
    bgl: true,
    mobile: false,
    ihi: "8003608833357361",
    anAcc: "A1",
    task: 2,
    alert: true,
    doctor: "Dr. Smith",
    medicareCard: "2345678901",
    concessionNumber: "ABC123",
    nok: "John Thompson",
    residence: "House 1",
    urn: "URN001",
    diagnosis: "Dementia - Alzheimer's Type",
    allergies: [
      { type: "medication", description: "Penicillin", severity: "High" },
      { type: "medication", description: "Aspirin", severity: "Medium" },
    ],
    careLevel: "High",
    accountStatus: "Active",
    nationality: "Australian",
  },
  {
    id: "2",
    name: "Robert Jenkins",
    preferredName: "Bob",
    room: "205",
    doa: "2024-03-15",
    age: 78,
    gender: "Male",
    status: "Permanent",
    respite: false,
    onLeave: false,
    acdp: true,
    cpr: true,
    bgl: false,
    mobile: true,
    ihi: "8003608833357362",
    anAcc: "B2",
    task: 0,
    alert: false,
    doctor: "Dr. Patel",
    medicareCard: "3456789012",
    concessionNumber: "DEF456",
    nok: "Susan Jenkins",
    residence: "House 2",
    urn: "URN002",
    diagnosis: "COPD, Osteoarthritis",
    allergies: [],
    careLevel: "Low",
    accountStatus: "Active",
  },
  {
    id: "3",
    name: "Dorothy Williams",
    preferredName: "Dot",
    room: "312",
    doa: "2023-11-20",
    age: 85,
    gender: "Female",
    status: "Respite",
    respite: true,
    onLeave: true,
    acdp: false,
    cpr: false,
    bgl: false,
    mobile: true,
    ihi: "8003608833357363",
    anAcc: "A3",
    task: 1,
    alert: false,
    doctor: "Dr. Johnson",
    medicareCard: "4567890123",
    concessionNumber: "GHI789",
    nok: "Peter Williams",
    residence: "House 3",
    urn: "URN003",
    diagnosis: "Parkinson's Disease, Depression",
    allergies: [
      { type: "food", description: "Shellfish", severity: "Medium" },
    ],
    careLevel: "Medium",
    accountStatus: "Inactive",
  },
  {
    id: "4",
    name: "Harold Brown",
    preferredName: "Harry",
    room: "108",
    doa: "2025-01-10",
    age: 81,
    gender: "Male",
    status: "Permanent",
    respite: false,
    onLeave: false,
    acdp: true,
    cpr: false,
    bgl: true,
    mobile: false,
    ihi: "8003608833357364",
    anAcc: "C1",
    task: 3,
    alert: true,
    doctor: "Dr. Smith",
    medicareCard: "5678901234",
    concessionNumber: "JKL012",
    nok: "Mary Brown",
    residence: "House 1",
    urn: "URN004",
    diagnosis: "Type 1 Diabetes, Heart Failure, Chronic Kidney Disease",
    allergies: [
      { type: "medication", description: "Sulfa drugs", severity: "High" },
      { type: "other", description: "Latex", severity: "Low" },
    ],
    careLevel: "High",
    accountStatus: "Active",
  },
  {
    id: "5",
    name: "Ethel Davis",
    preferredName: "Ethel",
    room: "220",
    doa: "2024-06-05",
    age: 89,
    gender: "Female",
    status: "Permanent",
    respite: false,
    onLeave: false,
    acdp: true,
    cpr: false,
    bgl: false,
    mobile: false,
    ihi: "8003608833357365",
    anAcc: "A2",
    task: 0,
    alert: false,
    doctor: "Dr. Lee",
    medicareCard: "6789012345",
    concessionNumber: "MNO345",
    nok: "Tom Davis",
    residence: "House 2",
    urn: "URN005",
    diagnosis: "Alzheimer's Disease, Hip Fracture (healed)",
    allergies: [],
    careLevel: "Medium",
    accountStatus: "Active",
  },
];

export const progressNotes: ProgressNote[] = [
  {
    id: "pn1",
    residentId: "1",
    date: "2026-06-24",
    time: "08:30",
    category: "clinical",
    note: "Resident appeared well this morning. BGL reading was 7.2 mmol/L. Medication administered as per chart. No complaints of pain.",
    author: "Jane Smith RN",
  },
  {
    id: "pn2",
    residentId: "1",
    date: "2026-06-23",
    time: "14:15",
    category: "behaviour",
    note: "Resident was restless during afternoon. Redirected successfully with music therapy. Family visited at 3pm, resident was pleased to see them.",
    author: "Sarah Jones EN",
  },
  {
    id: "pn3",
    residentId: "2",
    date: "2026-06-24",
    time: "09:00",
    category: "clinical",
    note: "Resident reports mild shortness of breath. O2 sats at 94%. Doctor notified. Resident positioned upright and monitoring continues.",
    author: "Jane Smith RN",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    residentId: "1",
    residentName: "Margaret Thompson",
    title: "Blood Glucose Monitoring",
    assignedTo: "Sarah Johnson",
    area: "House 1",
    status: "in_progress",
    dueDate: "2026-06-25",
    notes: "Daily BGL monitoring for diabetic resident",
    priority: "High",
    createdBy: "Jane Smith RN",
  },
  {
    id: "t2",
    residentId: "2",
    residentName: "Robert Jenkins",
    title: "Head Injury Assessment (Incident Follow-up)",
    assignedTo: "Dr. Patel",
    area: "House 2",
    status: "pending",
    dueDate: "2026-06-26",
    priority: "Urgent",
    createdBy: "Care Manager",
  },
  {
    id: "t3",
    residentId: "3",
    residentName: "Dorothy Williams",
    title: "Pain Assessment - Pending",
    assignedTo: "Sarah Johnson",
    area: "House 3",
    status: "pending",
    dueDate: "2026-06-27",
    priority: "High",
    createdBy: "Jane Smith RN",
  },
  {
    id: "t4",
    residentId: "4",
    residentName: "Harold Brown",
    title: "Fall Risk Assessment (3 monthly)",
    assignedTo: "Care Manager",
    area: "House 1",
    status: "in_progress",
    dueDate: "2026-06-28",
    priority: "Medium",
    createdBy: "Care Manager",
  },
  {
    id: "t5",
    residentId: "4",
    residentName: "Harold Brown",
    title: "Wound dressing change - left heel",
    assignedTo: "Enrolled Nurse",
    area: "House 1",
    status: "completed",
    dueDate: "2026-06-24",
    priority: "Medium",
    createdBy: "Jane Smith RN",
  },
  {
    id: "t6",
    residentId: "5",
    residentName: "Ethel Davis",
    title: "Weight Check",
    assignedTo: "Registered Nurse",
    area: "House 2",
    status: "pending",
    dueDate: "2026-06-28",
    priority: "Low",
    createdBy: "Care Manager",
  },
];

export const checklists: Checklist[] = [
  {
    id: "cl1",
    residentId: "2",
    type: "Post Fall Incidents Checklist",
    date: "2026-06-20",
    completedBy: "Jane Smith RN",
    items: [
      { id: "cli1", name: "Assess for injuries", completed: true, completedBy: "Jane Smith RN", completedAt: "2026-06-20 10:15" },
      { id: "cli2", name: "Vital signs recorded", completed: true, completedBy: "Jane Smith RN", completedAt: "2026-06-20 10:20" },
      { id: "cli3", name: "Doctor notified", completed: true, completedBy: "Jane Smith RN", completedAt: "2026-06-20 10:25" },
      { id: "cli4", name: "Family notified", completed: true, completedBy: "Jane Smith RN", completedAt: "2026-06-20 10:30" },
      { id: "cli5", name: "Environment assessed for hazards", completed: true, completedBy: "Jane Smith RN", completedAt: "2026-06-20 10:35" },
      { id: "cli6", name: "Incident report completed", completed: false },
    ],
  },
  {
    id: "cl2",
    residentId: "1",
    type: "Post Fall Incidents Checklist",
    date: "2024-01-10",
    completedBy: "Sarah Johnson",
    items: [
      { id: "cli7", name: "Assess for injuries", completed: true, completedBy: "Sarah Johnson", completedAt: "2024-01-10 10:15" },
      { id: "cli8", name: "Vital signs recorded", completed: true, completedBy: "Sarah Johnson", completedAt: "2024-01-10 10:20" },
      { id: "cli9", name: "Doctor notified", completed: true, completedBy: "Sarah Johnson", completedAt: "2024-01-10 10:25" },
    ],
  },
  {
    id: "cl3",
    residentId: "1",
    type: "New Admission Checklist",
    date: "2023-05-15",
    completedBy: "Michael Roberts",
    items: [
      { id: "cli10", name: "Initial assessment completed", completed: true, completedBy: "Michael Roberts", completedAt: "2023-05-15" },
      { id: "cli11", name: "Medication reconciliation done", completed: true, completedBy: "Michael Roberts", completedAt: "2023-05-15" },
      { id: "cli12", name: "Care plan initiated", completed: true, completedBy: "Michael Roberts", completedAt: "2023-05-15" },
      { id: "cli13", name: "Room orientation completed", completed: true, completedBy: "Michael Roberts", completedAt: "2023-05-15" },
      { id: "cli14", name: "Emergency contacts verified", completed: true, completedBy: "Michael Roberts", completedAt: "2023-05-15" },
    ],
  },
];

export const carePlans: CarePlan[] = [
  {
    id: "cp1",
    residentId: "1",
    type: "Fall Risk Management",
    observations: "Resident has high falls risk score (Morse scale 65). History of 2 falls in past 6 months. Uses walking frame. Cognitive impairment affects safety awareness.",
    goals: "Resident will remain free from falls and fall-related injuries. Resident will maintain mobility with appropriate supervision.",
    interventions: "Non-slip footwear at all times. Walking frame within reach. Bed/chair sensor alarms active. Regular toileting program. Hip protectors worn during day. Environment clear of hazards. Staff supervision during mobility.",
    reviewDate: "2026-09-01",
    createdBy: "Jane Smith RN",
    createdAt: "2026-06-01",
    status: "active",
  },
  {
    id: "cp2",
    residentId: "1",
    type: "Medication Management",
    observations: "Resident takes 12 medications daily. Has Type 2 Diabetes requiring insulin. Swallowing assessed as adequate for tablets.",
    goals: "Medications administered safely and on time. Blood glucose levels maintained within acceptable range (4-10 mmol/L).",
    interventions: "Medications administered by RN/EN. BGL monitored before breakfast and dinner. Insulin administered per sliding scale. Medication chart reviewed monthly by GP.",
    reviewDate: "2026-09-01",
    createdBy: "Jane Smith RN",
    createdAt: "2026-06-01",
    status: "active",
  },
  {
    id: "cp3",
    residentId: "2",
    type: "Food, Nutrition and Dining Experience",
    observations: "Resident has COPD affecting appetite. BMI 21.5. Prefers smaller frequent meals. Enjoys social dining.",
    goals: "Resident will maintain stable weight. Nutritional intake will meet daily requirements.",
    interventions: "Small frequent meals offered. High calorie snacks available. Weight monitored weekly. Dietitian review quarterly. Seated in communal dining area for meals.",
    reviewDate: "2026-08-15",
    createdBy: "Sarah Jones EN",
    createdAt: "2026-05-15",
    status: "active",
  },
  {
    id: "cp4",
    residentId: "1",
    type: "Nutrition Management",
    observations: "Resident has Type 2 Diabetes requiring carbohydrate-controlled diet. Good appetite, no swallowing concerns.",
    goals: "Blood glucose maintained within target range through diet. Weight remains stable.",
    interventions: "Diabetic-friendly meal plan. Portion control monitored. Dietitian review quarterly. Snacks limited to low-GI options.",
    reviewDate: "2026-08-10",
    createdBy: "Sarah Jones EN",
    createdAt: "2026-06-01",
    status: "active",
  },
];

export const wounds: Wound[] = [
  {
    id: "w1",
    residentId: "4",
    startedDate: "2025-12-20",
    onAdmission: false,
    woundType: "Bruise/Bruising",
    location: "Left lower leg",
    dressingProduct: "N/A",
    nextDressing: "2026-06-27",
    lastReview: "2026-06-24",
    nextReview: "2026-07-01",
    status: "active",
    lastPhoto: "2025-12-20",
  },
  {
    id: "w2",
    residentId: "1",
    startedDate: "2024-01-05",
    onAdmission: false,
    woundType: "Pressure injury - Stage 2",
    location: "Left heel",
    dressingProduct: "Foam dressing",
    nextDressing: "2024-01-21",
    lastReview: "2024-01-14",
    nextReview: "2024-01-21",
    status: "healing",
  },
];

export const movements: Movement[] = [
  {
    id: "m1",
    residentId: "3",
    date: "2026-06-20",
    time: "09:00",
    type: "Hospital leave",
    note: "Resident transferred to Royal Adelaide Hospital for cardiac review.",
    recordedBy: "Jane Smith RN",
  },
  {
    id: "m2",
    residentId: "3",
    date: "2026-06-22",
    time: "14:30",
    type: "Return from hospital leave",
    note: "Resident returned from hospital. Review completed. Follow-up appointment in 4 weeks.",
    recordedBy: "Sarah Jones EN",
  },
  {
    id: "m3",
    residentId: "1",
    date: "2024-01-15",
    time: "09:00",
    type: "Transfer",
    note: "Transferred to hospital for CT scan. Expected return same day.",
    recordedBy: "Sarah Johnson",
  },
  {
    id: "m4",
    residentId: "1",
    date: "2024-01-15",
    time: "15:30",
    type: "Return",
    note: "Returned from hospital. CT results pending. No acute findings.",
    recordedBy: "Michael Roberts",
  },
];

export const forms = [
  "ACOP – Medication Review",
  "ACOP – Return from Hospital Summary",
  "AN-ACC Australia-modified Karnofsky Performance Status (AKPS)",
  "AN-ACC Australian Functional Measure",
  "AN-ACC Behaviour Resource Utilisation Assessment (BRUA)",
  "AN-ACC De Morton Mobility Index (DEMMI) – Modified",
  "AN-ACC Frailty – falls and weight loss",
  "AN-ACC Palliative Care Assessment",
  "AN-ACC Reappraisal",
  "AN-ACC Resource Utilisation Groups – Activities of Daily Living (RUG-ADL)",
  "AN-ACC Technical Nursing Requirements",
  "Acute Care Needs – Eye, Ear, Nose and Oral Infections",
  "Acute Care Needs – Gastroenteritis",
  "Acute Care Needs – Skin Infections",
  "Acute Care Needs – Urinary Tract Infection",
  "Acute Intensive Rehab Program Assessment",
  "Alcohol Risk Assessment",
  "Allied Health: Powered Mobility and Community Access Assessment",
  "Allied Health: Equipment Risk Assessment",
  "Allied Health: Gym Circuit Class Suitability Assessment – Cardio Fitness",
  "Barthel Index of Activities of Daily Living (NQIP)",
  "Behaviour Support Plan (Restrictive Practice)",
  "Care Plan Conference",
  "Care Plan Conference (Wellbeing)",
  "Catering: Swallowing Assessment (Speech Pathologist)",
  "Clinical Pathway – Scabies/Shingles",
  "Clinical Pathway – Suspected Urinary Tract Infections (UTI) WITH Catheter",
  "Clinical Pathway – Suspected Urinary Tract Infections (UTI) WITHOUT Catheter",
  "Contact Details",
  "Delirium Screening Tool",
  "Doctor Communication",
  "External Venue Activity Risk Assessment",
  "General Risk Assessment",
  "Higher Everyday Living",
  "Hospital Return",
  "Hospital Transfer",
  "Infection Monitoring and Review",
  "Initial Consumer's Summary Care Plan",
  "Initial Wound Assessment",
  "Keep Moving Exercise Program",
  "Long term infection – Multi-Drug Resistant Organisms (MROs)",
  "Medication Incident Form (IMS)",
  "Pain – Modified Resident's Verbal Brief Pain Inventory (MRBVPI)",
];

export const carePlanTypes = [
  "Behaviour Support Care Plan",
  "Body Care and Personal Hygiene",
  "Clinical Risk",
  "Communication and Language",
  "Continence – Bladder and Bowel Management",
  "Continence – Toileting",
  "Cultural and Spiritual Care",
  "Emotion Support",
  "Fall Risk Management",
  "Food, Nutrition and Dining Experience",
  "Infection Prevention Control and Vaccination",
  "Intimacy & Trust – Support and Enablement",
  "Lifestyle & Leisure",
  "Medication",
  "Oral and Dental",
  "Pain Management",
  "Personal Hygiene and Grooming",
  "Physiotherapy",
  "Risk",
  "Risk – Self-Harm/Suicide",
  "Sensory – Smell, Taste & Touch",
  "Skin Care",
  "Sleep and Settling",
  "Specialised Nursing – Weight",
  "Wellbeing",
];

export const movementTypes = [
  "New Resident",
  "Admission",
  "Pre-admission",
  "Day Respite",
  "Re-admission",
  "Discharge – Other",
  "Discharge – Return to home",
  "Discharge – Transfer to another provider",
  "Day Respite Discharge",
  "Deceased",
  "Hospital leave",
  "Social leave",
  "Covid Leave",
  "Day Leave",
  "Return from social leave",
  "Return from hospital leave",
  "Return from day leave",
  "Internal transfer",
  "Respite to permanent",
  "Change room",
  "Change Admission Date",
  "Change Discharge Date",
];

export const documentCategories = [
  "Advanced Care Plan",
  "Allied Health Related",
  "Appointments and Referrals",
  "Assessments",
  "Care Plan Consultation",
  "Communication with Resident/NOK",
  "Contract",
  "Discharge Summary",
  "Documents",
  "Funding Related",
  "Lee Care documents",
  "Palliative Care",
  "Pathology",
  "Pharmacy",
  "Resident Documents",
  "Vaccination records",
];

export interface FacilityDocument {
  id: string;
  name: string;
  category: string;
  type: "PDF" | "Word" | "Excel" | "Image";
  size: string;
  uploadDate: string;
  uploadedBy: string;
}

export const facilityDocuments: FacilityDocument[] = [
  { id: "d1", name: "Admission Documentation", category: "Admission", type: "PDF", size: "2.4 MB", uploadDate: "2023-05-15", uploadedBy: "Admin" },
  { id: "d2", name: "Advanced Care Directive", category: "Legal", type: "PDF", size: "1.1 MB", uploadDate: "2023-05-20", uploadedBy: "Admin" },
  { id: "d3", name: "Medication Chart", category: "Clinical", type: "PDF", size: "890 KB", uploadDate: "2024-01-01", uploadedBy: "Jane Smith RN" },
  { id: "d4", name: "Clinical Policy Manual", category: "Policy", type: "PDF", size: "5.2 MB", uploadDate: "2024-01-05", uploadedBy: "Care Manager" },
  { id: "d5", name: "Staff Training Guide", category: "Training", type: "Word", size: "3.8 MB", uploadDate: "2024-01-10", uploadedBy: "Care Manager" },
  { id: "d6", name: "Emergency Procedures", category: "Policy", type: "PDF", size: "1.5 MB", uploadDate: "2024-01-02", uploadedBy: "Admin" },
];

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  shift: "Morning" | "Afternoon" | "Night";
}

export const staffUsers: StaffUser[] = [
  { id: "u1", name: "Sarah Johnson", email: "s.johnson@care.com", role: "Registered Nurse", shift: "Morning" },
  { id: "u2", name: "Michael Roberts", email: "m.roberts@care.com", role: "Enrolled Nurse", shift: "Morning" },
  { id: "u3", name: "Emily Chen", email: "e.chen@care.com", role: "Carer", shift: "Morning" },
  { id: "u4", name: "David Lee", email: "d.lee@care.com", role: "Carer", shift: "Afternoon" },
  { id: "u5", name: "Amanda Wilson", email: "a.wilson@care.com", role: "Registered Nurse", shift: "Afternoon" },
  { id: "u6", name: "James Taylor", email: "j.taylor@care.com", role: "Care Manager", shift: "Morning" },
  { id: "u7", name: "Lisa Brown", email: "l.brown@care.com", role: "Admin", shift: "Morning" },
];

export interface AppNotification {
  id: string;
  title: string;
  timeAgo: string;
}

export const appNotifications: AppNotification[] = [
  { id: "n1", title: "New task assigned: Medication Review", timeAgo: "5 min ago" },
  { id: "n2", title: "Assessment due for Margaret Thompson", timeAgo: "1 hour ago" },
  { id: "n3", title: "Wound dressing change required - Room 108", timeAgo: "2 hours ago" },
];

export interface ActivityItem {
  id: string;
  kind: "note" | "task" | "alert" | "assessment" | "careplan";
  title: string;
  author: string;
  timeAgo: string;
}

export const recentActivity: ActivityItem[] = [
  { id: "act1", kind: "note", title: "Progress note added for Margaret Thompson", author: "Sarah Johnson", timeAgo: "5 minutes ago" },
  { id: "act2", kind: "task", title: "Task completed: Weight Check - Ethel Davis", author: "Emily Chen", timeAgo: "15 minutes ago" },
  { id: "act3", kind: "alert", title: "Urgent: Medication review due for Robert Jenkins", author: "System", timeAgo: "30 minutes ago" },
  { id: "act4", kind: "assessment", title: "New assessment scheduled for Dorothy Williams", author: "Michael Roberts", timeAgo: "1 hour ago" },
  { id: "act5", kind: "careplan", title: "Care plan updated for Harold Brown", author: "Sarah Johnson", timeAgo: "2 hours ago" },
];

export interface WeeklyActivityPoint {
  day: string;
  notes: number;
  tasks: number;
  wounds: number;
}

export const weeklyActivity: WeeklyActivityPoint[] = [
  { day: "Mon", notes: 2, tasks: 1, wounds: 0 },
  { day: "Tue", notes: 0, tasks: 1, wounds: 0 },
  { day: "Wed", notes: 1, tasks: 2, wounds: 0 },
  { day: "Thu", notes: 0, tasks: 0, wounds: 0 },
  { day: "Fri", notes: 1, tasks: 1, wounds: 1 },
  { day: "Sat", notes: 0, tasks: 0, wounds: 0 },
  { day: "Sun", notes: 0, tasks: 1, wounds: 0 },
];

// ---------------------------------------------------------------------------
// Resident profile detail data (Doctors, Contacts, Cards, Charts, Pathways,
// Assessments, AN-ACC, Care Plan categories, structured Forms) — used by the
// 16 resident-profile tabs in src/components/resident/.
// ---------------------------------------------------------------------------

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

export const residentDoctors: ResidentDoctor[] = [
  { id: "doc1", residentId: "1", name: "Dr. Sarah Mitchell", specialty: "General Practice", facility: "Sunrise Medical Centre", phone: "02 9123 4567", email: "s.mitchell@medical.com.au", primary: true },
  { id: "doc2", residentId: "1", name: "Dr. Michael Chen", specialty: "Geriatrics", facility: "Elder Care Specialists", phone: "02 9123 8899", email: "m.chen@eldercare.com.au", primary: false },
  { id: "doc3", residentId: "1", name: "Dr. Emma Wilson", specialty: "General Practice", facility: "Community Health Clinic", phone: "02 9123 2211", email: "e.wilson@chc.com.au", primary: false },
  { id: "doc4", residentId: "1", name: "Dr. James Patterson", specialty: "Cardiology", facility: "Heart Health Centre", phone: "02 9123 5544", email: "j.patterson@hhc.com.au", primary: false },
  { id: "doc5", residentId: "1", name: "Dr. Lisa Wong", specialty: "Psychiatry", facility: "Mind & Wellness Clinic", phone: "02 9123 7733", email: "l.wong@mindwellness.com.au", primary: false },
];

export interface ResidentContact {
  id: string;
  residentId: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  primary: boolean;
}

export const residentContacts: ResidentContact[] = [
  { id: "con1", residentId: "1", name: "John Thompson", relationship: "Son", phone: "0412 345 678", email: "john.t@email.com", primary: true },
  { id: "con2", residentId: "1", name: "Mary Thompson", relationship: "Daughter-in-law", phone: "0412 345 679", email: "mary.t@email.com", primary: false },
];

export interface ResidentCardRecord {
  id: string;
  residentId: string;
  type: "Medicare Card" | "IHI Card" | "Concession Card" | "DVA Card";
  number: string;
  status: "Active" | "Verified" | "Pending" | "N/A";
  detail?: string;
}

export const residentCards: ResidentCardRecord[] = [
  { id: "card1", residentId: "1", type: "Medicare Card", number: "2345 67890 1", status: "Active", detail: "Expires: 12/2026" },
  { id: "card2", residentId: "1", type: "IHI Card", number: "8003 6080 0012 3456", status: "Verified" },
  { id: "card3", residentId: "1", type: "Concession Card", number: "Not Provided", status: "Pending" },
  { id: "card4", residentId: "1", type: "DVA Card", number: "Not Applicable", status: "N/A" },
];

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

export const vitalReadings: VitalReading[] = [
  { id: "vr1", residentId: "1", date: "Jan 10", systolic: 128, diastolic: 78, pulse: 72, temperature: 36.6, spo2: 97 },
  { id: "vr2", residentId: "1", date: "Jan 11", systolic: 130, diastolic: 80, pulse: 74, temperature: 36.7, spo2: 97 },
  { id: "vr3", residentId: "1", date: "Jan 12", systolic: 124, diastolic: 76, pulse: 71, temperature: 36.5, spo2: 98 },
  { id: "vr4", residentId: "1", date: "Jan 13", systolic: 132, diastolic: 81, pulse: 75, temperature: 36.8, spo2: 96 },
  { id: "vr5", residentId: "1", date: "Jan 14", systolic: 127, diastolic: 78, pulse: 73, temperature: 36.6, spo2: 97 },
  { id: "vr6", residentId: "1", date: "Jan 15", systolic: 124, diastolic: 82, pulse: 72, temperature: 36.6, spo2: 97 },
];

export interface WeightPoint {
  id: string;
  residentId: string;
  week: string;
  value: number;
}

export const weightReadings: WeightPoint[] = [
  { id: "wp1", residentId: "1", week: "Week 1", value: 62.5 },
  { id: "wp2", residentId: "1", week: "Week 2", value: 62.0 },
  { id: "wp3", residentId: "1", week: "Week 3", value: 62.8 },
];

export interface ChartBglPoint {
  id: string;
  residentId: string;
  date: string;
  value: number;
}

export const chartBglReadings: ChartBglPoint[] = [
  { id: "cb1", residentId: "1", date: "Jan 10", value: 6.8 },
  { id: "cb2", residentId: "1", date: "Jan 11", value: 7.2 },
  { id: "cb3", residentId: "1", date: "Jan 12", value: 6.5 },
  { id: "cb4", residentId: "1", date: "Jan 13", value: 7.5 },
  { id: "cb5", residentId: "1", date: "Jan 14", value: 6.9 },
];

export interface BehaviorPoint {
  id: string;
  residentId: string;
  date: string;
  incidents: number;
}

export const behaviorReadings: BehaviorPoint[] = [
  { id: "bh1", residentId: "1", date: "Jan 10", incidents: 0 },
  { id: "bh2", residentId: "1", date: "Jan 11", incidents: 1 },
  { id: "bh3", residentId: "1", date: "Jan 12", incidents: 0 },
  { id: "bh4", residentId: "1", date: "Jan 13", incidents: 2 },
  { id: "bh5", residentId: "1", date: "Jan 14", incidents: 0 },
];

export interface CarePathway {
  id: string;
  residentId: string;
  name: string;
  totalSteps: number;
  completedSteps: number;
  status: "Not Started" | "In Progress" | "Completed";
}

export const carePathways: CarePathway[] = [
  { id: "path1", residentId: "1", name: "New Admission Pathway", totalSteps: 8, completedSteps: 8, status: "Completed" },
  { id: "path2", residentId: "1", name: "End of Life Care Pathway", totalSteps: 12, completedSteps: 0, status: "Not Started" },
  { id: "path3", residentId: "1", name: "Hospital Discharge Pathway", totalSteps: 6, completedSteps: 4, status: "In Progress" },
  { id: "path4", residentId: "1", name: "Palliative Care Pathway", totalSteps: 10, completedSteps: 0, status: "Not Started" },
  { id: "path5", residentId: "1", name: "Respite Care Pathway", totalSteps: 5, completedSteps: 0, status: "Not Started" },
];

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

export const assessmentRecords: AssessmentRecord[] = [
  { id: "asmt1", residentId: "1", name: "Cognitive Assessment", date: "10/01/2024", by: "Dr. Sarah Mitchell", score: 18, summary: "MMSE score indicates moderate cognitive impairment. Continue current care plan.", status: "Completed" },
  { id: "asmt2", residentId: "1", name: "Fall Risk Assessment", date: "12/01/2024", by: "Sarah Johnson", score: 15, summary: "High fall risk. Ensure mobility aids are within reach at all times.", status: "Completed" },
];

export const assessmentTypeOptions = [
  "Cognitive Assessment",
  "Fall Risk Assessment",
  "Nutrition Assessment",
  "Skin Integrity Assessment",
  "Pain Assessment",
  "Behaviour Assessment",
];

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

export const anaccDetails: AnaccDetail[] = [
  {
    residentId: "1",
    fundingClass: "Class 10",
    fundingLevel: "High",
    dailyRate: "$285.50",
    assessmentDate: "05/01/2024",
    nextReview: "05/04/2024",
    domainScores: [
      { label: "Cognition & Behaviour", score: 4, outOf: 5 },
      { label: "Mobility", score: 3, outOf: 5 },
      { label: "Personal Care", score: 4, outOf: 5 },
      { label: "Healthcare", score: 4, outOf: 5 },
    ],
    ihiNumber: "8003 6080 0012 3456",
    ihiVerified: true,
  },
];

export interface CarePlanCategory {
  slug: string;
  label: string;
}

export const carePlanCategories: CarePlanCategory[] = [
  { slug: "fall-risk", label: "Fall Risk" },
  { slug: "medication", label: "Medication" },
  { slug: "pain-management", label: "Pain Management" },
  { slug: "skin-care", label: "Skin Care" },
  { slug: "nutrition", label: "Nutrition" },
  { slug: "wellbeing", label: "Wellbeing" },
  { slug: "physiotherapy", label: "Physiotherapy" },
];

export interface ClinicalForm {
  id: string;
  name: string;
  category: string;
  updatedDate: string;
}

export const clinicalForms: ClinicalForm[] = [
  { id: "cf1", name: "ACFI - Medication Review", category: "Assessment", updatedDate: "15/01/2024" },
  { id: "cf2", name: "Return from Hospital Summary", category: "Transfer", updatedDate: "14/01/2024" },
  { id: "cf3", name: "AN-ACC Functional Assessment", category: "AN-ACC", updatedDate: "13/01/2024" },
  { id: "cf4", name: "Behaviour Resource Utilisation Assessment", category: "Behavioral", updatedDate: "12/01/2024" },
  { id: "cf5", name: "DEMMI Mobility Assessment", category: "Mobility", updatedDate: "11/01/2024" },
  { id: "cf6", name: "Pain Assessment Tool", category: "Clinical", updatedDate: "10/01/2024" },
  { id: "cf7", name: "Nutrition Screening Tool", category: "Nutrition", updatedDate: "09/01/2024" },
  { id: "cf8", name: "Wound Assessment Form", category: "Clinical", updatedDate: "08/01/2024" },
];

export interface ResidentDocumentRecord {
  id: string;
  residentId: string;
  name: string;
  category: string;
  size: string;
  uploadDate: string;
}

export const residentDocuments: ResidentDocumentRecord[] = [
  { id: "rd1", residentId: "1", name: "Admission Documentation", category: "Admission", size: "2.4 MB", uploadDate: "15/05/2023" },
  { id: "rd2", residentId: "1", name: "Advanced Care Directive", category: "Legal", size: "1.1 MB", uploadDate: "20/05/2023" },
  { id: "rd3", residentId: "1", name: "Medication Chart", category: "Clinical", size: "890 KB", uploadDate: "01/01/2024" },
];
