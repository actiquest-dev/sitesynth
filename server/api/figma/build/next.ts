import { defineEventHandler, getQuery } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

const getPluginSecret = () =>
  process.env.FIGMA_PLUGIN_SECRET || process.env.NUXT_SESSION_PASSWORD || 'local-figma-plugin-secret'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = typeof query.token === 'string' ? query.token : ''
  if (token !== getPluginSecret()) {
    return { success: false, error: 'Unauthorized' }
  }

  const db = useDatabaseClient()
  const { data: job, error } = await db
    .from('figma_build_jobs')
    .select('id, spec_snapshot')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) return { success: false, error: 'Failed to fetch job' }
  if (!job) return { success: false, error: 'No jobs' }

  await db
    .from('figma_build_jobs')
    .update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', job.id)

  await db.from('figma_build_events').insert({
    job_id: job.id,
    level: 'info',
    message: 'Job claimed by Figma plugin',
    payload: { source: 'plugin' },
  })

  return {
    success: true,
    data: {
      jobId: job.id,
      buildPlan: job.spec_snapshot?.build_plan || {},
    },
  }
})
