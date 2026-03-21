import { defineEventHandler, getQuery } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { verifyBuildToken } from '~~/server/utils/figma-build-token'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'GET, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  if (event.node.req.method === 'OPTIONS') {
    return { success: true }
  }
  const query = getQuery(event)
  const jobId = typeof query.jobId === 'string' ? query.jobId : ''
  const token = typeof query.token === 'string' ? query.token : ''
  if (!jobId || !token) {
    return { success: false, error: 'Missing jobId or token' }
  }

  try {
    const payload = verifyBuildToken(token)
    if (payload.jobId !== jobId) {
      return { success: false, error: 'Token does not match job' }
    }

    const db = useDatabaseClient()
    const { data, error } = await db
      .from('figma_build_jobs')
      .select('spec_snapshot')
      .eq('id', jobId)
      .maybeSingle()
    if (error) throw error
    if (!data?.spec_snapshot?.build_plan) {
      return { success: false, error: 'Build plan not found' }
    }
    return { success: true, data: data.spec_snapshot.build_plan }
  } catch (error: any) {
    return { success: false, error: error.message || 'Invalid token' }
  }
})
