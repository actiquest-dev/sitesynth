import { defineEventHandler, readBody } from 'h3'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatContext {
  page: string
  mode: 'passive' | 'active'
  projectId?: string
  briefingId?: string
  userId?: string
  context?: string
  userProjects?: string
  clientEmail?: string
  clientName?: string
}

interface ChatRequest {
  message: string
  conversationHistory: ChatMessage[]
  context?: ChatContext
}

/**
 * AI Chat endpoint with VoltAgent integration
 * Routes to appropriate agent based on mode (active or passive)
 * Integrated with VoltOps for production observability
 * 
 * Modes:
 * - passive: Standard consultation chat (homepage)
 * - active: Cabinet briefing mode (proactive brief development)
 */
export default defineEventHandler(async (event) => {
  const startTime = Date.now()

  try {
    const { getAgentForMode } = await import('@/server/agents')
    const {
      getVoltAgentInstance,
      logAgentExecution,
      logAgentError,
    } = await import('@/server/voltagent')

    const body = (await readBody(event)) as ChatRequest

    if (!body.message || typeof body.message !== 'string') {
      throw new Error('Message is required')
    }

    const mode = body.context?.mode || 'passive'
    const voltAgent = getVoltAgentInstance()

    // Get appropriate agent based on mode
    const agent = getAgentForMode(mode)

    voltAgent.logger.info(`🤖 [${mode.toUpperCase()}] Processing chat request`, {
      agent: agent.name,
      messageLength: body.message.length,
      historyLength: body.conversationHistory?.length || 0,
      userId: body.context?.userId,
    })

    // Call agent with conversation context
    const aiResponse = await callAgent(agent, body.message, body.conversationHistory, body.context)

    // Log successful execution with VoltOps
    const executionTime = Date.now() - startTime
    logAgentExecution(agent.name, mode, body.message, executionTime)

    return {
      success: true,
      message: aiResponse,
      agent: agent.name,
      mode,
      executionTime,
    }
  } catch (error: any) {
    const { getVoltAgentInstance, logAgentError } = await import('@/server/voltagent')
    const executionTime = Date.now() - startTime
    const voltAgent = getVoltAgentInstance()

    voltAgent.logger.error('❌ Chat endpoint error', {
      error: error.message,
      executionTime,
      stack: error.stack,
    })

    logAgentError('chat-endpoint', error, { executionTime })

    return {
      success: false,
      error: error.message || 'Failed to process chat message',
      executionTime,
    }
  }
})

/**
 * Build system prompt based on mode
 */
function buildSystemPrompt(mode: 'passive' | 'active', context?: ChatContext): string {
  if (mode === 'active') {
    return `You are Viz, SiteSynth's AI consultant, now in ACTIVE CABINET MODE.

## Current Mode: ACTIVE BRIEFING  
- You are proactively guiding a client through brief development
- This is NOT passive chat - you take initiative and lead the conversation
- Client is already logged into Cabinet, showing their past orders
- Goal: Develop their project vision and create a detailed brief

## Your Personality
- Warm, professional, and genuinely interested in their project
- Ask specific, targeted questions (not generic ones)
- When client provides info, build on it - ask follow-up questions
- Show you understand their business context
- Be opinionated about what works best for their goals

## Briefing Flow (recommended):
1. **GREETING**: Acknowledge their past work, set tone for collaboration
2. **SERVICE DISCOVERY**: Understand what they want to build  
3. **PROJECT DETAILS**: Ask 3-5 specific questions about requirements
4. **BUSINESS CONTEXT**: Understand their industry/users
5. **SUMMARY**: Confirm understanding of their vision
6. **NEXT STEPS**: Recommend service package and pricing

## Important Rules for CABINET MODE:
- NEVER ask "How can I help?" - lead with specific questions
- NEVER say "Feel free to ask me" - you ask them
- Reference their past projects: "In your last project, we did X..."
- Be direct about pricing/timeline  
- Offer clear next steps (quote, start design, etc)
- Keep responses conversational (2-3 sentences max)
- Be action-oriented: "Let's develop this together"

${context?.userProjects ? `\n## Their Past Work:\n${context.userProjects}` : ''}`
  }

  // Passive mode (default)
  return `You are Viz, an AI consultant at SiteSynth - a consultancy and product studio at the intersection of design, development, and AI.

## SiteSynth Core Services:
1. **Brand-Driven Product Strategy** - Strategic vision, positioning, and go-to-market strategy
2. **UX & Design Systems** - Design systems, component libraries, and scalable interfaces  
3. **Full-Stack Development** - Frontend, backend, databases, deployment, and DevOps
4. **AI-Powered Workflows** - AI integration, automation, and intelligent systems

## Your Role & Behavior:
- You are professional, friendly, and concise
- You ONLY answer questions related to SiteSynth services and expertise
- For out-of-scope questions, politely redirect to relevant services
- Be opinionated about what SiteSynth can deliver

## Important Guidelines:
- Keep responses under 150 words unless asked for details
- If user asks about pricing/timeline, suggest they fill the intake form
- Always be helpful and guide users toward services
- Use their project context if available to provide suggestions

${context?.userProjects ? `\n## Their Projects/Orders:\n${context.userProjects}` : ''}`
}

/**
 * Call VoltAgent with conversation history and observability
 * Executes the agent's logic with full VoltOps telemetry support
 */
async function callAgent(
  agent: any,
  userMessage: string,
  conversationHistory: ChatMessage[],
  context?: ChatContext
): Promise<string> {
  const voltAgent = getVoltAgentInstance()

  try {
    voltAgent.logger.debug('🔄 Calling VoltAgent', {
      agent: agent.name,
      mode: context?.mode || 'passive',
      messageLength: userMessage.length,
      historySize: conversationHistory?.length || 0,
    })

    // Build conversation context for agent
    const conversationContext = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n')

    // Build input prompt with context
    let agentInput = userMessage

    if (conversationContext) {
      agentInput = `<conversation>\n${conversationContext}\n</conversation>\n\nNew message from user:\n${userMessage}`
    }

    // Add user project context if available
    if (context?.userProjects) {
      agentInput += `\n\n<user_context>\nPast projects: ${context.userProjects}\n</user_context>`
    }

    // Execute agent using VoltAgent's execute method
    // The agent will use its instructions and model to process the input
    const response = await agent.execute(agentInput)

    if (typeof response === 'string') {
      voltAgent.logger.debug('✅ Agent response received', {
        agent: agent.name,
        responseLength: response.length,
      })
      return response
    }

    // If response is an object, extract text from it
    if (response && typeof response === 'object') {
      const text = response.text || response.content || response.message || JSON.stringify(response)
      voltAgent.logger.debug('✅ Agent response extracted', {
        agent: agent.name,
        responseLength: text.length,
      })
      return text
    }

    return String(response || 'No response from agent')
  } catch (error: any) {
    voltAgent.logger.warn(`⚠️  Agent execute failed, falling back to direct API`, {
      agent: agent.name,
      error: error.message,
    })

    // Fallback to direct API call if agent fails
    const systemPrompt = buildSystemPrompt(context?.mode || 'passive', context)
    return await callGoogle(
      userMessage,
      conversationHistory,
      systemPrompt,
      process.env.LLM_API_KEY || '',
      undefined,
      context
    )
  }
}

/**
 * Load company information from NocoBase
 */
async function loadCompanyInfo(): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/api/company-info', {
      method: 'GET',
    })

    if (!response.ok) return ''

    const result = await response.json()
    if (!result.data || result.data.length === 0) return ''

    // Format company info for context
    const groupedByCategory: Record<string, string[]> = {}
    result.data.forEach((item: any) => {
      if (!groupedByCategory[item.category]) {
        groupedByCategory[item.category] = []
      }
      groupedByCategory[item.category].push(`- ${item.key}: ${item.value}`)
    })

    let info = '\n## Company Information from Database:\n'
    for (const [category, items] of Object.entries(groupedByCategory)) {
      info += `\n### ${category.toUpperCase()}\n${items.join('\n')}\n`
    }

    return info
  } catch (err: any) {
    console.warn('Could not load company info:', err.message)
    return ''
  }
}

/**
 * Call the configured LLM service (Google Gemini)
 */
async function callLLMService(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  systemPrompt: string,
  context?: ChatContext
): Promise<string> {
  const provider = process.env.LLM_PROVIDER || 'google'
  const apiKey = process.env.LLM_API_KEY

  // Only Google Gemini supported
  if (!apiKey || provider !== 'google') {
    console.warn('Using Google Gemini (configured provider)')
    return await callGoogle(userMessage, conversationHistory, systemPrompt, apiKey || '', undefined, context)
  }

  try {
    return await callGoogle(userMessage, conversationHistory, systemPrompt, apiKey, undefined, context)
  } catch (error: any) {
    console.error(`Error calling Google Gemini:`, error)
    return await getDefaultAIResponse(userMessage, conversationHistory, context)
  }
}

/**
 * Call Google Gemini API
 */
async function callGoogle(
  userMessage: string,
  conversationHistory: ChatMessage[],
  systemPrompt: string,
  apiKey: string,
  apiUrl?: string,
  context?: ChatContext
): Promise<string> {
  const url = apiUrl || `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`

  // Build conversation history for Gemini (convert to Gemini format)
  const contents: any[] = []

  // Add previous messages from conversation history
  if (conversationHistory && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })
    }
  }

  // Add current message with system prompt
  contents.push({
    role: 'user',
    parts: [{ text: systemPrompt + '\n\n---\n\n' + userMessage }],
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Google API error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    console.warn('Google API returned empty response:', JSON.stringify(data))
    return 'No response received'
  }

  return text
}

/**
 * Build conversation memory from history
 * Creates a smart summary of recent messages for context
 */
function buildConversationMemory(conversationHistory: ChatMessage[]): string {
  if (!conversationHistory || conversationHistory.length === 0) {
    return '(No previous conversation)'
  }

  // Keep last 10 messages (5 exchanges) for context
  const recentMessages = conversationHistory.slice(-10)

  // Detect main topics being discussed
  const topics: Set<string> = new Set()
  const allText = conversationHistory.map(m => m.content).join(' ').toLowerCase()

  if (allText.includes('design') || allText.includes('ui') || allText.includes('ux')) {
    topics.add('Design/UX')
  }
  if (allText.includes('develop') || allText.includes('code') || allText.includes('backend') || allText.includes('frontend')) {
    topics.add('Development')
  }
  if (allText.includes('ai') || allText.includes('chatbot') || allText.includes('automation')) {
    topics.add('AI/Automation')
  }
  if (allText.includes('strategy') || allText.includes('vision') || allText.includes('go-to-market')) {
    topics.add('Strategy')
  }
  if (allText.includes('price') || allText.includes('cost') || allText.includes('budget') || allText.includes('investment')) {
    topics.add('Pricing/Budget')
  }
  if (allText.includes('timeline') || allText.includes('deadline') || allText.includes('when')) {
    topics.add('Timeline')
  }
  if (allText.includes('team') || allText.includes('experience') || allText.includes('portfolio')) {
    topics.add('Team/Expertise')
  }

  // Build summary
  let summary = ''

  if (topics.size > 0) {
    summary += `Topics discussed: ${Array.from(topics).join(', ')}\n\n`
  }

  // Add recent conversation snippet (last 3 exchanges)
  summary += 'Recent conversation:\n'
  recentMessages.forEach(msg => {
    const role = msg.role === 'user' ? 'Customer' : 'Viz'
    const content = msg.content.length > 100
      ? msg.content.substring(0, 100) + '...'
      : msg.content
    summary += `- ${role}: ${content}\n`
  })

  return summary
}

/**
 * Smart fallback AI response generator — remembers conversation context
 */
async function getDefaultAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  context?: ChatContext
): Promise<string> {
  const message = userMessage.toLowerCase()

  // Detect conversation topic from history
  const conversationTopic = detectConversationTopic(conversationHistory)

  // Build context-aware response
  let baseResponse = ''

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    baseResponse = "Hello! 👋 I'm Viz, AI consultant at SiteSynth. How can I help you today?"
  } else if (
    message.includes('service') ||
    message.includes('what do you') ||
    message.includes('offer') ||
    conversationTopic === 'services'
  ) {
    baseResponse =
      "We offer four main services:\n\n" +
      "1. **Brand-Driven Product Strategy** - Strategic vision for your product\n" +
      "2. **UX & Design Systems** - Scalable, beautiful interfaces\n" +
      "3. **Full-Stack Development** - Web/app development from frontend to backend\n" +
      "4. **AI-Powered Workflows** - AI integration for automation\n\n" +
      "Which service interests you?"
  } else if (
    message.includes('price') ||
    message.includes('cost') ||
    message.includes('budget') ||
    conversationTopic === 'pricing'
  ) {
    baseResponse =
      "Pricing depends on scope and complexity. We work with startups to enterprises.\n\n" +
      "• **Consultation** from $500\n" +
      "• **Design & UX** from $5,000\n" +
      "• **Full-Stack Dev** from $10,000\n" +
      "• **AI Integration** from $3,000\n\n" +
      "Fill out our intake form for a custom quote!"
  } else if (message.includes('design') || conversationTopic === 'design') {
    baseResponse =
      "We specialize in UX/UI Design and Design Systems. We combine strategic thinking with beautiful interfaces, " +
      "creating systems that scale with your product.\n\n" +
      "What aspect of design are you interested in?"
  } else if (message.includes('development') || conversationTopic === 'development') {
    baseResponse =
      "Our Full-Stack Development covers frontend to backend, databases to deployment.\n\n" +
      "We use: Vue 3, React, Node.js, Nuxt, TypeScript, TailwindCSS, Supabase, PostgreSQL, AWS, and more.\n\n" +
      "What kind of application are you building?"
  } else if (message.includes('timeline') || message.includes('how long')) {
    baseResponse =
      "Project timelines vary:\n" +
      "• Consultation: 1-3 days\n" +
      "• Design: 2-4 weeks\n" +
      "• Development: 1-3 months (depends on complexity)\n" +
      "• AI Integration: 1-2 weeks\n\n" +
      "What's your timeline?"
  } else if (message.includes('process') || message.includes('how do you work')) {
    baseResponse =
      "Our process has 5 steps:\n" +
      "1. **Discovery & Planning** - Understand your needs\n" +
      "2. **Proposal & Agreement** - Detailed quote and contract\n" +
      "3. **Kick-off Meeting** - Meet the team, set expectations\n" +
      "4. **Development & Reviews** - Weekly sync and demos\n" +
      "5. **Launch & Support** - Deploy and provide tech support\n\n" +
      "Ready to get started?"
  } else if (message.includes('team') || message.includes('who will')) {
    baseResponse =
      "You'll work with our experienced team:\n" +
      "• Designers with 5+ years experience\n" +
      "• Developers with 5+ years experience\n" +
      "• Project Manager and QA specialist\n\n" +
      "All team members are carefully selected and verified."
  } else if (message.includes('ai') || conversationTopic === 'ai') {
    baseResponse =
      "We integrate AI (Claude, GPT, Gemini) for:\n" +
      "• Chat-bots and customer service\n" +
      "• Data analysis and insights\n" +
      "• Process automation\n" +
      "• Content generation\n\n" +
      "What AI capability interests you?"
  } else {
    // Default, but acknowledge conversation context if exists
    if (conversationHistory.length > 0) {
      baseResponse =
        "I'm here to help! We've been discussing some interesting topics. " +
        "Feel free to ask more about our services, your project, timeline, pricing, or anything else."
    } else {
      baseResponse =
        "I'm Viz, AI consultant at SiteSynth. Ask me about our services, pricing, process, or your project needs!"
    }
  }

  return baseResponse
}

/**
 * Detect main topic of conversation from history
 */
function detectConversationTopic(conversationHistory: ChatMessage[]): string {
  if (!conversationHistory || conversationHistory.length === 0) {
    return 'general'
  }

  const allText = conversationHistory.map((m) => m.content).join(' ').toLowerCase()

  if (
    allText.includes('design') ||
    allText.includes('ui') ||
    allText.includes('ux') ||
    allText.includes('interface')
  ) {
    return 'design'
  }
  if (
    allText.includes('develop') ||
    allText.includes('code') ||
    allText.includes('backend') ||
    allText.includes('frontend') ||
    allText.includes('database')
  ) {
    return 'development'
  }
  if (allText.includes('ai') || allText.includes('artificial') || allText.includes('chatbot')) {
    return 'ai'
  }
  if (
    allText.includes('price') ||
    allText.includes('cost') ||
    allText.includes('budget') ||
    allText.includes('fee')
  ) {
    return 'pricing'
  }
  if (allText.includes('service')) {
    return 'services'
  }

  return 'general'
}
