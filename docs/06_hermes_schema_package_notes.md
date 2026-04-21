# 06_hermes_schema_package_notes.md

This package is the next numbered drop in your Hermes folder sequence.

## Files in this package

- `05_hermes_full_schema_production.sql`
- `06_hermes_schema_package_notes.md`
- `07_hermes_schema_install_order.md`
- `08_hermes_sample_records.sql`

## Purpose

This package upgrades the earlier starter schema into a fuller production-oriented memory layer for:

- interview sessions
- question / answer capture
- normalized extractions
- rule promotion
- approvals
- conflict tracking
- memory packets
- agent bindings

## Recommended folder structure

```text
/OpenClaw_Build/
  /01_Hermes/
    01_hermes_ui_spec.md
    02_hermes_schema.sql
    03_hermes_integration.md
    04_hermes_api_contracts.yaml
    05_hermes_full_schema_production.sql
    06_hermes_schema_package_notes.md
    07_hermes_schema_install_order.md
    08_hermes_sample_records.sql
```

## Important note

This is still intentionally neutral on auth tables and app-specific user foreign keys, because your final repo may use:

- Supabase auth
- custom RBAC tables
- NextAuth / Auth.js
- another internal identity layer

So I left those references nullable for safe integration.

## Best next follow-on file

After this schema package, the strongest next build file is:

`09_hermes_api_route_handlers.ts`

That’s the point where the UI and DB actually start talking.
