-- Atomic claim for reference_jobs to avoid race conditions
create or replace function claim_reference_job(worker_id text)
returns table (
  id uuid,
  brief_id uuid,
  user_email text
) language plpgsql as 29256
begin
  return query
  with candidate as (
    select reference_jobs.id
    from reference_jobs
    where status = 'queued'
      and claimed_by is null
    order by created_at asc
    limit 1
    for update skip locked
  )
  update reference_jobs
  set status = 'running',
      claimed_by = worker_id,
      claimed_at = now(),
      started_at = now(),
      attempts = attempts + 1,
      updated_at = now()
  where reference_jobs.id in (select id from candidate)
  returning reference_jobs.id, reference_jobs.brief_id, reference_jobs.user_email;
end;
29256;
