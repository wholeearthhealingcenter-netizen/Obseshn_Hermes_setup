# 17_hermes_ui_routes_and_components.md

This file maps Hermes UI routes to their components and page responsibilities.

## Primary routes

### `/app/hermes`
Purpose:
- landing page for Hermes
- show active sessions
- show pending approvals
- show conflicts needing review
- show recent packet promotions

Suggested page sections:
- Continue active session
- Pending approvals
- New conflicts
- Recently activated packets

Primary components:
- `HermesDashboardShell`
- `HermesSessionCard`
- `HermesApprovalQueueCard`
- `HermesConflictSummaryCard`
- `HermesPacketSummaryCard`

---

### `/app/hermes/sessions`
Purpose:
- all session list
- filter by subject, layer, status, owner

Primary components:
- `HermesSessionFilters`
- `HermesSessionTable`
- `HermesSessionStatusBadge`

---

### `/app/hermes/sessions/[id]`
Purpose:
- interview workspace
- question flow
- answer input
- extraction preview
- follow-up prompts

Page layout:
- left rail: layer progress tree
- center: current question + answer input
- right rail: structured extraction preview + ambiguity warnings

Primary components:
- `HermesSessionShell`
- `HermesQuestionCard`
- `HermesAnswerInput`
- `HermesFollowUpList`
- `HermesStructurePreview`
- `HermesAmbiguityAlert`
- `HermesProgressSidebar`

---

### `/app/hermes/approvals`
Purpose:
- approval queue for rules, packets, extractions
- swipe or button review model

Primary components:
- `HermesApprovalCard`
- `HermesApprovalActions`
- `HermesDecisionNotesInput`
- `HermesApprovalFilterBar`

Approval actions:
- approve
- reject
- return with notes
- hold

---

### `/app/hermes/conflicts`
Purpose:
- review rule conflicts and terminology collisions
- choose merge / contextualize / reject / escalate

Primary components:
- `HermesConflictCard`
- `HermesConflictDiffView`
- `HermesConflictActions`
- `HermesResolutionNotes`

---

### `/app/hermes/memory`
Purpose:
- inspect built packets
- activate / supersede packets
- bind packets to agents

Primary components:
- `HermesMemoryPacketCard`
- `HermesPacketVersionList`
- `HermesAgentBindingEditor`
- `HermesPacketActivationBar`

---

### `/app/hermes/capture`
Purpose:
- fast capture mode
- voice note or quick text dump
- tag by area

Primary components:
- `HermesVoiceCaptureButton`
- `HermesQuickCaptureInput`
- `HermesTagPicker`
- `HermesCaptureQueueList`

---

## Shared component list

```text
components/hermes/
  HermesDashboardShell.tsx
  HermesSessionCard.tsx
  HermesQuestionCard.tsx
  HermesAnswerInput.tsx
  HermesFollowUpList.tsx
  HermesStructurePreview.tsx
  HermesAmbiguityAlert.tsx
  HermesProgressSidebar.tsx
  HermesApprovalCard.tsx
  HermesApprovalActions.tsx
  HermesConflictCard.tsx
  HermesConflictDiffView.tsx
  HermesMemoryPacketCard.tsx
  HermesAgentBindingEditor.tsx
  HermesVoiceCaptureButton.tsx
  HermesQuickCaptureInput.tsx
  HermesTagPicker.tsx
```

---

## Recommended UI build order

1. `/app/hermes/sessions/[id]`
2. `/app/hermes/approvals`
3. `/app/hermes`
4. `/app/hermes/memory`
5. `/app/hermes/conflicts`
6. `/app/hermes/capture`

Reason:
The session workspace and approvals unlock the core loop first.
