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
  status: "pending" | "completed" | "overdue";
  dueDate: string;
  notes?: string;
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
  status: "active" | "healed" | "archived";
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
    diagnosis: "Dementia, Type 2 Diabetes, Hypertension",
    allergies: [
      { type: "medication", description: "Penicillin", severity: "High" },
    ],
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
    title: "Physiotherapy assessment for right knee",
    assignedTo: "Physiotherapist",
    area: "House 1",
    status: "pending",
    dueDate: "2026-06-25",
    notes: "Resident complains of knee pain during transfers",
  },
  {
    id: "t2",
    residentId: "1",
    residentName: "Margaret Thompson",
    title: "GP review - medication reconciliation",
    assignedTo: "GP",
    area: "House 1",
    status: "pending",
    dueDate: "2026-06-26",
  },
  {
    id: "t3",
    residentId: "4",
    residentName: "Harold Brown",
    title: "Podiatry review",
    assignedTo: "Podiatrist",
    area: "House 1",
    status: "overdue",
    dueDate: "2026-06-20",
  },
  {
    id: "t4",
    residentId: "4",
    residentName: "Harold Brown",
    title: "Diabetic care review",
    assignedTo: "Registered Nurse",
    area: "House 1",
    status: "pending",
    dueDate: "2026-06-27",
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
  },
  {
    id: "t6",
    residentId: "3",
    residentName: "Dorothy Williams",
    title: "Falls risk reassessment",
    assignedTo: "Registered Nurse",
    area: "House 3",
    status: "pending",
    dueDate: "2026-06-28",
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
    type: "Medication",
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
