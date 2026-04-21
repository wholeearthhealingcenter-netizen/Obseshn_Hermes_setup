# 43_hermes_build_day_checklist.md

This is the practical build-day checklist for standing up Hermes in the repo.

## Before you start

- [ ] Create or choose the target Next.js repo
- [ ] Confirm Node / package manager version
- [ ] Confirm Tailwind is installed
- [ ] Confirm PostgreSQL dev database is available
- [ ] Make a backup copy of the numbered Hermes package files

---

## Phase 1 — folder setup

- [ ] Create `src/generated/hermes/`
- [ ] Create `docs/hermes/`
- [ ] Create `db/migrations/`
- [ ] Create `app/hermes/`
- [ ] Create route folders:
  - [ ] `app/hermes/approvals/`
  - [ ] `app/hermes/conflicts/`
  - [ ] `app/hermes/memory/`
  - [ ] `app/hermes/sessions/[id]/`

---

## Phase 2 — copy numbered files

### Docs
- [ ] Copy Hermes markdown docs into `docs/hermes/`

### SQL
- [ ] Copy `05_hermes_full_schema_production.sql`
- [ ] Copy `08_hermes_sample_records.sql`

### TS/TSX
- [ ] Copy generated Hermes TS/TSX files into `src/generated/hermes/`

---

## Phase 3 — database

- [ ] Run `05_hermes_full_schema_production.sql`
- [ ] Optionally run `08_hermes_sample_records.sql`
- [ ] Confirm tables exist:
  - [ ] `hermes_sessions`
  - [ ] `hermes_questions`
  - [ ] `hermes_answers`
  - [ ] `hermes_extractions`
  - [ ] `hermes_rules`
  - [ ] `hermes_memory_packets`
  - [ ] `agent_memory_bindings`

---

## Phase 4 — route files

- [ ] Add `layout.tsx`
- [ ] Add dashboard `page.tsx`
- [ ] Add approvals route page
- [ ] Add conflicts route page
- [ ] Add memory route page
- [ ] Add session `[id]` page

---

## Phase 5 — import cleanup

- [ ] Fix all relative imports
- [ ] Prefer repo alias paths if available
- [ ] Confirm no duplicate component names
- [ ] Confirm `"use client"` only where needed

---

## Phase 6 — smoke test

- [ ] `npm run dev` or equivalent
- [ ] Open `/hermes`
- [ ] Open `/hermes/approvals`
- [ ] Open `/hermes/conflicts`
- [ ] Open `/hermes/memory`
- [ ] Open `/hermes/sessions/test-session`

---

## Phase 7 — first functional checks

- [ ] Submit a session answer
- [ ] Confirm extraction preview renders
- [ ] Approve an extraction
- [ ] Open memory page
- [ ] Confirm packets appear or fail cleanly
- [ ] Confirm no route crashes

---

## Phase 8 — production-hardening notes

Do not forget these are still needed:

- [ ] Replace in-memory service persistence in `10_hermes_service_layer.ts`
- [ ] Add real GET route handlers where hooks expect them
- [ ] Add auth context for approver identity
- [ ] Add repo-level lint/typecheck pass
- [ ] Add seed/demo fixtures
- [ ] Add logging and error boundaries

---

## End-of-day success definition

Build day is a success if:

- Hermes opens in the repo
- the main routes render
- a session can be simulated
- the approval page renders
- the memory page renders
- the import structure is stable enough for next-day refinement

That is enough to move from staging files into a live working workspace.
