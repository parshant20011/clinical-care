# Claude Code Context — Clinical Care App

## What this project is

An aged care clinical management web app built for **Amber Aged Care** (replacing their existing LeeCare/Amber system). Built from PDF documentation of the original system. All data is mock — no backend connected yet.

**Confidentiality:** This system handles personal and clinical data of aged care residents. Do not share designs, resident data, or documentation outside the team.

---

## Tech stack

- React 18 + TypeScript + Vite (SWC)
- Tailwind CSS with HSL CSS variables for theming
- shadcn/ui (Radix UI primitives) — components written manually, not via CLI
- React Router v6
- Lucide React icons
- `npm run dev` to start, `npm run build` to verify

> PowerShell note: If npm is blocked, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` once, or use `npm.cmd`.

---

## Layout rules

- Sidebar: fixed left, `w-64`, dark navy background (`bg-sidebar` CSS var, `hsl(210 35% 18%)` ≈ `#1e2e3e`)
- Header: fixed top-right (`left-64`), `h-20`; renders the current page's title + subtitle on the left (derived from the route in `Header.tsx`) and search/notifications/account on the right. Pages must NOT render their own `<h1>` title block — the header owns it.
- Main content offset: `ml-64 mt-20 px-8 py-6`
- Header height and the `mt-20` content offset are calibrated together — change both if you change one

---

## Key files

| File | Purpose |
|---|---|
| `src/data/mockData.ts` | All interfaces and mock data (residents, tasks, notes, care plans, wounds, movements) |
| `src/App.tsx` | Route definitions |
| `src/index.css` | Tailwind directives + full CSS variable set (light + dark) |
| `src/components/layout/` | AppLayout, Sidebar, Header, NavLink |
| `src/components/resident/` | 16 tab components for ResidentProfile |
| `src/pages/ResidentProfile.tsx` | Renders all 16 tabs via `<Tabs>` |

---

## Resident profile tabs (all 16 exist)

ProgressNotes, Checklists, Tasks (AssignTask), Forms, Assessments, Pathways, Charts, CarePlan, ANACC, ActiveWounds, Movements, Document, Details, Cards, Doctors, Contacts

Each tab component lives in `src/components/resident/<Name>Tab.tsx` and receives `residentId` as a prop.

---

## Mock data shape (key interfaces)

```ts
Resident { id, name, preferredName?, room, doa, age, gender, status, respite, onLeave,
           acdp, cpr, bgl, mobile, ihi, anAcc, task, alert, doctor, medicareCard,
           concessionNumber, nok, residence, urn, diagnosis, allergies, photo?,
           careLevel, accountStatus, nationality? }

Task { id, residentId, residentName, title, assignedTo, area, status, dueDate, notes?,
       priority, createdBy }

ProgressNote { id, residentId, date, time, category, note, author }

Checklist { id, residentId, type, date, items: ChecklistItem[], completedBy? }

CarePlan { id, residentId, type, observations, goals, interventions, reviewDate,
           createdBy, createdAt, status }

Wound { id, residentId, startedDate, onAdmission, woundType, location, dressingProduct,
        nextDressing, lastReview, nextReview, status, lastPhoto? }

Movement { id, residentId, date, time, type, note, recordedBy }
```

Resident-profile detail domains (one array per tab, all keyed by `residentId`, covering all 5 mock residents): `residentDoctors`, `residentContacts`, `residentCards`, `vitalReadings`, `weightReadings`, `chartBglReadings`, `behaviorReadings`, `carePathways`, `assessmentRecords`, `anaccDetails`, `residentDocuments`. `chartBglReadings` only exists for residents with `bgl: true`.

Facility-wide constants: `forms` (40+ names), `movementTypes` (22), `staffUsers`, `facilityDocuments`, `carePlanCategories` (7, used by the CarePlan tab's icon tiles), `clinicalForms` (used by the Forms tab).

---

## Domain knowledge (Australian aged care)

- **AN-ACC** — Australian National Aged Care Classification (funding model, replaced ACFI)
- **Pathways** — Clinical triggers that activate specific care registers per resident
- **ACD** — Advance Care Directive (end-of-life wishes document)
- **CPR status** — "FOR" or "NOT FOR" resuscitation
- **IHI** — Individual Healthcare Identifier (national ID)
- **URN** — Unique Resident Number (facility-level ID)
- **NOK** — Next of Kin
- **Respite** — Short-term stay (vs Permanent)
- **BGL** — Blood Glucose Level (monitored daily for diabetic residents)

---

## What is NOT yet built (pending modules)

These are fully documented in the source PDFs but not implemented:

1. **Clinical Lists & Registers** — BGL Register (weekly grid), BP Register, SIRS, Incident registers, Resident Weights, Infection Monitoring, Self-Medication + 9 report types + 20 list types
2. **Clinical Handover Notes** — Daily/weekly shift notes between nurses, Carry Forward Notes
3. **New Admission Sequence** — 17-day onboarding roadmap (Day 0 to Day 17)
4. **Resident Vaccination** — COVID, Flu and other vaccination dose tracking
5. **Wellbeing module** — Multi-resident Activity Chart, Wellbeing Calendar, Activity Plan & Evaluation
6. **Clinical Charts (top-level)** — Nurse Chart Schedule, Restrictive Practices (Chemical + Non-Chemical)
7. **Appointment Book** — Resident appointment scheduling
8. **Assessment Matrix** — Facility-wide grid view of all assessments
9. **Care Plans Matrix** — Facility-wide grid view of all care plans
10. **Global Search** — Search Progress Notes and Forms & Assessments across all residents
11. **Care Statements** — Clinical statement generation
12. **Referrals** — Allied health referral tracking
13. **User & Access Management** — Create users, assign roles, activate/deactivate
14. **Audit & History** — User activity logs, record change history

### Partially built (exists but needs real functionality)

- **Forms tab** — Lists 40+ form names but doesn't render actual form fields
- **Wounds tab** — Missing the weekly dressing grid (coloured squares per date)
- **BGL charting** — Needs weekly grid with click-to-enter per day
- **Checklist tab** — Items not interactively checkable
- **Documents tab** — Shows categories only, no upload/view
- **AN-ACC tab** — File upload not wired
- **Care Plan tab** — AI summary feature expected per PDF notes

---

## Sidebar navigation (current vs needed)

Currently has 6 links: Dashboard, Residents, Tasks, Documents, Reports, Settings.

The full system requires ~17 top-level sections in the clinical nav. When extending the sidebar, add new routes and link them here.

---

## Coding conventions in this project

- No comments unless the WHY is non-obvious
- Prefer editing existing files over creating new ones
- All shadcn/ui components are in `src/components/ui/` and were written manually
- Use `cn()` from `src/lib/utils.ts` for conditional classNames
- TypeScript strict mode — no unused imports (build will fail)
- Mock data is the source of truth until a backend is connected
