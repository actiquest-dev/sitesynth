import { defineEventHandler, readBody, getHeader, getRouterParam, getQuery, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { generateText, tool } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { briefingAgent, consultantAgent, architectAgent, criticAgent } from '../../agents'
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
    const hiddenTrigger = body.hidden_trigger === true  // post-brief proactive greeting

    if (!conversationId || !message) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID and message required' })
    }

    const isPostBrief = agentType === 'post-brief'
    const isBriefMode = agentType === 'briefing' || isPostBrief

    try {
      // 1. Save user message — skip for hidden triggers (post-brief proactive greeting)
      if (!hiddenTrigger) {
        await supabase.from('messages').insert([{ conversation_id: conversationId, role: 'user', content: message }])
      }

      // 2. Setup Agent & Prompt
      const agent = isBriefMode ? briefingAgent : consultantAgent
      const agentConfig = getAgentConfig(isBriefMode ? 'briefingAgent' : 'consultantAgent')
      let systemPrompt = agentConfig.systemPrompt

      // Post-brief mode: override with proactive design strategist persona
      if (isPostBrief) {
        systemPrompt = `You are a Design Strategist at SiteSynth. The client has just finished creating their project brief.

Your role in this first message:
1. Warmly acknowledge the brief by name
2. In 2-3 sentences, summarize what the brief is about (show you've read it)
3. Suggest 1-2 specific improvements if you see gaps or vague sections
4. Clearly state the next step: "When you're happy with the brief, I'll generate a full Design Specification — screen structure, UI blocks, and a Figma template plan"
5. End with a specific question to move forward

Be concise, professional, proactive. Respond in the same language as the brief content.`
      } else {
        const workflow = await getActiveWorkflow(agentType === 'briefing' ? 'briefing' : 'presale')
        const currentStepPrompt = getCurrentStepPrompt(workflow, history.length)
        systemPrompt = buildWorkflowSystemPrompt(systemPrompt, workflow, currentStepPrompt)
      }

      // 3. Define Tools
      const tools = isBriefMode ? {
        draft_brief_update: tool({
          description: 'Prepare an updated draft of the project brief without saving it.',
          parameters: z.object({ new_markdown_content: z.string() }),
          execute: async ({ new_markdown_content }) => {
            return { draft_markdown: new_markdown_content }
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

      const shouldDraftUpdate =
        isBriefMode &&
        typeof message === 'string' &&
        /(внеси|внести|измен|обнов|исправ|перепиш|доработ|refine|update|edit|revise|change|adjust)/i.test(message)
      const shouldConvertPlanningToBrief =
        isBriefMode &&
        typeof message === 'string' &&
        /(figma|wireframe|wireframes|mockup|mockups|design system|дизайн-систем|вайрфрейм|макет|мокап|структур|спек|специфик|экран|страниц|страница)/i.test(message)

      let currentBriefContent = ''

      // 4. Load Current Brief Context
      if (isPostBrief && body.briefContext) {
        // Brief content passed directly from client (post-brief mode)
        const b = body.briefContext
        currentBriefContent = b.content || ''
        systemPrompt += `\n\nPROJECT BRIEF:\nTitle: ${b.name}\n\n${b.content}`
        if (b.files?.length) {
          systemPrompt += `\n\nAttached files: ${b.files.join(', ')}`
        }
        systemPrompt += `\n\nIf the user requests edits, refinements, or proposes Figma structure, screens, wireframes, mockups, or design deliverables, YOU MUST CALL draft_brief_update with the full updated markdown. Add those planning details into the brief itself. Do not claim changes are saved. Do not say you will do work later. Tell the user to review and click Save.`
      } else if (isPostBrief) {
        const { data: brief } = await supabase.from('briefs').select('markdown_content').eq('conversation_id', conversationId).single()
        if (brief?.markdown_content) {
          currentBriefContent = brief.markdown_content
          systemPrompt += `\n\nCURRENT BRIEF CONTENT:\n${brief.markdown_content}\n\nYOU MUST USE TOOL draft_brief_update TO PREPARE CHANGES. If you suggest Figma pages, wireframes, mockups, deliverables, or structure, insert them into the brief as planning content instead of promising future work.`
        }
      } else if (agentType === 'briefing') {
        // Load brief from DB by conversation_id (briefing mode)
        const { data: brief } = await supabase.from('briefs').select('markdown_content').eq('conversation_id', conversationId).single()
        if (brief?.markdown_content) {
          currentBriefContent = brief.markdown_content
          systemPrompt += `\n\nCURRENT BRIEF CONTENT:\n${brief.markdown_content}\n\nYOU MUST USE TOOL draft_brief_update TO PREPARE CHANGES. If you suggest Figma pages, wireframes, mockups, deliverables, or structure, insert them into the brief as planning content instead of promising future work.`
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
        toolChoice: (shouldDraftUpdate || shouldConvertPlanningToBrief) ? { type: 'tool', toolName: 'draft_brief_update' } : 'auto',
        maxSteps: 5,
      })

      let response = result.text || ''
      let briefDraft: string | null = null
      if (result.toolResults && result.toolResults.length > 0) {
        for (const tr of result.toolResults) {
          if (tr.toolName === 'draft_brief_update') {
            if (typeof tr.result === 'string') {
              briefDraft = tr.result
            } else if (tr.result && typeof tr.result === 'object' && 'draft_markdown' in tr.result) {
              briefDraft = String((tr.result as any).draft_markdown || '')
            }
          }
        }
      }
      if (!response && briefDraft) {
        response = 'Draft prepared. Review changes and press Save to persist (not saved yet).'
      } else if (!response && result.toolResults && result.toolResults.length > 0) {
        response = 'Draft prepared. Review changes and press Save to persist (not saved yet).'
      }

      // Deterministic fallback: if the model answered without producing a draft,
      // generate the updated brief directly and return it to the client.
      if ((shouldDraftUpdate || shouldConvertPlanningToBrief) && !briefDraft && currentBriefContent) {
        const draftResult = await generateText({
          model: agent.model,
          system: `You rewrite project briefs.

Return the FULL updated brief as markdown only.
Do not explain what you changed.
Do not add preamble or code fences.
Preserve useful structure and headings.
Apply the user's requested edits directly to the existing brief.
If the user is discussing Figma structure, wireframes, mockups, screens, or deliverables, convert those ideas into explicit brief content and planning sections.
Never promise future work. Fold the plan into the brief now.`,
          messages: [
            {
              role: 'user',
              content: `Current brief:\n\n${currentBriefContent}\n\nUser request:\n${message}\n\nReturn the full updated brief in markdown only.`,
            },
          ],
          temperature: 0.4,
          maxTokens: 4096,
        })

        briefDraft = (draftResult.text || '').trim()
        response = 'Draft prepared. Review changes and press Save to persist (not saved yet).'
      }

      // 6. Save assistant response
      await supabase.from('messages').insert([{ conversation_id: conversationId, role: 'assistant', content: response }])
      await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)

      const { data: allMessages } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true })

      return { status: 'success', message: response, messages: allMessages || [], briefDraft: briefDraft || undefined }
    } catch (error: any) {
      console.error('Chat error:', error)
      return createError({ statusCode: 500, statusMessage: error.message })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
