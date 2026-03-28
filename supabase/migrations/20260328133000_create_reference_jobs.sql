-- Create reference_jobs table for async reference analysis
create table if not exists reference_jobs (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references briefs(id) on delete cascade,
  user_email text not null,
  status text not null default 'queued',
  priority int not null default 0,
  attempts int not null default 0,
  claimed_by text,
  claimed_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_reference_jobs_status_created on reference_jobs (status, created_at);
create index if not exists idx_reference_jobs_brief_id on reference_jobs (brief_id);
