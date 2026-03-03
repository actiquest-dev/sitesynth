import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { extractBriefDataFromConversation, generateBriefFromData, formatBriefAsMarkdown } from '~~/server/utils/brief-generator'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // POST /api/chat/generate-brief - Generate brief from conversation
  if (method === 'POST') {
    const userEmail = getHeader(event, 'x-user-email')
    const body = await readBody(event)

    if (!userEmail) {
      return createError({ statusCode: 401, statusMessage: 'User email required' })
    }

    const conversationId = body.conversation_id || body.conversationId
    const agentType = body.agent_type || 'briefing'

    if (!conversationId) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID required' })
    }

    try {
      console.log(`[Brief API] Generating brief for conversation: ${conversationId}`)

      // 1. Fetch all messages from conversation
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (msgError) {
        throw new Error(`Failed to load messages: ${msgError.message}`)
      }

      if (!messages || messages.length === 0) {
        return createError({ statusCode: 400, statusMessage: 'No messages found in conversation' })
      }

      // 2. Extract brief data from conversation
      console.log('[Brief API] Extracting data from conversation...')
      const briefData = await extractBriefDataFromConversation(
        messages.map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))
      )

      // 3. Generate brief using skill/prompt
      console.log('[Brief API] Generating brief using AI...')
      const brief = await generateBriefFromData(briefData, agentType as 'briefing' | 'presale', userEmail)

      // 4. Save brief to database
      const { data: savedBrief, error: saveError } = await supabase
        .from('briefs')
        .insert([
          {
            conversation_id: conversationId,
            user_email: userEmail,
            agent_type: agentType,
            brief_data: brief,
            markdown_content: formatBriefAsMarkdown(brief),
          },
        ])
        .select()

      if (saveError) {
        console.error('[Brief API] Error saving brief:', saveError)
        // Don't fail - we still have the brief data
      }

      return {
        status: 'success',
        message: 'Brief generated successfully',
        data: brief,
        markdown: formatBriefAsMarkdown(brief),
        saved: !!savedBrief,
      }
    } catch (error: any) {
      console.error('[Brief API] Error:', error)
      return createError({
        statusCode: 500,
        statusMessage: error.message || 'Failed to generate brief',
      })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
