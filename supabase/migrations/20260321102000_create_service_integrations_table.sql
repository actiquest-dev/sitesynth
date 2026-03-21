create table if not exists service_integrations (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  account_type text not null default 'shared',
  connection_status text not null default 'disconnected',
  app_base_url text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  connected_account_id text,
  connected_account_label text,
  scopes text[] default '{}',
  settings_json jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, account_type)
);

create index if not exists idx_service_integrations_provider on service_integrations(provider);
