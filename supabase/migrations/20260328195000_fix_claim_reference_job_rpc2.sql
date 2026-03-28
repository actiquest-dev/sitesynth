-- Fix ambiguous column reference in claim_reference_job by using job_id alias
create or replace function claim_reference_job(worker_id text)
returns table (
  id uuid,
  brief_id uuid,
  user_email text
) language plpgsql as $$
begin
  return query
  with candidate as (
    select rj.id as job_id
    from reference_jobs rj
    where rj.status = 'queued'
      and rj.claimed_by is null
    order by rj.created_at asc
    limit 1
    for update skip locked
  )
  update reference_jobs rj
  set status = 'running',
      claimed_by = worker_id,
      claimed_at = now(),
      started_at = now(),
      attempts = rj.attempts + 1,
      updated_at = now()
  where rj.id in (select candidate.job_id from candidate)
  returning rj.id as id, rj.brief_id as brief_id, rj.user_email as user_email;
end;
$$;
