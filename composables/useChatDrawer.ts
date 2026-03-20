// Shared chat drawer state — use this from any page or component
// to open the chat drawer in the correct mode with context

export interface BriefContext {
  id: string
  name: string
  content: string
  conversationId: string   // brief's own conversation_id — reuse it in chat
  files?: string[]
}

export const useChatDrawer = () => {
  const isOpen = useState<boolean>('chatIsOpen', () => false)
  const agentMode = useState<'presale' | 'briefing' | 'post-brief'>('chatAgentMode', () => 'presale')
  const briefContext = useState<BriefContext | null>('chatBriefContext', () => null)

  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }

  // Open chat in post-brief mode with brief context
  // The drawer will proactively start the conversation
  const openPostBrief = (brief: BriefContext) => {
    briefContext.value = brief
    agentMode.value = 'post-brief'
    isOpen.value = true
  }

  // Reset to default briefing mode
  const resetToDefault = () => {
    briefContext.value = null
    agentMode.value = 'briefing'
  }

  return { isOpen, agentMode, briefContext, open, close, openPostBrief, resetToDefault }
}
