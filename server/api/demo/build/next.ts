import { defineEventHandler, getQuery, setHeader } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { getDemoBuildToken } from '~~/server/utils/demo-build-token'
import { summarizeDemoContract } from '~~/server/utils/demo-build'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  if (event.node.req.method === 'OPTIONS') {
    return { success: true }
  }

  const query = getQuery(event)
  const token = typeof query.token === 'string' ? query.token : ''
  if (token !== getDemoBuildToken()) {
    return { success: false, error: 'Unauthorized' }
  }

  const db = useDatabaseClient()
  const { data: job, error } = await db
    .from('demo_build_jobs')
    .select('id, slug, spec_snapshot, build_contract, execution_config, target_url, workspace_path, provider, model_provider, retry_count')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .order('priority', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) return { success: false, error: 'Failed to fetch job' }
  if (!job) return { success: false, error: 'No jobs' }

  await db
    .from('demo_build_jobs')
    .update({
      status: 'claimed',
      current_stage: 'claim',
      claimed_by: typeof query.worker === 'string' ? query.worker : 'demo-builder-worker',
      claimed_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', job.id)

  await db.from('demo_build_events').insert({
    job_id: job.id,
    level: 'info',
    stage: 'claim',
    message: 'Job claimed by demo builder worker',
    payload: {
      source: 'worker',
      worker: typeof query.worker === 'string' ? query.worker : 'demo-builder-worker',
      provider: job.provider,
      modelProvider: job.model_provider,
      summary: summarizeDemoContract(job.build_contract),
    },
  })

  return {
    success: true,
    data: {
      jobId: job.id,
      slug: job.slug,
      targetUrl: job.target_url,
      workspacePath: job.workspace_path,
      provider: job.provider,
      modelProvider: job.model_provider,
      executionConfig: job.execution_config,
      buildContract: job.build_contract,
      specSnapshot: job.spec_snapshot,
    },
  }
})
