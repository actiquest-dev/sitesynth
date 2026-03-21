create table if not exists file_chunks (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  file_id text not null,
  file_name text not null,
  mime_type text,
  chunk_index integer not null,
  content text not null,
  created_at timestamp with time zone default now()
);

create unique index if not exists file_chunks_file_chunk_idx
  on file_chunks(file_id, chunk_index);

create index if not exists file_chunks_user_email_idx
  on file_chunks(user_email);

create index if not exists file_chunks_file_id_idx
  on file_chunks(file_id);
