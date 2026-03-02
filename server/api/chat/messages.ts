import { defineEventHandler, readBody, getHeader, getRouterParam, getQuery, createError } from 'h3'
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

  // GET /api/chat/messages - Get conversation messages
  if (method === 'GET') {
    let conversationId = getRouterParam(event, 'conversationId')
    
    // Also check query parameters
    if (!conversationId) {
      const query = getQuery(event)
      conversationId = query.conversation_id as string
    }
    
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
      messages: data || [],
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

    const conversationId = body.conversation_id || body.conversationId
    const message = body.message || body.content
    const agentType = body.agent_type || 'presale'
    const history = body.history || []

    if (!conversationId || !message) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID and message required' })
    }

    try {
      // 1. Save user message
      const { error: msgError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            role: 'user',
            content: message,
          },
        ])

      if (msgError) {
        throw new Error(`Failed to save message: ${msgError.message}`)
      }

      // 2. Get agent based on type
      const agent = agentType === 'briefing' ? briefingAgent : consultantAgent

      // 3. System prompts for each mode
      const systemPrompts = {
        briefing: `You are a professional briefing specialist helping clients achieve their goals through strategic recommendations. 
        
Your role is to:
- Understand the client's current situation and objectives
- Provide expert insights and strategic guidance
- Ask clarifying questions to understand their needs better
- Make specific, actionable recommendations tailored to their business
- Document key decisions and next steps

Maintain a professional, consultative tone. Be inquisitive but focused on driving toward concrete deliverables.`,
        
        presale: `You are a friendly and knowledgeable sales consultant helping prospects understand how our solutions can solve their problems.

Your role is to:
- Listen to the prospect's pain points and goals
- Explain how our solutions directly address their needs
- Answer questions about features, pricing, and implementation
- Guide them towards scheduling a consultation
- Be helpful, patient, and genuinely interested in their success

Use natural conversation while being clear about what we offer. Gently guide the conversation towards a consultation when appropriate.`
      }

      const systemPrompt = systemPrompts[agentType as keyof typeof systemPrompts] || systemPrompts.presale

      // 4. Build conversation history - use provided history + current message
      type ConversationMessage = {
        role: 'user' | 'assistant'
        content: string
      }
      
      const conversationHistory: ConversationMessage[] = [
        ...history.map((m: any) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: message,
        },
      ]

      // 5. Call agent with Gemini through VoltAgent
      let response: string
      try {
        const result = await agent.generate({
          messages: conversationHistory,
          system: systemPrompt,
          maxTokens: 1024,
        })

        response = typeof result === 'string' ? result : result.text || result.content || ''
        
        if (!response) {
          throw new Error('Empty response from Gemini')
        }
      } catch (agentError: any) {
        console.error('Gemini API error:', agentError)
        response = `I apologize, but I encountered a temporary issue. Could you please rephrase your question?`
      }

      // 6. Save assistant response
      const { error: respError } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            role: 'assistant',
            content: response,
          },
        ])

      if (respError) {
        throw new Error(`Failed to save response: ${respError.message}`)
      }

      // 7. Update conversation last updated
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

      // 8. Get all messages for the conversation
      const { data: allMessages, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (fetchError) {
        throw new Error(`Failed to fetch messages: ${fetchError.message}`)
      }

      return {
        status: 'success',
        message: response,
        messages: allMessages || [],
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      return createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
