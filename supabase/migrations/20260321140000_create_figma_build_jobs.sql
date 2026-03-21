create table if not exists figma_build_jobs (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid,
  status text not null default 'queued',
  requested_by text,
  source text default 'admin',
  figma_file_url text,
  spec_snapshot jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create index if not exists figma_build_jobs_status_idx on figma_build_jobs (status);
create index if not exists figma_build_jobs_brief_id_idx on figma_build_jobs (brief_id);

create table if not exists figma_build_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references figma_build_jobs (id) on delete cascade,
  level text not null default 'info',
  message text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists figma_build_events_job_id_idx on figma_build_events (job_id);
