-- 08_hermes_sample_records.sql

-- Example session
insert into hermes_sessions (
  subject_type,
  title,
  mode,
  layer,
  status
) values (
  'person',
  'John pricing logic extraction',
  'guided',
  'decision_logic',
  'active'
);

-- Example question
insert into hermes_questions (
  session_id,
  question_code,
  question_text,
  layer,
  sequence_no
)
select
  id,
  'DECISION_PRICING_001',
  'When do you decide to sell a batch early instead of holding for a better price?',
  'decision_logic',
  1
from hermes_sessions
where title = 'John pricing logic extraction'
limit 1;

-- Example answer
insert into hermes_answers (
  session_id,
  question_id,
  answer_text,
  answer_format
)
select
  s.id,
  q.id,
  'If the batch hits 30 percent THC and smells loud I often move some early at 800 a pound to open doors fast.',
  'text'
from hermes_sessions s
join hermes_questions q on q.session_id = s.id
where s.title = 'John pricing logic extraction'
  and q.question_code = 'DECISION_PRICING_001'
limit 1;

-- Example extraction
insert into hermes_extractions (
  session_id,
  answer_id,
  extraction_type,
  layer,
  raw_json,
  normalized_json,
  confidence_score,
  needs_review
)
select
  a.session_id,
  a.id,
  'rule',
  'decision_logic',
  jsonb_build_object(
    'source_text', a.answer_text
  ),
  jsonb_build_object(
    'rule_family', 'pricing',
    'condition', jsonb_build_array(
      jsonb_build_object('field', 'total_thc_percent', 'operator', '>=', 'value', 30),
      jsonb_build_object('field', 'smell_score', 'operator', '>=', 'value', 8)
    ),
    'action', jsonb_build_array(
      jsonb_build_object('type', 'allocate_to_wholesale', 'value_percent', 30),
      jsonb_build_object('type', 'set_price_floor_per_lb', 'value', 800)
    )
  ),
  0.8600,
  true
from hermes_answers a
order by a.created_at desc
limit 1;
