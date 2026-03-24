create table if not exists brief_art_direction_versions (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references briefs(id) on delete cascade,
  user_email text not null,
  version integer not null,
  art_direction_json jsonb not null,
  source text not null default 'generate-art-direction',
  created_at timestamp with time zone default now(),
  unique (brief_id, version)
);

create index if not exists brief_art_direction_versions_brief_id_idx
  on brief_art_direction_versions(brief_id);

create index if not exists brief_art_direction_versions_user_email_idx
  on brief_art_direction_versions(user_email);

create index if not exists brief_art_direction_versions_created_at_idx
  on brief_art_direction_versions(created_at desc);
