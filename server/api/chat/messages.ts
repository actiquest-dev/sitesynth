import { defineEventHandler, readBody, getHeader, getRouterParam, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { briefingAgent, consultantAgent } from '../../agents'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/chat/messages/:conversationId - Get conversation messages
  if (method === 'GET') {
    const conversationId = getRouterParam(event, 'conversationId')
    
    if (!conversationId) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID required' })
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      data: data || [],
    }
  }

  // POST /api/chat/messages - Send message and get agent response
  if (method === 'POST') {
    const userEmail = getHeader(event, 'x-user-email')
    const body = await readBody(event)

    if (!userEmail) {
      return createError({ statusCode: 401, statusMessage: 'User email required' })
    }

    if (!body.conversationId || !body.message) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID and message required' })
    }

    try {
      // 1. Save user message
      const { error: msgError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: body.conversationId,
            role: 'user',
            content: body.message,
          },
        ])

      if (msgError) {
        throw new Error(`Failed to save message: ${msgError.message}`)
      }

      // 2. Get conversation to know which agent to use
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('agent_type')
        .eq('id', body.conversationId)
        .single()

      if (convError) {
        throw new Error(`Failed to get conversation: ${convError.message}`)
      }

      // 3. Get agent based on type
      const agentType = convData?.agent_type as 'briefing' | 'presale'
      const agent = agentType === 'briefing' ? briefingAgent : consultantAgent

      // 4. Get documents for context
      const { data: docs } = await supabase
        .from('documents')
        .select('title, content')
        .eq('agent_type', agentType)
        .limit(5)

      const documentContext = docs?.length
        ? `\n\nRelevant documents:\n${docs.map((d: any) => `- ${d.title}: ${d.content.substring(0, 500)}`).join('\n')}`
        : ''

      // 5. Get recent message history for context (last 5 messages)
      const { data: messages } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', body.conversationId)
        .order('created_at', { ascending: true })
        .limit(5)

      // Build conversation history for agent
      const conversationHistory = messages?.map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })) || []

      // 6. Call agent with Gemini through VoltAgent
      let response: string
      try {
        // VoltAgent agent.generate() sends to Gemini API
        const systemPrompt = agent.instructions + documentContext
        
        const result = await agent.generate({
          messages: [
            ...conversationHistory,
            {
              role: 'user',
              content: body.message,
            },
          ],
          system: systemPrompt,
          maxTokens: 1024,
        })

        response = typeof result === 'string' ? result : result.text || result.content || ''
        
        if (!response) {
          throw new Error('Empty response from Gemini')
        }
      } catch (agentError: any) {
        console.error('Gemini API error:', agentError)
        response = `Sorry, I encountered an issue processing your request: ${agentError.message}. Please try again.`
      }

      // 7. Save assistant response
      const { error: respError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: body.conversationId,
            role: 'assistant',
            content: response,
          },
        ])

      if (respError) {
        throw new Error(`Failed to save response: ${respError.message}`)
      }

      // 8. Update conversation last updated
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', body.conversationId)

      return {
        status: 'success',
        message: response,
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      return createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
