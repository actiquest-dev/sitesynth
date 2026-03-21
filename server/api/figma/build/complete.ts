import { defineEventHandler, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

const getPluginSecret = () =>
  process.env.FIGMA_PLUGIN_SECRET || process.env.NUXT_SESSION_PASSWORD || 'local-figma-plugin-secret'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  const jobId = body?.jobId
  const fileKey = body?.fileKey
  const fileUrl = body?.fileUrl

  if (token !== getPluginSecret()) {
    return { success: false, error: 'Unauthorized' }
  }
  if (!jobId) {
    return { success: false, error: 'Missing jobId' }
  }

  const db = useDatabaseClient()
  await db
    .from('figma_build_jobs')
    .update({
      status: 'completed',
      figma_file_url: fileUrl || (fileKey ? `https://www.figma.com/file/${fileKey}` : null),
      finished_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)

  await db.from('figma_build_events').insert({
    job_id: jobId,
    level: 'info',
    message: 'Job completed by Figma plugin',
    payload: { fileKey, fileUrl },
  })

  return { success: true }
})
