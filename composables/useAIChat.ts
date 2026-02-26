import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatContext {
  page: string
  projectId?: string
  briefingId?: string
  userId?: string
  context?: string
}

// Global singleton state - shared across all instances
let aiChatState: ReturnType<typeof createAIChatState> | null = null

function createAIChatState() {
  const isOpen = ref(false)
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const context = ref<ChatContext>({ page: '/' })

  const hasMessages = computed(() => messages.value.length > 0)

  // Auto-detect context from current route
  const detectContext = () => {
    const route = useRoute()
    const path = route.path
    context.value.page = path

    // Extract IDs from route params
    if (route.params.id) {
      context.value.projectId = String(route.params.id)
    }
    if (route.query.briefing) {
      context.value.briefingId = String(route.query.briefing)
    }

    // Set context message based on page
    if (path.includes('/projects')) {
      context.value.context = `User is viewing the Projects/Briefing Cabinet`
    } else if (path.includes('/cabinet')) {
      context.value.context = `User is viewing their CRM Cabinet with orders and projects`
    } else if (path.includes('/intake')) {
      context.value.context = `User is filling out a service intake form`
    } else if (path.includes('/payment')) {
      context.value.context = `User is at the payment/checkout page`
    } else if (path.includes('/login')) {
      context.value.context = `User is at the login page`
    } else {
      context.value.context = `User is on the main website`
    }
  }

  const toggleChat = () => {
    isOpen.value = !isOpen.value
  }

  const openChat = () => {
    isOpen.value = true
  }

  const closeChat = () => {
    isOpen.value = false
  }

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    messages.value.push({
      id: `msg_${Date.now()}_${Math.random()}`,
      role,
      content,
      timestamp: new Date(),
    })
  }

  const clearMessages = () => {
    messages.value = []
  }

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Detect context before sending
    detectContext()

    // Add user message to chat
    addMessage('user', userMessage)
    isLoading.value = true
    error.value = null

    try {
      // Call the AI API endpoint with context
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.value.map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: context.value,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get response from AI')
      }

      // Add assistant message to chat
      addMessage('assistant', result.message)
    } catch (err: any) {
      console.error('AI chat error:', err)
      error.value = err.message || 'Failed to send message'
      // Add error message to chat
      addMessage('assistant', `I encountered an error: ${error.value}. Please try again.`)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isOpen,
    messages,
    isLoading,
    error,
    hasMessages,
    context,
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    clearMessages,
    sendMessage,
    detectContext,
  }
}

/**
 * Global AI Chat composable - returns singleton instance
 * Ensures all components share the same state
 */
export const useAIChat = () => {
  if (!aiChatState) {
    aiChatState = createAIChatState()
  }
  return aiChatState
}
