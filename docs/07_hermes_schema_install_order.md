# 07_hermes_schema_install_order.md

## Recommended execution order

1. Create PostgreSQL database
2. Enable `pgcrypto`
3. Run `05_hermes_full_schema_production.sql`
4. Optionally run `08_hermes_sample_records.sql`
5. Build API handlers against these tables
6. Build UI routes for:
   - sessions
   - answers
   - approvals
   - conflicts
   - memory packets

## Suggested route order after schema

1. `POST /api/hermes/sessions`
2. `POST /api/hermes/sessions/:id/answers`
3. `POST /api/hermes/extractions/:id/approve`
4. `POST /api/hermes/extractions/:id/promote-rule`
5. `POST /api/hermes/packets`
6. `POST /api/hermes/agent-bindings`

## Suggested service layer order

1. HermesSessionService
2. HermesExtractionService
3. HermesRuleService
4. HermesPacketService
5. AgentMemoryService
6. OzzyKnowledgeService

## Suggested UI order

1. sessions dashboard
2. interview workspace
3. approval cards
4. packet review
5. conflict resolution screen
