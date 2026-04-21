# 29_hermes_app_router_setup.md

This file defines the recommended App Router structure for Hermes inside a Next.js codebase.

## Goal

Wrap the previously generated Hermes pages in a single navigable app shell.

## Recommended directory structure

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
components/
  hermes/
    HermesLayout.tsx
    HermesNavigation.tsx
    HermesDashboardPage.tsx
```

## Route mapping

### `/hermes`
Use:
- `32_hermes_dashboard_page.tsx`

Purpose:
- landing page
- show active sessions
- pending approvals
- unresolved conflicts
- memory packet summary

---

### `/hermes/approvals`
Use:
- `25_hermes_approval_queue_page.tsx`

Purpose:
- extraction / rule / packet approval queue

---

### `/hermes/conflicts`
Use:
- `26_hermes_conflicts_page.tsx`

Purpose:
- conflict review and resolution

---

### `/hermes/memory`
Use:
- `27_hermes_memory_page.tsx`

Purpose:
- review active packets and agent memory

---

### `/hermes/sessions/[id]`
Use:
- `19_hermes_session_workspace.tsx`

Purpose:
- run structured interview sessions

## Suggested wrapper page files

### `app/hermes/page.tsx`

```tsx
export { default } from "../../32_hermes_dashboard_page";
```

### `app/hermes/approvals/page.tsx`

```tsx
export { default } from "../../../25_hermes_approval_queue_page";
```

### `app/hermes/conflicts/page.tsx`

```tsx
export { default } from "../../../26_hermes_conflicts_page";
```

### `app/hermes/memory/page.tsx`

```tsx
export { default } from "../../../27_hermes_memory_page";
```

## Session page example

### `app/hermes/sessions/[id]/page.tsx`

```tsx
import HermesSessionWorkspace from "../../../../19_hermes_session_workspace";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HermesSessionWorkspace sessionId={id} />;
}
```

## Recommended build order

1. `30_hermes_layout.tsx`
2. `31_hermes_navigation.tsx`
3. `32_hermes_dashboard_page.tsx`
4. app route wrapper files

## Notes

- Keep Hermes isolated under `/hermes` first.
- Do not merge it into the broader visual office shell too early.
- Once stable, Hermes can become one wing of the full OpenClaw control center.
