alter table public.session
  add column if not exists reminder_teacher_30m_sent boolean not null default false,
  add column if not exists reminder_teacher_30m_sent_at timestamp with time zone null,
  add column if not exists reminder_student_30m_sent boolean not null default false,
  add column if not exists reminder_student_30m_sent_at timestamp with time zone null;

create index if not exists session_reminder_30m_lookup_idx
  on public.session (start_time, reminder_teacher_30m_sent, reminder_student_30m_sent);
