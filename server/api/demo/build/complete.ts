import { defineEventHandler, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { getDemoBuildToken } from '~~/server/utils/demo-build-token'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  if (token !== getDemoBuildToken()) {
    return { success: false, error: 'Unauthorized' }
  }

  const jobId = body?.jobId
  if (!jobId) return { success: false, error: 'Job ID is required' }

  const patch: any = {
    status: body?.status || 'published',
    current_stage: body?.stage || (body?.status === 'failed' ? 'failed' : 'publish'),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
  }

  if (body?.error) patch.error = body.error
  if (body?.output) {
    patch.output = body.output
    patch.result_json = body.output
  }
  if (body?.targetUrl) patch.target_url = body.targetUrl

  const db = useDatabaseClient()
  const { error } = await db.from('demo_build_jobs').update(patch).eq('id', jobId)
  if (error) return { success: false, error: 'Failed to update build status' }

  if (Array.isArray(body?.artifacts) && body.artifacts.length > 0) {
    await db.from('demo_build_artifacts').insert(
      body.artifacts.map((artifact: any) => ({
        job_id: jobId,
        type: artifact.type || 'file',
        path: artifact.path || null,
        public_url: artifact.publicUrl || artifact.public_url || null,
        metadata: artifact.metadata || null,
      }))
    )
  }

  await db.from('demo_build_events').insert({
    job_id: jobId,
    level: body?.status === 'failed' ? 'error' : 'info',
    stage: body?.stage || (body?.status === 'failed' ? 'failed' : 'publish'),
    message: body?.status === 'failed' ? 'Build failed' : 'Build completed',
    payload: {
      url: body?.targetUrl || body?.output?.url || null,
      changedFiles: body?.changedFiles || null,
      summary: body?.summary || null,
      error: body?.error || null,
    },
  })

  return { success: true }
})
