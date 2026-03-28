import { defineEventHandler, getHeader, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) return { success: false, error: 'Unauthorized' }

  const body = await readBody(event)
  const briefId = body?.briefId
  const force = Boolean(body?.force)
  if (!briefId) return { success: false, error: 'Brief ID required' }

  const db = useDatabaseClient()
  const { data: brief, error } = await db
    .from('briefs')
    .select('id, markdown_content, user_email')
    .eq('id', briefId)
    .eq('user_email', userEmail)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!brief) return { success: false, error: 'Brief not found' }

  // Enqueue async job (worker will process)
  const { data: existingJob } = await db
    .from('reference_jobs')
    .select('id, status')
    .eq('brief_id', briefId)
    .in('status', ['queued', 'claimed', 'running'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingJob?.id && !force) {
    return { success: true, data: { jobId: existingJob.id, status: existingJob.status } }
  }

  if (force) {
    await db
      .from('reference_jobs')
      .update({ status: 'cancelled', finished_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('brief_id', briefId)
      .eq('user_email', userEmail)
      .in('status', ['queued', 'claimed', 'running'])

    await db
      .from('brief_reference_assets')
      .delete()
      .eq('brief_id', briefId)

    await db
      .from('briefs')
      .update({
        reference_status: 'queued',
        reference_analysis_json: { logs: [] },
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)
      .eq('user_email', userEmail)
  }

  const { data: job, error: jobError } = await db
    .from('reference_jobs')
    .insert({
      brief_id: briefId,
      user_email: userEmail,
      status: 'queued',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .maybeSingle()

  if (jobError || !job) {
    return { success: false, error: jobError?.message || 'Failed to enqueue reference job' }
  }

  if (!force) {
    await db
      .from('briefs')
      .update({
        reference_status: 'queued',
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)
      .eq('user_email', userEmail)
  }

  return { success: true, data: { jobId: job.id, status: 'queued' } }
})
