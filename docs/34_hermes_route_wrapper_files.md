# 34_hermes_route_wrapper_files.md

This package finishes the direct App Router mounting layer for Hermes.

## Goal

Take the earlier generated component/page files and mount them cleanly into a real Next.js `app/` directory.

## Recommended structure

```text
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
```

## File mapping

### `app/hermes/layout.tsx`
Use:
- `30_hermes_layout.tsx`

### `app/hermes/page.tsx`
Use:
- `32_hermes_dashboard_page.tsx`
or
- `35_hermes_session_page.tsx` only if you want a session-first landing flow

### `app/hermes/approvals/page.tsx`
Use:
- `36_hermes_approvals_page_wrapper.tsx`

### `app/hermes/conflicts/page.tsx`
Use:
- `37_hermes_conflicts_page_wrapper.tsx`

### `app/hermes/memory/page.tsx`
Use:
- `38_hermes_memory_page_wrapper.tsx`

### `app/hermes/sessions/[id]/page.tsx`
Use:
- `35_hermes_session_page.tsx`

---

## Recommended imports

Because your generated files may live temporarily at repo root or in a staging folder during laptop build-out, the wrappers use relative imports you can easily adjust.

Example migration target:

```text
src/
  generated/
    hermes/
      19_hermes_session_workspace.tsx
      25_hermes_approval_queue_page.tsx
      26_hermes_conflicts_page.tsx
      27_hermes_memory_page.tsx
      30_hermes_layout.tsx
      32_hermes_dashboard_page.tsx
```

Then update imports accordingly.

---

## Route mounting order

1. mount `layout.tsx`
2. mount dashboard `page.tsx`
3. mount session route
4. mount approvals/conflicts/memory routes

---

## Minimal route-mount checklist

- [ ] `/hermes` opens dashboard
- [ ] `/hermes/sessions/test-session` opens session workspace
- [ ] `/hermes/approvals` opens approval queue
- [ ] `/hermes/conflicts` opens conflict review
- [ ] `/hermes/memory` opens memory dashboard
- [ ] sidebar navigation works under layout

---

## Important note

These wrappers are intentionally very thin.
Do not place business logic in them.
Keep business logic in:
- API routes
- service layer
- packet builder
- memory service
