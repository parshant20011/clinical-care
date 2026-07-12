# Clinical Care — Aged Care Clinical Management System

A multi-tenant clinical management platform for aged-care facilities. React 18 + TypeScript frontend, Node/Express + Postgres backend (being built out), organised as an **npm-workspaces monorepo**.

> **Confidentiality Notice:** This system handles personal and clinical information of residents. Do not share designs, data, or documentation outside the team.

---

## Monorepo layout

```
clinical-care/
├─ apps/
│  ├─ web/        React 18 + Vite frontend (the app UI)
│  └─ api/        Node/Express + Prisma backend (Phase 2+, in progress)
├─ packages/
│  └─ shared/     Domain types + zod schemas + RBAC map (used by web AND api)
├─ docker-compose.yml   Local Postgres (portable option)
└─ docs/          Security & scope doc + technical learning guide (open in a browser)
```

The productionization roadmap (mock prototype → real product) lives in `docs/` and in the plan file. Current status: **Phase 0** (monorepo), **Phase 1** (multi-tenant Postgres + seed), **Phases 2–3** (Express API: JWT-cookie auth, RBAC, tenant scoping, audit logging), and **Phase 4** (frontend wired to the API — login page, route guard, TanStack Query; residents + progress notes now persist) are done and verified. Next: finish migrating the remaining tabs/pages off `mockData.ts`, then hardening, tests/CI, and deployment.

---

## Running the project

You need **Node 20+** and a **Postgres 16** database. Pick ONE database option:

### Database — Option A: Docker (recommended, portable, matches prod)

Requires Docker Desktop running.

```bash
docker compose up -d        # starts Postgres on localhost:5432 (data persists)
docker compose down          # stop   (docker compose down -v also wipes data)
```

### Database — Option B: Local Postgres (e.g. Homebrew on macOS)

If you already run Postgres locally on port 5432, create the DB + role the app expects:

```bash
psql -d postgres -c "CREATE ROLE clinical LOGIN PASSWORD 'localdevpassword' CREATEDB;"
psql -d postgres -c "CREATE DATABASE clinical_care OWNER clinical;"
```

> ⚠️ Don't run both options at once — they both use port 5432 and will conflict.

### First-time setup

```bash
npm install                                   # installs all workspaces

cp apps/api/.env.example apps/api/.env         # then edit: set JWT secrets
# generate strong secrets:
#   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"

npm run prisma:migrate -w @clinical/api        # create the DB tables
npm run db:seed        -w @clinical/api        # load demo data (1 facility, 7 staff, 5 residents)
```

### Day-to-day

```bash
npm run dev:web                                # frontend  → http://localhost:5173
npm run dev     -w @clinical/api               # backend   → http://localhost:4000  (once Phase 2 lands)
npm run prisma:studio -w @clinical/api         # visual DB browser
npm run build                                  # typecheck + build all workspaces
```

> **Current state:** run **both** the API and the web app. Visit http://localhost:5173 — you'll be redirected to `/login`. Sign in with any seed user (e.g. `l.brown@care.com` / `Password123!`). The **Residents list, resident profile, and Progress Notes now come from Postgres** — add a resident and refresh: it persists. The remaining tabs/pages still read mock data and are being migrated resource-by-resource (they show empty states in the meantime).

Copy `apps/web/.env.example` → `apps/web/.env` (sets `VITE_API_URL`) before running the frontend.

> **PowerShell note:** if npm is blocked, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once, or use `npm.cmd`.

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

- Layout uses a fixed sidebar (`w-64`) + fixed header (`h-20`). Main content offset: `ml-64 mt-20 px-8 py-6`.
- Theming uses CSS custom properties (HSL variables) in `apps/web/src/index.css`.
- The frontend currently reads mock data (`apps/web/src/data/mockData.ts`); the backend + DB (`apps/api`) exist and are seeded, with the frontend↔API wiring landing in Phase 4.
- See `docs/01-security-and-scope.html` and `docs/02-technical-learning-guide.html` (open in a browser) for the architecture, DB design, security plan, and a full teach-yourself guide.
