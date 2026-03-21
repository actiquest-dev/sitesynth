import { defineEventHandler, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    return { success: false, error: 'Unauthorized' }
  }

  const body = await readBody(event)
  const briefId = body?.briefId
  if (!briefId) {
    return { success: false, error: 'Brief ID is required' }
  }

  try {
    const db = useDatabaseClient()
    const { data: brief, error: briefError } = await db
      .from('briefs')
      .select('id, user_email, design_spec_json')
      .eq('id', briefId)
      .eq('user_email', userEmail)
      .maybeSingle()

    if (briefError) throw briefError
    if (!brief) return { success: false, error: 'Brief not found' }
    if (!brief.design_spec_json) {
      return { success: false, error: 'Design spec not found. Generate it first.' }
    }

    const { data: job, error: jobError } = await db
      .from('figma_build_jobs')
      .insert({
        brief_id: briefId,
        requested_by: userEmail,
        source: 'cabinet',
        spec_snapshot: brief.design_spec_json,
        status: 'queued',
      })
      .select('id, status, created_at')
      .single()

    if (jobError) throw jobError

    return {
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        createdAt: job.created_at,
      },
    }
  } catch (error: any) {
    console.error('[FigmaBuild] Error:', error)
    return { success: false, error: 'Failed to queue Figma build' }
  }
})
