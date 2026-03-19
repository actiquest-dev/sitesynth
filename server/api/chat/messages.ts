import { defineEventHandler, readBody, getHeader, getRouterParam, getQuery, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { generateText, tool } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { briefingAgent, consultantAgent, architectAgent } from '../../agents'
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
      await supabase.from('messages').insert([{ conversation_id: conversationId, role: 'user', content: message }])

      // 2. Setup Agent & Prompt
      const agent = agentType === 'briefing' ? briefingAgent : consultantAgent
      const agentConfig = getAgentConfig(agentType === 'briefing' ? 'briefingAgent' : 'consultantAgent')
      let systemPrompt = agentConfig.systemPrompt
      
      const workflow = await getActiveWorkflow(agentType === 'briefing' ? 'briefing' : 'presale')
      const currentStepPrompt = getCurrentStepPrompt(workflow, history.length)
      systemPrompt = buildWorkflowSystemPrompt(systemPrompt, workflow, currentStepPrompt)

      // 3. Define Tools
      const tools = agentType === 'briefing' ? {
        update_brief_content: tool({
          description: 'Update the project brief content.',
          parameters: z.object({ new_markdown_content: z.string() }),
          execute: async ({ new_markdown_content }) => {
            const { data: brief } = await supabase.from('briefs').select('id').eq('conversation_id', conversationId).single()
            if (!brief) return 'Error: Brief not found'
            await supabase.from('briefs').update({ markdown_content: new_markdown_content, updated_at: new Date().toISOString() }).eq('id', brief.id)
            return 'Success: Brief updated.'
          }
        }),
        evaluate_design_quality: tool({
          description: 'Оценить дизайн-макет.',
          parameters: z.object({ description: z.string() }),
          execute: async ({ description }) => {
            const result = await generateText({
              model: google('gemini-2.5-pro'),
              system: criticAgent.instructions,
              messages: [{ role: 'user', content: `Оцени этот дизайн: ${description}` }]
            })
            return result.text
          }
        })
      } : undefined

      // 4. Load Current Brief Context
      if (agentType === 'briefing') {
        const { data: brief } = await supabase.from('briefs').select('markdown_content').eq('conversation_id', conversationId).single()
        if (brief?.markdown_content) {
          systemPrompt += `\n\nCURRENT BRIEF CONTENT:\n${brief.markdown_content}\n\nUSE TOOL update_brief_content TO UPDATE.`
        }
      }

      // 5. Generate Response
      const result = await generateText({
        model: agent.model,
        system: systemPrompt,
        messages: [
          ...history.map((m: any) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        maxTokens: 4096,
        tools,
        maxSteps: 5,
      })

      let response = result.text || ''
      if (!response && result.toolResults && result.toolResults.length > 0) {
        response = 'Brief updated successfully based on your request.'
      }

      // 6. Save assistant response
      await supabase.from('messages').insert([{ conversation_id: conversationId, role: 'assistant', content: response }])
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)

      const { data: allMessages } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })

      return { status: 'success', message: response, messages: allMessages || [] }
    } catch (error: any) {
      console.error('Chat error:', error)
      return createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
