alter table demo_build_jobs
  add column if not exists provider text not null default 'cline_executor',
  add column if not exists model_provider text not null default 'claude',
  add column if not exists current_stage text not null default 'queued',
  add column if not exists priority integer not null default 100,
  add column if not exists workspace_path text,
  add column if not exists target_url text,
  add column if not exists build_contract jsonb,
  add column if not exists execution_config jsonb,
  add column if not exists result_json jsonb,
  add column if not exists retry_count integer not null default 0,
  add column if not exists claimed_by text,
  add column if not exists claimed_at timestamp with time zone,
  add column if not exists finished_at timestamp with time zone;

update demo_build_jobs
set
  workspace_path = coalesce(workspace_path, '/var/www/sitesynth/demo.sitesynth.com/' || slug),
  target_url = coalesce(target_url, 'https://demo.sitesynth.com/' || slug || '/'),
  current_stage = coalesce(nullif(current_stage, ''), case when status = 'queued' then 'queued' else status end),
  finished_at = coalesce(finished_at, completed_at),
  result_json = coalesce(result_json, output)
where true;

create index if not exists demo_build_jobs_priority_idx on demo_build_jobs (priority, created_at);
create index if not exists demo_build_jobs_claimed_by_idx on demo_build_jobs (claimed_by);

alter table demo_build_events
  add column if not exists stage text not null default 'general';

create table if not exists demo_build_artifacts (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references demo_build_jobs (id) on delete cascade,
  type text not null,
  path text,
  public_url text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists demo_build_artifacts_job_id_idx on demo_build_artifacts (job_id);
