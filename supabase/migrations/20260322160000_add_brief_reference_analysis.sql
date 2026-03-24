alter table if exists briefs
  add column if not exists reference_analysis_json jsonb,
  add column if not exists reference_status text default 'pending',
  add column if not exists reference_completed_at timestamptz;

create table if not exists brief_reference_assets (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references briefs (id) on delete cascade,
  source_url text not null,
  final_url text,
  competitor text,
  page_kind text,
  viewport text,
  title text,
  public_url text not null,
  local_path text,
  drive_file_id text,
  drive_url text,
  analysis_json jsonb,
  selected boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brief_reference_assets_brief_id_idx on brief_reference_assets (brief_id);
