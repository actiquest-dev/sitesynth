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

  const db = useDatabaseClient()
  const { error } = await db.from('demo_build_events').insert({
    job_id: jobId,
    level: body?.level || 'info',
    stage: body?.stage || 'general',
    message: body?.message || 'Event',
    payload: body?.payload || null,
  })

  if (error) return { success: false, error: 'Failed to log event' }

  if (body?.status || body?.stage) {
    const patch: Record<string, any> = { updated_at: new Date().toISOString() }
    if (body?.status) patch.status = body.status
    if (body?.stage) patch.current_stage = body.stage
    await db.from('demo_build_jobs').update(patch).eq('id', jobId)
  }

  return { success: true }
})
