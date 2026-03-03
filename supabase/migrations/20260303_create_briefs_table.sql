-- Create briefs table for storing generated project briefs
create table if not exists briefs (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_email text not null,
  agent_type text not null default 'briefing',
  brief_data jsonb not null,
  markdown_content text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add indexes for faster queries
create index if not exists briefs_conversation_id_idx on briefs(conversation_id);
create index if not exists briefs_user_email_idx on briefs(user_email);
create index if not exists briefs_created_at_idx on briefs(created_at);

-- Enable RLS
alter table briefs enable row level security;

-- RLS policies - users can only see their own briefs
create policy briefs_select_policy
  on briefs for select
  using (user_email = auth.email());

create policy briefs_insert_policy
  on briefs for insert
  with check (user_email = auth.email());

create policy briefs_update_policy
  on briefs for update
  using (user_email = auth.email());
