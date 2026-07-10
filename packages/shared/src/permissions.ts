// Role-based access control (RBAC) — shared between the API's enforcement
// middleware and the frontend's conditional UI. Code-based permission map for
// now; a DB-backed permission table can replace this later if per-facility
// customization is needed (see productionization plan Phase 1).

export const ROLES = [
  "REGISTERED_NURSE",
  "CARE_MANAGER",
  "ADMIN",
  "CARER",
] as const;

export type Role = (typeof ROLES)[number];

// Human-readable labels (the UI currently shows these strings, e.g. in the
// header account menu and sidebar).
export const ROLE_LABELS: Record<Role, string> = {
  REGISTERED_NURSE: "Registered Nurse",
  CARE_MANAGER: "Care Manager",
  ADMIN: "Admin",
  CARER: "Carer",
};

export type Action = "read" | "create" | "update" | "delete";

// Logical resources the API guards. Kept coarse-grained on purpose — most
// clinical entities share the same access rules as their parent resident.
export const RESOURCES = [
  "residents",
  "clinical", // progress notes, assessments, care plans, wounds, charts, pathways, anacc
  "tasks",
  "documents",
  "reports",
  "staff", // user & access management
  "audit",
] as const;

export type Resource = (typeof RESOURCES)[number];

type PermissionMap = Record<Role, Partial<Record<Resource, Action[]>>>;

const ALL: Action[] = ["read", "create", "update", "delete"];

// What each role may do with each resource. Absent resource ⇒ no access.
export const PERMISSIONS: PermissionMap = {
  ADMIN: {
    residents: ALL,
    clinical: ALL,
    tasks: ALL,
    documents: ALL,
    reports: ["read"],
    staff: ALL,
    audit: ["read"],
  },
  CARE_MANAGER: {
    residents: ["read", "create", "update"],
    clinical: ALL,
    tasks: ALL,
    documents: ["read", "create", "update"],
    reports: ["read"],
    staff: ["read"],
    audit: ["read"],
  },
  REGISTERED_NURSE: {
    residents: ["read", "update"],
    clinical: ["read", "create", "update"],
    tasks: ["read", "create", "update"],
    documents: ["read", "create"],
    reports: ["read"],
  },
  CARER: {
    residents: ["read"],
    clinical: ["read", "create"], // e.g. progress notes, checklists
    tasks: ["read", "update"], // complete assigned tasks
    documents: ["read"],
  },
};

export function can(role: Role, resource: Resource, action: Action): boolean {
  return PERMISSIONS[role]?.[resource]?.includes(action) ?? false;
}
