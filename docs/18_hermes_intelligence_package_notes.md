# 18_hermes_intelligence_package_notes.md

This package continues the Hermes sequence with the reusable intelligence layer.

## Files in this package

- `14_hermes_question_bank.ts`
- `15_hermes_conflict_detector.ts`
- `16_hermes_approval_policy.ts`
- `17_hermes_ui_routes_and_components.md`
- `18_hermes_intelligence_package_notes.md`

## Why this package matters

Earlier packages gave you:
- schema
- route handlers
- service layer
- packet builder

This package adds the decision support layer that keeps Hermes from being a dumb form.

### 14
Defines the reusable interview question bank and follow-up generation logic.

### 15
Detects collisions between rules and terminology so memory does not drift into contradiction.

### 16
Classifies approval risk and prevents unsafe auto-promotion.

### 17
Maps routes and shared UI components so front-end build order is explicit.

## Strongest next numbered package

- `19_hermes_session_workspace.tsx`
- `20_hermes_approval_card.tsx`
- `21_hermes_conflict_card.tsx`
- `22_hermes_memory_dashboard.tsx`

That would move you from architecture files into actual front-end component scaffolds.
