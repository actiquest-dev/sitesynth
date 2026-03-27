import { defineEventHandler, readBody, getHeader, getRouterParam, getQuery, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getAgent } from '~~/server/mastra'

const briefingAgent = getAgent('briefingAgent')
const consultantAgent = getAgent('consultantAgent')
import { getAgentConfig } from '~~/server/utils/agent-config'
import { getActiveWorkflow, getCurrentStepPrompt, buildWorkflowSystemPrompt } from '~~/server/utils/workflow-helper'
import { retrieveRelevantFileChunks } from '~~/server/utils/file-rag'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

const geminiText = async (prompt: string, modelName = 'gemini-2.5-pro') => {
  const model = genAI.getGenerativeModel({ model: modelName })
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })
  return result.response.text()
}

const ensurePlanningSections = (draft: string, userRequest: string) => {
  if (!draft) return draft

  const mentionsPlanning =
    /(figma|wireframe|wireframes|mockup|mockups|design system|дизайн-систем|вайрфрейм|макет|мокап|структур|спек|специфик|экран|страниц|страница)/i.test(userRequest)

  if (!mentionsPlanning) return draft

  const hasPlannedFigmaStructure = /^##\s+Planned Figma Structure\b/im.test(draft)
  const hasDesignDeliverables = /^##\s+Design Deliverables\b/im.test(draft)

  if (hasPlannedFigmaStructure || hasDesignDeliverables) {
    return draft
  }

  const appendedSection = `\n\n## Planned Figma Structure\n- Define the Figma file structure and key pages.\n- Specify expected wireframes, mockups, and supporting design artifacts.\n- Clarify how these deliverables support the approved brief.\n`

  return `${draft.trimEnd()}${appendedSection}`
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/chat/messages - Get conversation messages (anonymous or authenticated)
  if (method === 'GET') {
    let conversationId = getRouterParam(event, 'conversationId')

    if (!conversationId) {
      const query = getQuery(event)
      conversationId = query.conversation_id as string
    }

    if (!conversationId) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID required' })
    }

    // ✅ Check conversation ownership (device_id OR user_email)
    const userEmail = getHeader(event, 'x-user-email') || null
    const deviceId = getHeader(event, 'x-device-id') || null

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, device_id, user_email')
      .eq('id', conversationId)
      .maybeSingle()

    if (!conversation) {
      return createError({ statusCode: 404, statusMessage: 'Conversation not found' })
    }

    // ✅ Verify ownership: conversation must belong to this user/device
    const isOwner =
      (conversation.device_id && conversation.device_id === deviceId) ||
      (conversation.user_email && conversation.user_email === userEmail)

    if (!isOwner) {
      return createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    // ✅ Now safe to return messages
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

  // POST /api/chat/messages - Send message and get agent response (anonymous or authenticated)
  if (method === 'POST') {
    const userEmail = getHeader(event, 'x-user-email') || null
    const deviceId = getHeader(event, 'x-device-id') || null
    const body = await readBody(event)

    // ✅ Must have either device_id (anonymous) OR user_email (authenticated)
    if (!deviceId && !userEmail) {
      return createError({
        statusCode: 401,
        statusMessage: 'Either x-device-id (anonymous) or x-user-email (authenticated) required',
      })
    }

    const conversationId = body.conversation_id || body.conversationId
    const message = body.message || body.content
    const agentType = body.agent_type || 'presale'
    const history = body.history || []
    const hiddenTrigger = body.hidden_trigger === true // post-brief proactive greeting

    if (!conversationId || !message) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID and message required' })
    }

    // ✅ Verify conversation ownership (device_id OR user_email)
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, device_id, user_email')
      .eq('id', conversationId)
      .maybeSingle()

    if (!conversation) {
      return createError({ statusCode: 404, statusMessage: 'Conversation not found' })
    }

    const isOwner =
      (conversation.device_id && conversation.device_id === deviceId) ||
      (conversation.user_email && conversation.user_email === userEmail)

    if (!isOwner) {
      return createError({ statusCode: 403, statusMessage: 'Access denied' })
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
          systemPrompt += `\n\nAttached Google Drive files: ${b.files.join(', ')}`
          systemPrompt += `\nUse these attached Google Drive files as source context when proposing strategy, Figma structure, screens, deliverables, and refinements. If a useful point comes from the files, reflect it in the brief draft.`
        }
        if (Array.isArray(b.fileIds) && b.fileIds.length > 0) {
          const retrievedChunks = await retrieveRelevantFileChunks({
            fileIds: b.fileIds,
            userEmail: String(userEmail),
            query: String(message),
            limit: 4,
          })
          if (retrievedChunks.length > 0) {
            systemPrompt += `\n\nRETRIEVED FILE CONTEXT:\n${retrievedChunks.map((chunk, index) => `File ${index + 1}: ${chunk.file_name}\n${chunk.content}`).join('\n\n')}`
          }
        }
        systemPrompt += `\n\nIf the user requests edits, refinements, or proposes Figma structure, screens, wireframes, mockups, or design deliverables, YOU MUST CALL draft_brief_update with the full updated markdown. Add those planning details into a dedicated brief section named "## Planned Figma Structure" or "## Design Deliverables". Create the section if it does not exist. Do not claim changes are saved. Do not say you will do work later. Tell the user to review and click Save.`
      } else if (isPostBrief) {
        const { data: brief } = await supabase.from('briefs').select('markdown_content').eq('conversation_id', conversationId).single()
        if (brief?.markdown_content) {
          currentBriefContent = brief.markdown_content
          systemPrompt += `\n\nCURRENT BRIEF CONTENT:\n${brief.markdown_content}\n\nYOU MUST USE TOOL draft_brief_update TO PREPARE CHANGES. If you suggest Figma pages, wireframes, mockups, deliverables, or structure, insert them into a dedicated brief section named "## Planned Figma Structure" or "## Design Deliverables" instead of promising future work.`
        }
      } else if (agentType === 'briefing') {
        // Load brief from DB by conversation_id (briefing mode)
        const { data: brief } = await supabase.from('briefs').select('markdown_content').eq('conversation_id', conversationId).single()
        if (brief?.markdown_content) {
          currentBriefContent = brief.markdown_content
          systemPrompt += `\n\nCURRENT BRIEF CONTENT:\n${brief.markdown_content}\n\nYOU MUST USE TOOL draft_brief_update TO PREPARE CHANGES. If you suggest Figma pages, wireframes, mockups, deliverables, or structure, insert them into a dedicated brief section named "## Planned Figma Structure" or "## Design Deliverables" instead of promising future work.`
        }
      }

      // 5. Generate Response
      const conversationContext = history
        .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n\n')

      let agentInput = message
      if (conversationContext) {
        agentInput = `<conversation>\n${conversationContext}\n</conversation>\n\nNew message from user:\n${message}`
      }

      const result = await agent.generate(agentInput)

      let response = result?.text || result?.content || String(result || '')
      let briefDraft: string | null = null

      // Deterministic fallback: if the model answered without producing a draft,
      // generate the updated brief directly and return it to the client.
      if ((shouldDraftUpdate || shouldConvertPlanningToBrief) && !briefDraft && currentBriefContent) {
        const draftPrompt = `You rewrite project briefs.

Return the FULL updated brief as markdown only.
Do not explain what you changed.
Do not add preamble or code fences.
Preserve useful structure and headings.
Apply the user's requested edits directly to the existing brief.
If the user is discussing Figma structure, wireframes, mockups, screens, or deliverables, convert those ideas into explicit brief content under a dedicated section named "## Planned Figma Structure" or "## Design Deliverables". Create that section if needed.
Never promise future work. Fold the plan into the brief now.

Current brief:
${currentBriefContent}

User request:
${message}

Return the full updated brief in markdown only.`

        const draftText = await geminiText(draftPrompt, 'gemini-2.5-pro')
        briefDraft = ensurePlanningSections(draftText.trim(), String(message))
        response = 'Draft prepared. Review changes and press Save to persist (not saved yet).'
      }

      if (briefDraft) {
        briefDraft = ensurePlanningSections(briefDraft, String(message))
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
