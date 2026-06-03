alter table public.lessons
  add column if not exists structured_content jsonb,
  add column if not exists lesson_structure jsonb,
  add column if not exists content_schema jsonb,
  add column if not exists static_topics jsonb,
  add column if not exists ai_industry_questions jsonb,
  add column if not exists guided_assets jsonb,
  add column if not exists ai_companion_tasks jsonb,
  add column if not exists deliverable text,
  add column if not exists commit_deliverable text,
  add column if not exists micro_proof jsonb;

alter table public.lesson_progress
  add column if not exists ready_to_unlock boolean default false;

create table if not exists public.lesson_ai_questions (
  id serial primary key,
  user_id integer references public.student(s_id) on delete cascade,
  lesson_id bigint references public.lessons(lesson_id) on delete cascade,
  course_id integer references public.courses(course_id) on delete cascade,
  question_key text,
  question_text text,
  completed boolean default false,
  clicked_at timestamp default now()
);

create table if not exists public.lesson_asset_progress (
  id serial primary key,
  user_id integer references public.student(s_id) on delete cascade,
  lesson_id bigint references public.lessons(lesson_id) on delete cascade,
  course_id integer references public.courses(course_id) on delete cascade,
  asset_key text,
  answered boolean default false,
  answer_text text,
  answered_at timestamp default now()
);

create table if not exists public.lesson_commit_proofs (
  id serial primary key,
  user_id integer references public.student(s_id) on delete cascade,
  lesson_id bigint references public.lessons(lesson_id) on delete cascade,
  course_id integer references public.courses(course_id) on delete cascade,
  repo_url text,
  commit_sha text,
  deliverable text,
  micro_proof jsonb,
  verified boolean default false,
  submitted_at timestamp default now()
);

create index if not exists idx_lesson_ai_questions_user_lesson
  on public.lesson_ai_questions(user_id, lesson_id);

create index if not exists idx_lesson_asset_progress_user_lesson
  on public.lesson_asset_progress(user_id, lesson_id);

create index if not exists idx_lesson_commit_proofs_user_lesson
  on public.lesson_commit_proofs(user_id, lesson_id);

grant select, insert, update on table public.lesson_ai_questions to authenticated;
grant select, insert, update on table public.lesson_asset_progress to authenticated;
grant select, insert, update on table public.lesson_commit_proofs to authenticated;

grant usage, select on sequence public.lesson_ai_questions_id_seq to authenticated;
grant usage, select on sequence public.lesson_asset_progress_id_seq to authenticated;
grant usage, select on sequence public.lesson_commit_proofs_id_seq to authenticated;

drop table if exists public.lesson_topics_progress;
drop table if exists public.lesson_guided_evaluations;

-- lesson_topics is optional during migration because older roadmap APIs may still read it.
-- Uncomment after all clients use lessons.static_topics / structured JSON only.
-- drop table if exists public.lesson_topics;

update public.lessons
set
  structured_content = coalesce(structured_content, jsonb_build_object(
    'title', title,
    'goal', 'Build the lesson deliverable through guided practice.',
    'overview', 'Dummy structured lesson content',
    'sections', jsonb_build_array(
      jsonb_build_object('title', 'Understand', 'body', 'Review the core concept.'),
      jsonb_build_object('title', 'Apply', 'body', 'Use the concept in your project.')
    )
  )),
  static_topics = coalesce(static_topics, jsonb_build_array(
    'Project setup',
    'Request lifecycle',
    'Error handling'
  )),
  ai_industry_questions = coalesce(ai_industry_questions, jsonb_build_array(
    jsonb_build_object('key', 'industry_context', 'question', 'Where does this lesson show up in real products?'),
    jsonb_build_object('key', 'production_tradeoffs', 'question', 'What tradeoffs should a backend engineer consider here?')
  )),
  guided_assets = coalesce(guided_assets, jsonb_build_array(
    jsonb_build_object('key', 'explain_flow', 'prompt', 'Explain the request flow in your own words.'),
    jsonb_build_object('key', 'debug_case', 'prompt', 'Describe one bug you might hit and how you would inspect it.')
  )),
  ai_companion_tasks = coalesce(ai_companion_tasks, jsonb_build_array(
    'Ask the AI to review your reasoning.',
    'Ask for one edge case to consider.'
  )),
  deliverable = coalesce(deliverable, 'Submit a project commit that proves this lesson deliverable.'),
  micro_proof = coalesce(micro_proof, jsonb_build_array(
    'Working route or feature exists',
    'Commit message describes the lesson work'
  ))
where lesson_id in (
  select lesson_id
  from public.lessons
  order by order_index
  limit 3
);

insert into public.lesson_ai_questions (user_id, lesson_id, course_id, question_key, question_text, completed)
select 1, lesson_id, course_id, 'industry_context', 'Where does this lesson show up in real products?', false
from public.lessons
where lesson_id in (select lesson_id from public.lessons order by order_index limit 1)
on conflict do nothing;

insert into public.lesson_asset_progress (user_id, lesson_id, course_id, asset_key, answered, answer_text)
select 1, lesson_id, course_id, 'explain_flow', false, null
from public.lessons
where lesson_id in (select lesson_id from public.lessons order by order_index limit 1)
on conflict do nothing;

insert into public.lesson_commit_proofs (user_id, lesson_id, course_id, repo_url, commit_sha, deliverable, micro_proof, verified)
select
  1,
  lesson_id,
  course_id,
  'https://github.com/example/job-tracker',
  'abc1234',
  'Dummy commit proof',
  jsonb_build_array('Dummy micro proof'),
  false
from public.lessons
where lesson_id in (select lesson_id from public.lessons order by order_index limit 1)
on conflict do nothing;

insert into public.lesson_progress (s_id, lesson_id, completed, quiz_attempt, ready_to_unlock)
select 1, lesson_id, false, false, false
from public.lessons
where lesson_id in (select lesson_id from public.lessons order by order_index limit 3)
on conflict do nothing;
