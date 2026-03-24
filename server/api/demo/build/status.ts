import { defineEventHandler, getQuery, getHeader } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { normalizeJobStatus } from '~~/server/utils/demo-build'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    return { success: false, error: 'Unauthorized' }
  }

  const query = getQuery(event)
  const briefId = typeof query.briefId === 'string' ? query.briefId : ''
  if (!briefId) {
    return { success: false, error: 'Brief ID is required' }
  }

  const db = useDatabaseClient()
  const { data: job, error: jobError } = await db
    .from('demo_build_jobs')
    .select('id, status, current_stage, slug, provider, model_provider, workspace_path, target_url, error, output, result_json, created_at, claimed_at, started_at, completed_at, finished_at, updated_at')
    .eq('brief_id', briefId)
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (jobError) return { success: false, error: 'Failed to fetch status' }
  if (!job) return { success: false, error: 'No build found' }

  const { data: events } = await db
    .from('demo_build_events')
    .select('id, created_at, level, stage, message, payload')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true })

  const { data: artifacts } = await db
    .from('demo_build_artifacts')
    .select('id, type, path, public_url, metadata, created_at')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true })

  return {
    success: true,
    data: {
      job: {
        ...job,
        status: normalizeJobStatus(job.status),
      },
      events: events || [],
      artifacts: artifacts || [],
    },
  }
})
