# Clinical Care — Aged Care Clinical Management System

A web application for managing clinical operations in aged care facilities, built with React 18, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

---

## Project Background

This system replicates the functionality of the **Amber Aged Care / LeeCare** clinical management platform. It was built from scratch based on PDF documentation of the existing system, covering the Residents module and core clinical workflows used daily by nursing staff.

> **Confidentiality Notice:** This system may handle personal and clinical information of residents. Do not share designs, data, or documentation outside the team.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite (SWC) | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui (Radix UI) | Component library |
| React Router v6 | Client-side routing |
| Lucide React | Icons |
| Recharts | Charts |
| React Hook Form + Zod | Form handling and validation |
| Vitest + Testing Library | Unit testing |

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # Fixed sidebar + header shell
│   │   ├── Sidebar.tsx         # Dark sidebar with nav links
│   │   ├── Header.tsx          # Search, notifications, user menu
│   │   └── NavLink.tsx         # Active-state nav item
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── ResidentSummary.tsx
│   │   ├── TaskOverview.tsx
│   │   └── RecentActivity.tsx
│   ├── resident/               # 16 tab components
│   │   ├── ProgressNotesTab.tsx
│   │   ├── ChecklistTab.tsx
│   │   ├── AssignTaskTab.tsx
│   │   ├── FormsTab.tsx
│   │   ├── AssessmentTab.tsx
│   │   ├── PathwaysTab.tsx
│   │   ├── ChartsTab.tsx
│   │   ├── CarePlanTab.tsx
│   │   ├── ANACCTab.tsx
│   │   ├── WoundsTab.tsx
│   │   ├── MovementTab.tsx
│   │   ├── DocumentsTab.tsx
│   │   ├── DetailsTab.tsx
│   │   ├── CardsTab.tsx
│   │   ├── DoctorsTab.tsx
│   │   └── ContactsTab.tsx
│   └── ui/                     # shadcn/ui components
├── data/
│   └── mockData.ts             # All mock data and TypeScript interfaces
├── hooks/
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Residents.tsx           # Resident list table
│   ├── ResidentProfile.tsx     # 16-tab resident detail view
│   ├── Tasks.tsx
│   ├── Documents.tsx
│   ├── Reports.tsx
│   ├── Settings.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx                     # Router configuration
├── main.tsx
└── index.css                   # Tailwind + CSS variables (HSL theming)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

> **Note:** If PowerShell blocks npm with an execution policy error, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Or use `npm.cmd` instead of `npm` in PowerShell.

---

## Routes

| Path | Page |
|---|---|
| `/` | Dashboard |
| `/residents` | Residents list |
| `/residents/:id` | Resident profile (16 tabs) |
| `/tasks` | Task management |
| `/documents` | Document repository |
| `/reports` | Management reports |
| `/settings` | System settings |

---

## Resident Profile Tabs

Each resident has 16 tabs covering their full clinical picture:

1. **Progress Notes** — Clinical, personal care, behaviour, incident notes
2. **Checklists** — Daily/weekly care checklists
3. **Tasks** — Assigned care tasks
4. **Forms** — 40+ clinical form types
5. **Assessments** — Standardised clinical assessments
6. **Pathways** — Clinical care pathways (drives which registers appear)
7. **Charts** — BGL, BP, weight, wound, behaviour charting
8. **Care Plan** — Observations → Goals → Interventions per care plan type
9. **AN-ACC** — Australian funding classification, Enteral/Oxygen section
10. **Active Wounds** — Wound tracking with dressing history
11. **Movements** — 22 movement types (hospital, LOA, deceased, etc.)
12. **Document** — Resident-specific documents by category
13. **Details** — Demographics, Medicare, IHI, URN, allergies
14. **Cards** — Summary cards (ACD, CPR status, alerts)
15. **Doctors** — GP and specialist details
16. **Contacts** — NOK and emergency contacts

---

## Data Model

Key interfaces in `src/data/mockData.ts`:

- **Resident** — name, room, DOA, status, AN-ACC, IHI, Medicare, allergies, flags (CPR, BGL, onLeave, respite, alert)
- **ProgressNote** — residentId, category, content, author, date
- **Task** — residentId, title, assignedTo, area, status, dueDate
- **CarePlan** — type, observations, goals, interventions, status
- **Wound** — location, stage, size, treatment, lastDressed
- **Movement** — type, date, time, destination, notes
- **ChecklistItem / Checklist** — structured daily/weekly checklists

Constants exported: `forms` (40+ types), `carePlanTypes` (22), `movementTypes` (22), `documentCategories` (16)

---

## Domain Context

This is an Australian aged care system. Key concepts:

- **AN-ACC** — Australian National Aged Care Classification, the funding model replacing ACFI
- **Pathways** — Clinical triggers that activate specific care registers for a resident
- **ACD** — Advance Care Directive (end-of-life wishes)
- **CPR status** — FOR resuscitation or NOT for resuscitation
- **IHI** — Individual Healthcare Identifier (national)
- **NOK** — Next of Kin
- **Respite** — Short-term stays vs Permanent residents
- **AN-ACC Prediction** — Pre-classification estimate pending formal assessment

---

## What's Built vs Pending

### Built
- Resident list with all columns (DOA, Respite, On Leave, ACD/P, CPR, BGL, Mobile, IHI, AN-ACC, Task, Alert)
- Full 16-tab resident profile
- Dashboard with stats and activity feed
- Tasks page with status filtering
- Documents page with category browsing
- Management Reports page
- Settings page

### Pending (from requirements)
- Clinical Lists & Registers (BGL, BP, SIRS, Incident, Weights, Infections, Self-Medication registers)
- Clinical Handover Notes (daily/weekly shift notes, carry-forward)
- New Admission Sequence (17-day onboarding roadmap)
- Resident Vaccination records
- Wellbeing module (Activity Chart, Calendar, Plan & Evaluation)
- Clinical Charts top-level section (Nurse Charts, Restrictive Practices)
- Appointment Book
- Assessment Matrix (facility-wide view)
- Care Plans Matrix (facility-wide view)
- Global Search — Progress Notes and Forms & Assessments
- Care Statements
- Referrals
- User & Access Management
- Audit & History logs
- Functional form rendering (currently static lists)
- Wound dressing weekly grid view
- BGL weekly chart entry grid

---

## Notes

- Layout uses fixed sidebar (`w-64`) + fixed header (`h-16`). Main content offset: `ml-64 mt-16`.
- Theming uses CSS custom properties (HSL variables) in `index.css` supporting light and `.dark` modes.
- Sidebar uses `bg-sidebar` custom variable for its dark background separate from the main theme.
- All data is currently mock data — no backend or API is connected.
