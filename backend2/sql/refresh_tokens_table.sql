create table public.refresh_tokens (
  id uuid not null default gen_random_uuid(),
  uid text not null,
  token text not null,
  revoked boolean null default false,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone null default now(),
  constraint refresh_tokens_pkey primary key (id),
  constraint refresh_tokens_token_key unique (token),
  constraint refresh_tokens_uid_fkey foreign key (uid) references auth (uid) on delete cascade
) tablespace pg_default;
