import { defineEventHandler, readBody, getHeader, getRouterParam, getQuery, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { generateText } from 'ai'
import { briefingAgent, consultantAgent } from '../../agents'
import { getAgentConfig } from '~~/server/utils/agent-config'
import { getActiveWorkflow, getCurrentStepPrompt, buildWorkflowSystemPrompt } from '~~/server/utils/workflow-helper'

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
      
      // 3. Get system prompt from admin config
      const agentConfigType = agentType === 'briefing' ? 'briefingAgent' : 'consultantAgent'
      const agentConfig = getAgentConfig(agentConfigType as 'briefingAgent' | 'consultantAgent')
      let systemPrompt = agentConfig.systemPrompt
      
      // 4. Load workflow for this agent type and enhance system prompt
      const workflowAgent = agentType === 'briefing' ? 'briefing' : 'presale'
      const workflow = await getActiveWorkflow(workflowAgent as 'briefing' | 'presale')
      const currentStepPrompt = getCurrentStepPrompt(workflow, history.length)
      systemPrompt = buildWorkflowSystemPrompt(systemPrompt, workflow, currentStepPrompt)

      // 5. Build conversation history - use provided history + current message
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

      // 6. Call Gemini directly with conversation history
      let response: string
      try {
        const startTime = Date.now()
        
        // Use the model directly from the agent or create one
        const { google } = await import('@ai-sdk/google')
        const model = google('gemini-2.5-pro')
        
        // Use generateText from ai package for direct API call
        const { generateText } = await import('ai')
        
        const result = await generateText({
          model,
          system: systemPrompt,
          messages: conversationHistory,
          temperature: 0.7,
          maxTokens: 1024,
        })

        response = result.text || ''
        
        if (!response) {
          throw new Error('Empty response from Gemini')
        }
        
        const duration = Date.now() - startTime
        console.log(`✅ Gemini response received in ${duration}ms (${response.length} chars)`)
      } catch (agentError: any) {
        console.error('❌ Gemini API error:', {
          message: agentError?.message,
          code: agentError?.code,
          status: agentError?.status,
        })
        
        // Check error type and return appropriate user message
        const errorMessage = (agentError?.message || String(agentError)).toLowerCase()
        
        if (errorMessage.includes('unauthenticated') || errorMessage.includes('api key') || errorMessage.includes('permission denied')) {
          response = `We're currently experiencing issues connecting to our AI provider (authentication error). Please contact us for support:\n📞 WhatsApp/Call for assistance`
        } else if (errorMessage.includes('unavailable') || errorMessage.includes('timeout') || errorMessage.includes('deadline')) {
          response = `Our AI service is temporarily unavailable. Please try again in a moment, or contact us:\n📞 WhatsApp/Call for support`
        } else if (errorMessage.includes('quota') || errorMessage.includes('resource_exhausted') || errorMessage.includes('limit')) {
          response = `We've reached our AI processing limit for now. Please contact us for support:\n📞 WhatsApp/Call for immediate assistance`
        } else if (errorMessage.includes('ssl') || errorMessage.includes('network') || errorMessage.includes('econnrefused')) {
          response = `Network connectivity issue with our AI provider. Please contact us:\n📞 WhatsApp/Call our support team`
        } else {
          response = `I encountered an error processing your request. For immediate assistance, please:\n📞 Contact us on WhatsApp or call our team`
        }
        
        console.error(`🔴 Error handled - showing user: "${response.substring(0, 60)}..."`)
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
