import { defineEventHandler, readBody } from 'h3'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatContext {
  page: string
  projectId?: string
  briefingId?: string
  userId?: string
  context?: string
}

interface ChatRequest {
  message: string
  conversationHistory: ChatMessage[]
  context?: ChatContext
}

/**
 * AI Chat endpoint
 * Processes user messages through configured LLM service
 * Supports conversational AI with memory of conversation history
 *
 * Configured via environment variables:
 * - LLM_PROVIDER: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'ollama'
 * - LLM_API_KEY: API key for the selected provider
 * - LLM_API_URL: (optional) Custom API endpoint
 */
export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as ChatRequest

    if (!body.message || typeof body.message !== 'string') {
      throw new Error('Message is required')
    }

    // Call LLM service with context
    const aiResponse = await callLLMService(
      body.message,
      body.conversationHistory,
      body.context
    )

    return {
      success: true,
      message: aiResponse,
    }
  } catch (error: any) {
    console.error('AI Chat Error:', error)
    return {
      success: false,
      error: error.message || 'Failed to process chat message',
    }
  }
})

/**
 * Call the configured LLM service (OpenAI, Claude, etc.)
 */
async function callLLMService(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  context?: ChatContext
): Promise<string> {
  const provider = process.env.LLM_PROVIDER || 'fallback'
  const apiKey = process.env.LLM_API_KEY
  const apiUrl = process.env.LLM_API_URL

  // If no LLM service configured, use fallback
  if (!apiKey || provider === 'fallback') {
    console.warn('No LLM service configured, using fallback responses')
    return await getDefaultAIResponse(userMessage)
  }

  try {
    if (provider === 'openai') {
      return await callOpenAI(userMessage, conversationHistory, apiKey, apiUrl, context)
    } else if (provider === 'anthropic') {
      return await callAnthropic(userMessage, conversationHistory, apiKey, apiUrl, context)
    } else if (provider === 'google') {
      return await callGoogle(userMessage, conversationHistory, apiKey, apiUrl, context)
    } else {
      console.warn(`LLM provider '${provider}' not implemented, using fallback`)
      return await getDefaultAIResponse(userMessage)
    }
  } catch (error: any) {
    console.error(`Error calling ${provider}:`, error)
    return await getDefaultAIResponse(userMessage)
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  userMessage: string,
  conversationHistory: ChatMessage[],
  apiKey: string,
  apiUrl?: string,
  context?: ChatContext
): Promise<string> {
  const url = apiUrl || 'https://api.openai.com/v1/chat/completions'

  const contextInfo = context?.context ? `\n\n**Current Context**: ${context.context}` : ''
  const pageInfo = context?.page ? `\nPage: ${context.page}` : ''
  const userDataInfo = context?.userProjects ? `\n\n**User's Projects/Orders**:\n${context.userProjects}` : ''

  const systemPrompt = `You are Viz, an AI consultant at SiteSynth - a consultancy and product studio at the intersection of design, development, and AI.

## SiteSynth Core Services:
1. **Brand-Driven Product Strategy** - Strategic vision, positioning, and go-to-market strategy
2. **UX & Design Systems** - Design systems, component libraries, and scalable interfaces
3. **Full-Stack Development** - Frontend, backend, databases, deployment, and DevOps
4. **AI-Powered Workflows** - AI integration, automation, and intelligent systems

## Your Role & Behavior:
- You are professional, friendly, and concise
- You ONLY answer questions related to:
  * SiteSynth services and how we can help
  * Project strategy, design, or development
  * General business inquiries relevant to our expertise
  * User's existing projects or orders (if context provided)
- For out-of-scope questions, politely redirect to our relevant services
- IMPORTANT: Be opinionated about what SiteSynth can deliver, but always suggest next steps

## Important Guidelines:
- Keep responses under 150 words unless asked for details
- If user asks about pricing/timeline, suggest they fill the intake form for specifics
- If user wants to discuss their project, encourage them to use the intake form
- Always be helpful and guide users toward relevant services
- Use their project context if available to provide relevant suggestions${userDataInfo}${contextInfo}${pageInfo}`

  const messages = [
    {
      role: 'system',
      content: systemPrompt,
    },
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ]

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || 'No response received'
}

/**
 * Call Anthropic Claude API
 */
async function callAnthropic(
  userMessage: string,
  conversationHistory: ChatMessage[],
  apiKey: string,
  apiUrl?: string,
  context?: ChatContext
): Promise<string> {
  const url = apiUrl || 'https://api.anthropic.com/v1/messages'

  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user',
      content: userMessage,
    },
  ]

  const contextInfo = context?.context ? `\n\n**Current Context**: ${context.context}` : ''
  const pageInfo = context?.page ? `\nPage: ${context.page}` : ''
  const userDataInfo = context?.userProjects ? `\n\n**User's Projects/Orders**:\n${context.userProjects}` : ''

  const systemPrompt = `You are Viz, an AI consultant at SiteSynth - a consultancy and product studio at the intersection of design, development, and AI.

## SiteSynth Core Services:
1. **Brand-Driven Product Strategy** - Strategic vision, positioning, and go-to-market strategy
2. **UX & Design Systems** - Design systems, component libraries, and scalable interfaces
3. **Full-Stack Development** - Frontend, backend, databases, deployment, and DevOps
4. **AI-Powered Workflows** - AI integration, automation, and intelligent systems

## Your Role & Behavior:
- You are professional, friendly, and concise
- You ONLY answer questions related to:
  * SiteSynth services and how we can help
  * Project strategy, design, or development
  * General business inquiries relevant to our expertise
  * User's existing projects or orders (if context provided)
- For out-of-scope questions, politely redirect to our relevant services
- IMPORTANT: Be opinionated about what SiteSynth can deliver, but always suggest next steps

## Important Guidelines:
- Keep responses under 150 words unless asked for details
- If user asks about pricing/timeline, suggest they fill the intake form for specifics
- If user wants to discuss their project, encourage them to use the intake form
- Always be helpful and guide users toward relevant services
- Use their project context if available to provide relevant suggestions${userDataInfo}${contextInfo}${pageInfo}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || 'No response received'
}

/**
 * Call Google Gemini API
 */
async function callGoogle(
  userMessage: string,
  conversationHistory: ChatMessage[],
  apiKey: string,
  apiUrl?: string,
  context?: ChatContext
): Promise<string> {
  const url = apiUrl || `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${apiKey}`

  const contextInfo = context?.context ? `\n\n**Current Context**: ${context.context}` : ''
  const pageInfo = context?.page ? `\nPage: ${context.page}` : ''
  const userDataInfo = context?.userProjects ? `\n\n**User's Projects/Orders**:\n${context.userProjects}` : ''

  const systemPrompt = `You are Viz, an AI consultant at SiteSynth - a consultancy and product studio at the intersection of design, development, and AI.

## SiteSynth Core Services:
1. **Brand-Driven Product Strategy** - Strategic vision, positioning, and go-to-market strategy
2. **UX & Design Systems** - Design systems, component libraries, and scalable interfaces
3. **Full-Stack Development** - Frontend, backend, databases, deployment, and DevOps
4. **AI-Powered Workflows** - AI integration, automation, and intelligent systems

## Your Role & Behavior:
- You are professional, friendly, and concise
- You ONLY answer questions related to:
  * SiteSynth services and how we can help
  * Project strategy, design, or development
  * General business inquiries relevant to our expertise
  * User's existing projects or orders (if context provided)
- For out-of-scope questions, politely redirect to our relevant services
- IMPORTANT: Be opinionated about what SiteSynth can deliver, but always suggest next steps

## Important Guidelines:
- Keep responses under 150 words unless asked for details
- If user asks about pricing/timeline, suggest they fill the intake form for specifics
- If user wants to discuss their project, encourage them to use the intake form
- Always be helpful and guide users toward relevant services
- Use their project context if available to provide relevant suggestions${userDataInfo}${contextInfo}${pageInfo}`

  const contents = [
    {
      role: 'user',
      parts: [{ text: systemPrompt + '\n\n---\n\n' + userMessage }],
    },
  ]

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
 * Default AI response generator (fallback)
 */
async function getDefaultAIResponse(userMessage: string): Promise<string> {
  const message = userMessage.toLowerCase()

  // Keyword-based responses for demonstration
  if (
    message.includes('hello') ||
    message.includes('hi') ||
    message.includes('hey')
  ) {
    return "Hello! 👋 I'm an AI assistant at SiteSynth. How can I help you today? Feel free to ask me about our services, pricing, processes, or anything else related to your project."
  }

  if (
    message.includes('service') ||
    message.includes('what do you') ||
    message.includes('offer')
  ) {
    return "SiteSynth offers four main services:\n\n1. **Brand-Driven Product Strategy** - Creating strategic vision for your product\n2. **UX & Design Systems** - Building scalable, beautiful interfaces\n3. **Full-Stack Development** - Complete web and app development\n4. **AI-Powered Workflows** - Integrating AI to enhance your processes\n\nWhich service interests you?"
  }

  if (message.includes('price') || message.includes('cost') || message.includes('budget')) {
    return "Our pricing depends on the scope and complexity of your project. We work with startups and enterprises at various scales. I'd recommend starting with our intake form to discuss your specific needs, or feel free to ask more questions here!"
  }

  if (message.includes('design')) {
    return "We specialize in UX/UI Design and Design Systems. Our approach combines strategic thinking with beautiful, functional interfaces. We create design systems that scale with your product and team. What aspect of design are you interested in?"
  }

  if (message.includes('development') || message.includes('development')) {
    return "Our Full-Stack Development service covers everything from frontend to backend, databases to deployment. We use modern technologies like Vue, React, Node.js, and more. We build scalable, secure applications tailored to your needs."
  }

  if (message.includes('project') || message.includes('start')) {
    return "Great! To discuss your project, we have an intake form that helps us understand your needs, timeline, and budget. Would you like to proceed with the intake form, or do you have specific questions first?"
  }

  if (message.includes('contact') || message.includes('talk') || message.includes('call')) {
    return "You can reach out to us through our contact form, or continue chatting here! We also have detailed intake forms to help us understand your project better. What would you like to discuss?"
  }

  // Default response
  return "I'm here to help! Feel free to ask me about our services, your project requirements, or anything else. What can I assist you with?"
}
