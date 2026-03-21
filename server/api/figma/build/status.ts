import { defineEventHandler, getQuery } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) return { success: false, error: 'Unauthorized' }

  const query = getQuery(event)
  const briefId = typeof query.briefId === 'string' ? query.briefId : ''
  if (!briefId) return { success: false, error: 'Brief ID required' }

  const db = useDatabaseClient()
  const { data: job, error } = await db
    .from('figma_build_jobs')
    .select('*')
    .eq('brief_id', briefId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return { success: false, error: 'Failed to load build status' }
  if (!job) return { success: true, data: { job: null, events: [] } }

  const { data: events, error: eventsError } = await db
    .from('figma_build_events')
    .select('*')
    .eq('job_id', job.id)
    .order('created_at', { ascending: false })
    .limit(10)

  if (eventsError) return { success: false, error: 'Failed to load build events' }

  return { success: true, data: { job, events } }
})
