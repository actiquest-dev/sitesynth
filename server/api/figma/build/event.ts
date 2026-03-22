import { defineEventHandler, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

const getPluginSecret = () =>
  process.env.FIGMA_PLUGIN_SECRET || process.env.NUXT_SESSION_PASSWORD || 'local-figma-plugin-secret'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

  if (event.node.req.method === 'OPTIONS') {
    return { success: true }
  }

  const body = await readBody(event)
  const token = body && body.token
  const jobId = body && body.jobId
  const level = body && body.level ? body.level : 'info'
  const message = body && body.message
  const payload = body && body.payload ? body.payload : null

  if (token !== getPluginSecret()) {
    return { success: false, error: 'Unauthorized' }
  }

  if (!jobId || !message) {
    return { success: false, error: 'Missing jobId or message' }
  }

  const db = useDatabaseClient()
  const { error } = await db.from('figma_build_events').insert({
    job_id: jobId,
    level,
    message,
    payload,
  })

  if (error) {
    return { success: false, error: error.message || 'Failed to write event' }
  }

  return { success: true }
})
