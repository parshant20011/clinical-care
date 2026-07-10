import { z } from "zod";
import { ROLES } from "./permissions";

// Zod schemas shared by the API (request validation) and the web app (react-hook-form
// resolvers). Start with auth + the create-payloads used by the existing add-flows;
// extend per-resource during the Phase 4 data-layer migration.

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const roleSchema = z.enum(ROLES);

// Resident create payload — the fields the "Add Resident" dialog collects today
// (Residents.tsx `emptyForm`), plus the list/dashboard fields with defaults.
export const createResidentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  room: z.string().min(1, "Room is required"),
  age: z.coerce.number().int().min(0).max(130),
  gender: z.string().min(1),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  careLevel: z.enum(["Low", "Medium", "High"]).default("Medium"),
  status: z.enum(["Permanent", "Respite"]).default("Permanent"),
});
export type CreateResidentInput = z.infer<typeof createResidentSchema>;

// Progress note create payload (ProgressNotesTab add form).
export const createProgressNoteSchema = z.object({
  residentId: z.string().min(1),
  category: z.enum(["clinical", "personal care", "behaviour", "incident"]),
  note: z.string().min(1, "Note cannot be empty"),
});
export type CreateProgressNoteInput = z.infer<typeof createProgressNoteSchema>;

// Task create payload (AssignTaskTab form).
export const createTaskSchema = z.object({
  residentId: z.string().min(1),
  title: z.string().min(1, "Task description is required"),
  assignedTo: z.string().min(1, "Assignee is required"),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
