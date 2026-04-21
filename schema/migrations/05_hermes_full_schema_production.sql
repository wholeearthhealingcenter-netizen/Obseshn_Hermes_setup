-- 05_hermes_full_schema_production.sql
-- Hermes v1 production schema
-- Purpose:
--   Structured interview capture, extraction, approval, rule promotion,
--   memory packet generation, and agent memory binding for OpenClaw.
--
-- Notes:
-- - Assumes PostgreSQL with pgcrypto available for gen_random_uuid()
-- - Add your own auth/user tables and foreign keys as appropriate
-- - Designed so raw user input is always preserved alongside normalized output

create extension if not exists pgcrypto;

-- =========================================================
-- sessions
-- =========================================================
create table if not exists hermes_sessions (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null, -- person, role, department, system
  subject_id uuid null,
  title text not null,
  mode text not null, -- guided, fast_capture, validation, replay
  layer text null, -- operating_rhythm, decision_logic, inputs, dependencies, friction
  status text not null default 'active', -- active, paused, completed, archived
  started_by uuid null,
  assigned_reviewer uuid null,
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- questions
-- =========================================================
create table if not exists hermes_questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references hermes_sessions(id) on delete cascade,
  question_code text not null,
  question_text text not null,
  layer text not null,
  sequence_no integer not null,
  parent_question_id uuid null references hermes_questions(id),
  generated_by text not null default 'system', -- system, hermes, reviewer
  status text not null default 'asked', -- asked, answered, skipped, superseded
  created_at timestamptz not null default now()
);

create unique index if not exists idx_hermes_questions_session_code
  on hermes_questions(session_id, question_code, sequence_no);

-- =========================================================
-- answers
-- =========================================================
create table if not exists hermes_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references hermes_sessions(id) on delete cascade,
  question_id uuid null references hermes_questions(id) on delete set null,
  answer_text text not null,
  answer_format text not null default 'text', -- text, voice_transcript, structured_form
  speaker_id uuid null,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- =========================================================
-- extractions
-- =========================================================
create table if not exists hermes_extractions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references hermes_sessions(id) on delete cascade,
  answer_id uuid null references hermes_answers(id) on delete set null,
  extraction_type text not null, -- rule, rhythm, entity, dependency, friction, metric, threshold
  layer text not null,
  raw_json jsonb not null,
  normalized_json jsonb not null,
  confidence_score numeric(5,4) null,
  needs_review boolean not null default true,
  created_by text not null default 'hermes',
  created_at timestamptz not null default now()
);

-- =========================================================
-- entities
-- =========================================================
create table if not exists hermes_entities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null, -- strain, room, person, vendor, metric, task_type
  canonical_name text not null,
  aliases jsonb not null default '[]'::jsonb,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_hermes_entities_type_name
  on hermes_entities(entity_type, canonical_name);

-- =========================================================
-- dependencies
-- =========================================================
create table if not exists hermes_dependencies (
  id uuid primary key default gen_random_uuid(),
  session_id uuid null references hermes_sessions(id) on delete set null,
  source_entity_id uuid not null references hermes_entities(id),
  depends_on_entity_id uuid not null references hermes_entities(id),
  dependency_type text not null, -- person, vendor, system, approval, input
  notes text null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- friction points
-- =========================================================
create table if not exists hermes_friction_points (
  id uuid primary key default gen_random_uuid(),
  session_id uuid null references hermes_sessions(id) on delete set null,
  area text not null, -- grow, sales, processing, finance, logistics
  issue text not null,
  impact text null,
  frequency text null,
  severity_score integer null,
  source_extraction_id uuid null references hermes_extractions(id) on delete set null,
  status text not null default 'open', -- open, accepted, mitigated, retired
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- rules
-- =========================================================
create table if not exists hermes_rules (
  id uuid primary key default gen_random_uuid(),
  rule_family text not null, -- pricing, allocation, irrigation, inventory, compliance
  subject_type text not null, -- person, team, department, company
  subject_id uuid null,
  title text not null,
  description text null,
  condition_json jsonb not null,
  action_json jsonb not null,
  exception_json jsonb null,
  context_json jsonb null,
  status text not null default 'draft', -- draft, approved, active, retired
  source_extraction_id uuid null references hermes_extractions(id) on delete set null,
  effective_at timestamptz null,
  retired_at timestamptz null,
  version_no integer not null default 1,
  created_by uuid null,
  approved_by uuid null,
  approved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_hermes_rules_family_status
  on hermes_rules(rule_family, status);

-- =========================================================
-- rule versions
-- =========================================================
create table if not exists hermes_rule_versions (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references hermes_rules(id) on delete cascade,
  version_no integer not null,
  condition_json jsonb not null,
  action_json jsonb not null,
  exception_json jsonb null,
  context_json jsonb null,
  change_reason text null,
  changed_by uuid null,
  created_at timestamptz not null default now(),
  unique(rule_id, version_no)
);

-- =========================================================
-- approvals
-- =========================================================
create table if not exists hermes_approvals (
  id uuid primary key default gen_random_uuid(),
  object_type text not null, -- extraction, rule, packet, policy
  object_id uuid not null,
  approver_id uuid not null,
  decision text not null, -- approve, reject, return, hold
  notes text null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- conflicts
-- =========================================================
create table if not exists hermes_conflicts (
  id uuid primary key default gen_random_uuid(),
  conflict_type text not null, -- rule_conflict, entity_conflict, terminology_conflict
  left_object_type text not null,
  left_object_id uuid not null,
  right_object_type text not null,
  right_object_id uuid not null,
  summary text not null,
  resolution_status text not null default 'open', -- open, merged, contextualized, rejected
  resolved_by uuid null,
  resolved_at timestamptz null,
  resolution_notes text null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- memory packets
-- =========================================================
create table if not exists hermes_memory_packets (
  id uuid primary key default gen_random_uuid(),
  packet_type text not null, -- user_profile, operating_rhythm, decision_pack, friction_pack, role_pack
  subject_type text not null,
  subject_id uuid null,
  title text not null,
  packet_json jsonb not null,
  source_session_id uuid null references hermes_sessions(id) on delete set null,
  source_rule_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft', -- draft, approved, active, superseded
  version_no integer not null default 1,
  approved_by uuid null,
  approved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- agent memory bindings
-- =========================================================
create table if not exists agent_memory_bindings (
  id uuid primary key default gen_random_uuid(),
  agent_key text not null, -- ozzy, hermes, openclaw_sales, openclaw_grow
  packet_id uuid not null references hermes_memory_packets(id) on delete cascade,
  priority integer not null default 100,
  is_active boolean not null default true,
  visibility_scope text not null default 'agent_only', -- agent_only, shared, global
  created_at timestamptz not null default now(),
  unique(agent_key, packet_id)
);

-- =========================================================
-- event log
-- =========================================================
create table if not exists hermes_event_log (
  id uuid primary key default gen_random_uuid(),
  session_id uuid null references hermes_sessions(id) on delete set null,
  event_type text not null,
  payload_json jsonb not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- indexes
-- =========================================================
create index if not exists idx_hermes_sessions_status on hermes_sessions(status);
create index if not exists idx_hermes_questions_session on hermes_questions(session_id);
create index if not exists idx_hermes_answers_session on hermes_answers(session_id);
create index if not exists idx_hermes_extractions_layer on hermes_extractions(layer);
create index if not exists idx_hermes_memory_packets_status on hermes_memory_packets(status);
create index if not exists idx_agent_memory_bindings_agent_active on agent_memory_bindings(agent_key, is_active);
create index if not exists idx_hermes_friction_points_area_status on hermes_friction_points(area, status);

-- =========================================================
-- seed examples
-- =========================================================
insert into hermes_entities (entity_type, canonical_name, metadata_json)
values
  ('person', 'John', '{"role":"owner_operator"}'),
  ('system', 'OpenClaw', '{"type":"agent_orchestrator"}'),
  ('system', 'Ozzy', '{"type":"top_level_router"}')
on conflict do nothing;
