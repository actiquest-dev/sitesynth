import { defineEventHandler, readBody } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { runReferenceAnalysisPipeline } from '~~/server/utils/reference-research'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) return { success: false, error: 'Unauthorized' }

  const body = await readBody(event)
  const briefId = body?.briefId
  if (!briefId) return { success: false, error: 'Brief ID required' }

  const db = useDatabaseClient()
  const { data: brief, error } = await db
    .from('briefs')
    .select('id, markdown_content, user_email')
    .eq('id', briefId)
    .eq('user_email', userEmail)
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!brief) return { success: false, error: 'Brief not found' }

  try {
    const result = await runReferenceAnalysisPipeline({
      briefId,
      userEmail,
      markdownContent: brief.markdown_content || '',
    })
    return { success: true, data: result }
  } catch (pipelineError: any) {
    const errorMessage = pipelineError?.message || 'Reference analysis failed'
    await db
      .from('briefs')
      .update({
        reference_status: 'failed',
        reference_analysis_json: {
          logs: [
            {
              ts: new Date().toISOString(),
              level: 'error',
              message: errorMessage,
            },
          ],
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)
      .eq('user_email', userEmail)
    return { success: false, error: errorMessage }
  }
})
