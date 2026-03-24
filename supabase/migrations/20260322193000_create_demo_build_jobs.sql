create table if not exists demo_build_jobs (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid references briefs (id) on delete set null,
  user_email text not null,
  status text not null default 'queued',
  slug text,
  spec_snapshot jsonb,
  output jsonb,
  error text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

create index if not exists demo_build_jobs_status_idx on demo_build_jobs (status);
create index if not exists demo_build_jobs_brief_id_idx on demo_build_jobs (brief_id);
create index if not exists demo_build_jobs_user_email_idx on demo_build_jobs (user_email);

create table if not exists demo_build_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references demo_build_jobs (id) on delete cascade,
  level text not null,
  message text not null,
  payload jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists demo_build_events_job_id_idx on demo_build_events (job_id);

