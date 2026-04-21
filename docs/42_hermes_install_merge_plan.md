# 42_hermes_install_merge_plan.md

This file is the practical merge plan for moving the Hermes package sequence
from your laptop staging area into a real Next.js repo.

## Goal

Take the numbered files you have downloaded and merge them into a clean repo
without losing the order of operations or creating import chaos.

---

## Recommended staging structure on laptop

```text
/OpenClaw_Build/
  /01_Hermes/
    01_hermes_ui_spec.md
    02_hermes_schema.sql
    03_hermes_integration.md
    04_hermes_api_contracts.yaml
    05_hermes_full_schema_production.sql
    ...
    43_hermes_build_day_checklist.md
```

Keep the numbered source files intact.
Do not rename them until they are safely copied into repo structure.

---

## Recommended repo target structure

```text
src/
  generated/
    hermes/
      09_hermes_api_route_handlers.ts
      10_hermes_service_layer.ts
      11_agent_memory_service.ts
      12_hermes_packet_builder.ts
      14_hermes_question_bank.ts
      15_hermes_conflict_detector.ts
      16_hermes_approval_policy.ts
      19_hermes_session_workspace.tsx
      20_hermes_approval_card.tsx
      21_hermes_conflict_card.tsx
      22_hermes_memory_dashboard.tsx
      24_hermes_session_api_hooks.ts
      25_hermes_approval_queue_page.tsx
      26_hermes_conflicts_page.tsx
      27_hermes_memory_page.tsx
      30_hermes_layout.tsx
      31_hermes_navigation.tsx
      32_hermes_dashboard_page.tsx
      35_hermes_session_page.tsx
      36_hermes_approvals_page_wrapper.tsx
      37_hermes_conflicts_page_wrapper.tsx
      38_hermes_memory_page_wrapper.tsx
      40_hermes_layout_wrapper.tsx
      41_hermes_dashboard_page_wrapper.tsx

app/
  hermes/
    layout.tsx
    page.tsx
    approvals/
      page.tsx
    conflicts/
      page.tsx
    memory/
      page.tsx
    sessions/
      [id]/
        page.tsx

db/
  migrations/
    05_hermes_full_schema_production.sql
    08_hermes_sample_records.sql

docs/
  hermes/
    01_hermes_ui_spec.md
    03_hermes_integration.md
    06_hermes_schema_package_notes.md
    07_hermes_schema_install_order.md
    13_hermes_code_package_notes.md
    17_hermes_ui_routes_and_components.md
    18_hermes_intelligence_package_notes.md
    23_hermes_ui_components_package_notes.md
    28_hermes_pages_package_notes.md
    29_hermes_app_router_setup.md
    33_hermes_app_shell_package_notes.md
    34_hermes_route_wrapper_files.md
    39_hermes_route_mount_package_notes.md
    42_hermes_install_merge_plan.md
    43_hermes_build_day_checklist.md
```

---

## Merge order

### Phase 1 — docs + schema
1. copy markdown docs into `docs/hermes/`
2. copy SQL into `db/migrations/`
3. run schema locally against development database

### Phase 2 — service/backend layer
1. add `09`, `10`, `11`, `12`
2. fix import paths
3. wire real database implementation into service layer
4. stub missing API endpoints if needed

### Phase 3 — intelligence layer
1. add `14`, `15`, `16`
2. connect question bank to session creation
3. connect approval policy to promotion flow
4. connect conflict detector to rule review flow

### Phase 4 — UI components and pages
1. add `19`, `20`, `21`, `22`
2. add `24`, `25`, `26`, `27`
3. add `30`, `31`, `32`
4. add `35`, `36`, `37`, `38`, `40`, `41`

### Phase 5 — route mounting
1. create `/app/hermes/*`
2. place wrapper files into route paths
3. test navigation end-to-end

---

## First path fixes to expect

Because the numbered files were generated as portable package pieces, you will likely need to update:

- relative imports
- alias paths
- app root assumptions
- shared component paths

Recommended improvement after first copy:

- replace relative imports with repo aliases like `@/generated/hermes/...`

Example:

```tsx
import HermesDashboardPage from "@/generated/hermes/32_hermes_dashboard_page";
```

---

## First smoke test checklist

- `/hermes` loads
- `/hermes/approvals` loads
- `/hermes/conflicts` loads
- `/hermes/memory` loads
- `/hermes/sessions/test-session` loads
- sidebar navigation works
- answer submission hits API
- approval action hits API
- memory page loads packets

---

## Important implementation note

`10_hermes_service_layer.ts` currently uses placeholder in-memory persistence.
Before treating Hermes as production-ready, replace that with:
- real repository methods
- real DB reads/writes
- real auth context
- approval actor IDs from session/user

---

## Strongest next follow-on after merge

Once merged, the strongest next move is not more wrappers.
It is:

- real repository implementation
- route completion for missing GET endpoints
- seed demo data
- first live walkthrough inside the repo
