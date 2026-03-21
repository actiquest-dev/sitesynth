create table if not exists brief_versions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references briefs(id) on delete cascade,
  user_email text not null,
  name text,
  brief_data jsonb,
  markdown_content text,
  version integer not null default 1,
  source text not null default 'user-save',
  created_at timestamp with time zone default now()
);

create index if not exists brief_versions_brief_id_idx on brief_versions(brief_id);
create index if not exists brief_versions_user_email_idx on brief_versions(user_email);
create index if not exists brief_versions_created_at_idx on brief_versions(created_at desc);
