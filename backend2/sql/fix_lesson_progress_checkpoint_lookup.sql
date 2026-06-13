-- Fix for:
-- ERROR: 42703: column c.completed does not exist
-- in fn_lesson_progress_on_quiz_attempt_true()
--
-- Root cause:
-- `checkpoints` is checkpoint metadata. Student-specific completion lives in
-- `checkpoints_progress`, which has `s_id`, `completed`, and `completed_at`.

-- Use this replacement inside public.fn_lesson_progress_on_quiz_attempt_true()
-- wherever the function currently does:
--
--   SELECT c.completed
--   FROM public.checkpoints c
--   WHERE c.checkpoint_id = next_lesson_checkpoint_id
--     AND c.s_id = NEW.s_id
--
-- Replacement:
SELECT COALESCE((
  SELECT cp.completed
  FROM public.checkpoints_progress cp
  WHERE cp.checkpoint_id = next_lesson_checkpoint_id
    AND cp.s_id = NEW.s_id
  ORDER BY cp.created_at DESC
  LIMIT 1
), false);

-- If you want a direct one-time patch for the existing function definition,
-- run this in Supabase SQL editor. It rewrites only the faulty lookup shape
-- that filters checkpoint completion by NEW.s_id.
DO $$
DECLARE
  function_sql text;
  patched_sql text;
BEGIN
  SELECT pg_get_functiondef('public.fn_lesson_progress_on_quiz_attempt_true()'::regprocedure)
  INTO function_sql;

  IF function_sql IS NULL THEN
    RAISE EXCEPTION 'Function public.fn_lesson_progress_on_quiz_attempt_true() not found';
  END IF;

  patched_sql := regexp_replace(
    function_sql,
    'FROM\s+public\.checkpoints\s+c\s+WHERE\s+c\.checkpoint_id\s*=\s*next_lesson_checkpoint_id\s+AND\s+c\.s_id\s*=\s*NEW\.s_id',
    'FROM public.checkpoints_progress c
  WHERE c.checkpoint_id = next_lesson_checkpoint_id
    AND c.s_id = NEW.s_id',
    'g'
  );

  IF patched_sql = function_sql THEN
    RAISE EXCEPTION 'No matching faulty checkpoint lookup was found';
  END IF;

  EXECUTE patched_sql;
END $$;
