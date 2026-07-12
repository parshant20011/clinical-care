// Static reference data — NOT database resources.
//
// These are fixed clinical vocabularies and UI option lists (form templates,
// movement types, care-plan categories, assessment types). They don't vary per
// facility or change at runtime, so they live in code rather than the DB. If a
// facility ever needs to customise them, they graduate to real tables.

import type { ClinicalForm, CarePlanCategory, AppNotification } from "./types";

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

export const assessmentTypeOptions = [
  "Cognitive Assessment",
  "Fall Risk Assessment",
  "Nutrition Assessment",
  "Skin Integrity Assessment",
  "Pain Assessment",
  "Behaviour Assessment",
];

export const carePlanCategories: CarePlanCategory[] = [
  { slug: "fall-risk", label: "Fall Risk" },
  { slug: "medication", label: "Medication" },
  { slug: "pain-management", label: "Pain Management" },
  { slug: "skin-care", label: "Skin Care" },
  { slug: "nutrition", label: "Nutrition" },
  { slug: "wellbeing", label: "Wellbeing" },
  { slug: "physiotherapy", label: "Physiotherapy" },
];

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

export const appNotifications: AppNotification[] = [
  { id: "n1", title: "New task assigned: Medication Review", timeAgo: "5 min ago" },
  { id: "n2", title: "Assessment due for Margaret Thompson", timeAgo: "1 hour ago" },
  { id: "n3", title: "Wound dressing change required - Room 108", timeAgo: "2 hours ago" },
];
