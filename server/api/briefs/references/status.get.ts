import { defineEventHandler, getHeader, getQuery } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  const briefId = getQuery(event).briefId as string | undefined

  if (!userEmail) return { success: false, error: 'Unauthorized' }
  if (!briefId) return { success: false, error: 'Brief ID required' }

  const db = useDatabaseClient()

  const { data: brief, error: briefError } = await db
    .from('briefs')
    .select('id, reference_status, reference_analysis_json, reference_completed_at')
    .eq('id', briefId)
    .eq('user_email', userEmail)
    .maybeSingle()

  if (briefError) return { success: false, error: briefError.message }
  if (!brief) return { success: false, error: 'Brief not found' }

  const { data: assets, error: assetsError } = await db
    .from('brief_reference_assets')
    .select('*')
    .eq('brief_id', briefId)
    .order('created_at', { ascending: false })

  if (assetsError) return { success: false, error: assetsError.message }

  const { data: job } = await db
    .from('reference_jobs')
    .select('id, status, last_error, claimed_by, claimed_at, started_at, finished_at, updated_at')
    .eq('brief_id', briefId)
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return {
    success: true,
    data: {
      status: brief.reference_status || 'pending',
      completedAt: brief.reference_completed_at || null,
      analysis: brief.reference_analysis_json || null,
      assets: assets || [],
      logs: brief.reference_analysis_json?.logs || [],
      job: job || null,
    },
  }
})
