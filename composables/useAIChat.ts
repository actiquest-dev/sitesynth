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
  userProjects?: string
}

// Global singleton state - shared across all instances
let aiChatState: ReturnType<typeof createAIChatState> | null = null

function createAIChatState() {
  const isOpen = ref(false)
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const context = ref<ChatContext>({ page: '/' })
  const isInitialized = ref(false)

  const hasMessages = computed(() => messages.value.length > 0)

  // Auto-detect context from current route and load user data
  const detectContext = async () => {
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

    // Set context message based on page and load user data if in cabinet
    if (path.includes('/projects')) {
      context.value.context = `User is viewing the Projects/Briefing Cabinet`
    } else if (path.includes('/cabinet')) {
      context.value.context = `User is viewing their CRM Cabinet with orders and projects`
      // Load user's projects and orders for cabinet context
      await loadUserDataForContext()
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

  // Load user's projects and orders for context
  const loadUserDataForContext = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) return

      // Fetch user's orders
      const ordersRes = await fetch('/api/user/orders', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      })
      const ordersData = ordersRes.ok ? await ordersRes.json() : { data: [] }
      const orders = ordersData.data || []

      // Fetch user's projects
      const projectsRes = await fetch('/api/user/projects', {
        headers: { 'Authorization': `Bearer ${authToken}` },
      })
      const projectsData = projectsRes.ok ? await projectsRes.json() : { data: [] }
      const projects = projectsData.data || []

      // Format user data for context
      const userDataSummary = formatUserDataForContext(orders, projects)
      if (userDataSummary) {
        context.value.userProjects = userDataSummary
      }
    } catch (err) {
      console.error('Error loading user data for context:', err)
    }
  }

  // Format user's orders and projects for AI context
  const formatUserDataForContext = (orders: any[], projects: any[]) => {
    const parts: string[] = []

    if (orders.length > 0) {
      parts.push(`Orders: ${orders.length} active`)
      orders.slice(0, 3).forEach((order: any, idx: number) => {
        const status = order.status || 'pending'
        const amount = order.amount ? `$${order.amount}` : 'TBD'
        parts.push(`• Order #${order.id?.slice?.(-6) || '...'} - ${status} - ${amount}`)
      })
    }

    if (projects.length > 0) {
      parts.push(`Projects: ${projects.length} total`)
      projects.slice(0, 3).forEach((project: any, idx: number) => {
        const status = project.status || 'in_progress'
        const service = project.service_type || 'Project'
        parts.push(`• ${project.name || 'Untitled'} - ${service} (${status})`)
      })
    }

    return parts.length > 0 ? parts.join('\n') : ''
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

  // Load chat messages from NocoBase
  const loadChatMessages = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) return

      const response = await fetch('/api/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: 'load',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.messages) {
          messages.value = result.messages.map((msg: any) => ({
            id: `msg_${Math.random()}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          }))
        }
      }
    } catch (err) {
      console.error('Error loading chat history:', err)
    }
  }

  // Save chat messages to NocoBase
  const saveChatMessages = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) return

      const response = await fetch('/api/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: 'save',
          messages: messages.value.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
      })

      if (!response.ok) {
        console.warn('Failed to save chat messages to NocoBase')
      }
    } catch (err) {
      console.error('Error saving chat messages:', err)
    }
  }

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    // Detect context before sending
    await detectContext()

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
      // Save messages and context to NocoBase after sending
      await Promise.all([saveChatMessages(), saveContext()])
    }
  }

  // Save conversation context to NocoBase
  const saveContext = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) return

      await fetch('/api/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: 'save-context',
          context: context.value,
        }),
      })
    } catch (err) {
      console.error('Error saving context:', err)
    }
  }

  // Load conversation context from NocoBase
  const loadContext = async () => {
    try {
      const authToken = localStorage.getItem('authToken')
      if (!authToken) return

      const response = await fetch('/api/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          action: 'load-context',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.context) {
          context.value = { ...context.value, ...result.context }
        }
      }
    } catch (err) {
      console.error('Error loading context:', err)
    }
  }

  // Initialize chat by loading previous messages and context
  const initializeChat = async () => {
    if (isInitialized.value) return
    await Promise.all([loadChatMessages(), loadContext()])
    isInitialized.value = true
  }

  return {
    isOpen,
    messages,
    isLoading,
    error,
    hasMessages,
    context,
    isInitialized,
    toggleChat,
    openChat,
    closeChat,
    addMessage,
    clearMessages,
    sendMessage,
    detectContext,
    loadChatMessages,
    saveChatMessages,
    saveContext,
    loadContext,
    initializeChat,
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
