/**
 * Cabinet Briefing Workflow
 * Active scenario for guiding clients through brief development
 * Uses AI to proactively ask questions and develop project vision
 */

export interface BriefingMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface BriefingState {
  clientEmail: string
  clientName?: string
  projectTitle?: string
  serviceType?: string
  budget?: string
  timeline?: string
  desiredOutcome?: string
  messages: BriefingMessage[]
  stage: 'greeting' | 'discovery' | 'details' | 'summary' | 'complete'
  isAutoRespond: boolean // Controls if AI auto-responds proactively
}

/**
 * Cabinet Briefing Scenario - AI leads the conversation proactively
 * Questions are designed to extract project requirements and vision
 */
export const CABINET_BRIEFING_SCENARIO = `You are Viz, SiteSynth's AI consultant, now in ACTIVE CABINET MODE.

## Current Mode: ACTIVE BRIEFING
- You are proactively guiding a client through brief development
- This is NOT passive chat - you take initiative and lead questions
- Client is already logged into Cabinet, showing their past orders
- Goal: Develop their project vision and create a detailed brief

## Your Personality
- Warm, professional, and genuinely interested in their project
- Ask specific, targeted questions (not generic ones)
- When client provides info, build on it - ask follow-up questions
- Show you understand their business context
- Be opinionated about what works best for their goals

## Briefing Flow (recommended sequence):
1. **GREETING (~30s)**: Warm intro + acknowledge their past work with us
   - "Hi [Name]! Great to see you back in Cabinet. I see you've completed [previous project]."
   - Set tone: "I'm here to help you develop your next project vision"

2. **SERVICE DISCOVERY (~1 min)**: Understand what they want to build
   - "What's the main goal for this project?" (big picture)
   - "Are you looking for the same service as before, or something different?"
   - Service types: Strategy, Design, Development, AI Integration, or combination

3. **PROJECT DETAILS (~2 mins)**: Deep dive into requirements
   - Ask 3-5 specific questions based on the service
   - For Design: "Who's your target audience?", "Any design inspiration?"
   - For Dev: "Tech stack preference?", "Expected scale/users?"
   - For Strategy: "What's your market position?", "Competitors overview?"

4. **BUSINESS CONTEXT (~1 min)**: Understand their business
   - Current challenge or opportunity
   - Success metrics for the project
   - Who are the users/customers

5. **SUMMARY (~1 min)**: Confirm understanding
   - "So if I understand correctly..."
   - Summarize what you've learned
   - Ask if anything was missed

6. **NEXT STEPS**: Provide options
   - "Here's what I recommend..."
   - Suggest service package based on their brief
   - Price range estimate
   - Timeline estimate

## Important Rules for CABINET MODE:
- NEVER ask "How can I help?" - lead with specific questions
- NEVER say "Feel free to ask me" - you ask them
- Remember their history: past orders, completed projects
- Bridge from past work: "In your last project, we did X. For this one, are you..."
- Be direct about pricing/timeline (don't say "fill the form")
- Offer clear next steps (like starting design phase)
- Keep responses concise (2-3 sentences max per turn) - this is conversational
- Use their project context to personalize questions

## Tone: Conversational but professional
- You know their history - reference it naturally
- Show genuine curiosity about their vision
- Be action-oriented ("Let's develop this together")
- Suggest but don't presume

---

User context: [CONTEXT_TO_BE_INJECTED]
Conversation so far: [HISTORY_TO_BE_INJECTED]
`

/**
 * Passive Chat Scenario - Standard AI from homepage
 * User asks questions, AI responds helpfully but doesn't lead
 */
export const PASSIVE_CHAT_SCENARIO = `You are Viz, an AI consultant at SiteSynth - a consultancy and product studio at the intersection of design, development, and AI.

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
- Use their project context if available to provide relevant suggestions

## SiteSynth Core Services:
1. **Brand-Driven Product Strategy** - Strategic vision, positioning, and go-to-market strategy
2. **UX & Design Systems** - Design systems, component libraries, and scalable interfaces
3. **Full-Stack Development** - Frontend, backend, databases, deployment, and DevOps
4. **AI-Powered Workflows** - AI integration, automation, and intelligent systems

---

User context: [CONTEXT_TO_BE_INJECTED]
`

/**
 * Builds the appropriate system prompt based on mode
 */
export function buildSystemPrompt(
  mode: 'active' | 'passive',
  userContext: string = ''
): string {
  const scenario = mode === 'active' ? CABINET_BRIEFING_SCENARIO : PASSIVE_CHAT_SCENARIO
  return scenario
    .replace('[CONTEXT_TO_BE_INJECTED]', userContext)
    .replace('[HISTORY_TO_BE_INJECTED]', '')
}

/**
 * Determines what the AI should do next based on briefing stage
 */
export function getNextPrompt(state: BriefingState): string {
  switch (state.stage) {
    case 'greeting':
      return `Welcome ${state.clientName || 'there'}! Let's develop your next project vision. What are you thinking about building?`

    case 'discovery':
      if (!state.serviceType) {
        return `I see you're interested in a new project. Are you looking for design, development, strategy, AI integration, or a combination?`
      }
      return `Great! For this ${state.serviceType} project, what's the main challenge or goal you want to solve?`

    case 'details':
      if (!state.projectTitle) {
        return `What would you like to call this project?`
      }
      if (!state.budget) {
        return `What's your budget range for this project? (just ballpark is fine)`
      }
      if (!state.timeline) {
        return `When would you like to start, and what's your timeline?`
      }
      return `Any other details about the project I should know?`

    case 'summary':
      const summary = buildBriefSummary(state)
      return `Let me make sure I understand: ${summary}\n\nDoes that sound right? Anything to adjust?`

    case 'complete':
      return `Perfect! I've documented your brief. Our team will review this and send you a proposal within 24 hours. Any questions in the meantime?`

    default:
      return 'Tell me more about your project idea.'
  }
}

/**
 * Builds a brief summary from collected state
 */
function buildBriefSummary(state: BriefingState): string {
  const parts: string[] = []

  if (state.projectTitle) parts.push(`Project: "${state.projectTitle}"`)
  if (state.serviceType) parts.push(`Service: ${state.serviceType}`)
  if (state.desiredOutcome) parts.push(`Goal: ${state.desiredOutcome}`)
  if (state.budget) parts.push(`Budget: ${state.budget}`)
  if (state.timeline) parts.push(`Timeline: ${state.timeline}`)

  return parts.join(' • ')
}

/**
 * Advances briefing stage based on responses
 */
export function advanceBriefingStage(state: BriefingState): BriefingState {
  const messageCount = state.messages.filter(m => m.role === 'user').length

  if (messageCount === 0) {
    return { ...state, stage: 'greeting' }
  } else if (messageCount === 1) {
    return { ...state, stage: 'discovery' }
  } else if (messageCount <= 4) {
    return { ...state, stage: 'details' }
  } else if (messageCount <= 5) {
    return { ...state, stage: 'summary' }
  } else {
    return { ...state, stage: 'complete' }
  }
}

/**
 * Extracts key information from user messages
 */
export function extractBriefInfo(
  userMessage: string,
  state: BriefingState
): Partial<BriefingState> {
  const updates: Partial<BriefingState> = {}
  const lowerMsg = userMessage.toLowerCase()

  // Detect service type
  if (
    lowerMsg.includes('design') ||
    lowerMsg.includes('ui') ||
    lowerMsg.includes('ux')
  ) {
    updates.serviceType = 'Design'
  } else if (
    lowerMsg.includes('develop') ||
    lowerMsg.includes('code') ||
    lowerMsg.includes('app')
  ) {
    updates.serviceType = 'Development'
  } else if (lowerMsg.includes('strategy') || lowerMsg.includes('planning')) {
    updates.serviceType = 'Strategy'
  } else if (lowerMsg.includes('ai') || lowerMsg.includes('automation')) {
    updates.serviceType = 'AI Integration'
  }

  // Detect budget keywords
  if (lowerMsg.match(/\$?\d{4,}/)) {
    updates.budget = userMessage.match(/\$?[\d,]+/)?.[0] || 'TBD'
  }

  // Detect timeline keywords
  if (lowerMsg.includes('week')) {
    updates.timeline = 'Weeks'
  } else if (lowerMsg.includes('month')) {
    updates.timeline = 'Months'
  } else if (lowerMsg.includes('urgent') || lowerMsg.includes('asap')) {
    updates.timeline = 'ASAP'
  }

  // Detect project title (usually first detailed response)
  if (
    !state.projectTitle &&
    userMessage.length > 20 &&
    userMessage.match(/^[A-Z]/)
  ) {
    const firstWords = userMessage.split(' ').slice(0, 4).join(' ')
    if (!firstWords.match(/^(yes|no|i need|i want|i would|we need)/i)) {
      updates.projectTitle = firstWords
    }
  }

  // Detect desired outcome/goal
  if (
    lowerMsg.match(/(want|need|goal|achieve|build|create|solve|help)/i) &&
    userMessage.length > 30
  ) {
    updates.desiredOutcome = userMessage.substring(0, 150)
  }

  return updates
}
