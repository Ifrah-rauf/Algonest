-- ═══════════════════════════════════════════════════════════════════
-- Track B — Supabase SQL Migration
-- Run this entire file in your Supabase SQL editor
-- File location: supabase/migrations/001_trackb_tables.sql
-- ═══════════════════════════════════════════════════════════════════

-- Step 1: Enable pgvector extension
create extension if not exists vector;

-- ═══════════════════════════════════════════════════════════════════
-- TABLE: chat_messages
-- Every message sent by student or AI, stored with its embedding.
-- The embedding enables semantic search over past conversations.
-- ═══════════════════════════════════════════════════════════════════

create table public.chat_messages (
  message_id  serial primary key,
  s_id        integer not null references student(s_id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  embedding   vector(384),               -- from Xenova/all-MiniLM-L6-v2 (local)
  lesson_id   integer references lessons(lesson_id),
  topic_id    integer references lesson_topics(topic_id),
  created_at  timestamp with time zone default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- TABLE: student_memory
-- One row per student. Updated automatically every 20 messages.
-- Stores what the student struggles with, is good at, and their style.
-- ═══════════════════════════════════════════════════════════════════

create table public.student_memory (
  memory_id                 serial primary key,
  s_id                      integer not null unique references student(s_id) on delete cascade,
  summary                   text,           -- narrative of learning journey
  weak_topics               text[],         -- topics they struggle with
  strong_topics             text[],         -- topics they are confident in
  learning_style            text,           -- how they prefer to learn
  messages_summarized_count integer default 0,
  last_updated              timestamp with time zone default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- TABLE: mentor_feedback_embeddings
-- Stores embedded mentor feedback so the AI can find relevant notes
-- via semantic search when the student asks a related question.
-- ═══════════════════════════════════════════════════════════════════

create table public.mentor_feedback_embeddings (
  feedback_embed_id serial primary key,
  s_id              integer not null references student(s_id) on delete cascade,
  support_id        integer references support_stages(support_id),
  feedback_text     text not null,
  embedding         vector(384),
  created_at        timestamp with time zone default now()
);

-- ═══════════════════════════════════════════════════════════════════
-- INDEXES: ivfflat for fast approximate nearest-neighbor search
-- ═══════════════════════════════════════════════════════════════════

create index chat_messages_embedding_idx
  on chat_messages using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index mentor_feedback_embedding_idx
  on mentor_feedback_embeddings using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- ═══════════════════════════════════════════════════════════════════
-- FUNCTION: match_student_messages
-- Finds past messages semantically similar to the current query.
-- Called by searchRelevantMessages() in studentDataLayer.js
-- ═══════════════════════════════════════════════════════════════════

create or replace function match_student_messages(
  query_embedding vector(384),
  student_id      integer,
  match_count     integer default 5
)
returns table(role text, content text, similarity float)
language sql stable as $$
  select
    role,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from chat_messages
  where s_id = student_id
    and embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- ═══════════════════════════════════════════════════════════════════
-- FUNCTION: match_mentor_feedback
-- Finds mentor feedback semantically related to the current question.
-- Called by searchRelevantFeedback() in studentDataLayer.js
-- ═══════════════════════════════════════════════════════════════════

create or replace function match_mentor_feedback(
  query_embedding vector(384),
  student_id      integer,
  match_count     integer default 3
)
returns table(feedback_text text, similarity float)
language sql stable as $$
  select
    feedback_text,
    1 - (embedding <=> query_embedding) as similarity
  from mentor_feedback_embeddings
  where s_id = student_id
    and embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;