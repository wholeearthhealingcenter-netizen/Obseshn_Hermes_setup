-- Hermes Core Schema (Condensed)
create table hermes_sessions (
  id uuid primary key,
  title text,
  mode text,
  status text,
  created_at timestamptz default now()
);

create table hermes_questions (
  id uuid primary key,
  session_id uuid,
  question_text text
);

create table hermes_answers (
  id uuid primary key,
  question_id uuid,
  answer_text text
);

create table hermes_extractions (
  id uuid primary key,
  extraction_type text,
  raw_json jsonb,
  normalized_json jsonb
);

create table hermes_rules (
  id uuid primary key,
  condition_json jsonb,
  action_json jsonb,
  status text
);
