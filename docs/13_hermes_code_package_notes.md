# 13_hermes_code_package_notes.md

This package continues your Hermes sequence with actual TypeScript starter files.

## Files in this package

- `09_hermes_api_route_handlers.ts`
- `10_hermes_service_layer.ts`
- `11_agent_memory_service.ts`
- `12_hermes_packet_builder.ts`
- `13_hermes_code_package_notes.md`

## What this package gives you

### 09
Thin route handlers for:
- session start
- answer submit
- extraction approval
- rule promotion
- packet creation
- agent memory retrieval

### 10
Core Hermes service layer for:
- sessions
- answer handling
- extraction creation
- approval flow
- rule promotion
- packet creation

### 11
Task-scoped agent memory loading so agents do not receive the entire world every time

### 12
A packet builder that turns approved rules and friction points into agent-consumable packets

## Strongest next numbered package

- `14_hermes_question_bank.ts`
- `15_hermes_conflict_detector.ts`
- `16_hermes_approval_policy.ts`
- `17_hermes_ui_routes_and_components.md`

That would give you the next clean layer after schema + routes + services.
