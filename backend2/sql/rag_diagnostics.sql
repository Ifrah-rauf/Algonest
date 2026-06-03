-- Run this in the Supabase SQL editor to verify pgvector schema details.

-- 1. RPC functions should exist.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_arguments(p.oid) as arguments,
  pg_get_function_result(p.oid) as result_type
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('match_student_messages', 'match_mentor_feedback')
order by p.proname;

-- 2. Embedding columns should be vector(384).
select
  table_name,
  column_name,
  udt_name,
  format_type(a.atttypid, a.atttypmod) as formatted_type
from information_schema.columns c
join pg_class cls on cls.relname = c.table_name
join pg_namespace ns on ns.oid = cls.relnamespace and ns.nspname = c.table_schema
join pg_attribute a on a.attrelid = cls.oid and a.attname = c.column_name
where c.table_schema = 'public'
  and c.table_name in ('chat_messages', 'conv_history', 'mentor_feedback_embeddings')
  and c.column_name = 'embedding'
order by table_name;

-- 3. pgvector indexes should exist on embedding columns.
select
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('chat_messages', 'conv_history', 'mentor_feedback_embeddings')
  and indexdef ilike '%embedding%'
order by tablename, indexname;

-- 4. Expected HNSW index shape should look like:
-- create index ... on public.chat_messages using hnsw (embedding vector_cosine_ops) with (m = '16', ef_construction = '200');
-- create index ... on public.mentor_feedback_embeddings using hnsw (embedding vector_cosine_ops) with (m = '16', ef_construction = '200');
