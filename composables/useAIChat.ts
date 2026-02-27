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
  mode: 'passive' | 'active' // 'passive' = normal chat, 'active' = cabinet briefing
  projectId?: string
  briefingId?: string
  userId?: string
  context?: string
  userProjects?: string
  clientEmail?: string
  clientName?: string
}

// Global singleton state - shared across all instances
let aiChatState: ReturnType<typeof createAIChatState> | null = null

function createAIChatState() {
  const isOpen = ref(false)
  const messages = ref<ChatMessage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const context = ref<ChatContext>({ page: '/', mode: 'passive' })
  const isInitialized = ref(false)

  const hasMessages = computed(() => messages.value.length > 0)

  // Auto-detect context from current route and load user data
  const detectContext = async () => {
    try {
      const route = useRoute()
      if (!route) return

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
      if (path.includes('/cabinet')) {
        context.value.mode = 'active' // ACTIVE mode in cabinet
        context.value.context = `User is viewing their CRM Cabinet with orders and projects. In ACTIVE mode, AI proactively guides through brief development.`
        // Load user's projects and orders for cabinet context
        await loadUserDataForContext()
      } else if (path.includes('/projects')) {
        context.value.mode = 'passive'
        context.value.context = `User is viewing the Projects/Briefing Cabinet`
      } else if (path.includes('/intake')) {
        context.value.mode = 'passive'
        context.value.context = `User is filling out a service intake form`
      } else if (path.includes('/payment')) {
        context.value.mode = 'passive'
        context.value.context = `User is at the payment/checkout page`
      } else if (path.includes('/login')) {
        context.value.mode = 'passive'
        context.value.context = `User is at the login page`
      } else {
        context.value.mode = 'passive'
        context.value.context = `User is on the main website`
      }
    } catch (err) {
      // Router not available, use default context
      return
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
    // Save messages to localStorage when closing (backup)
    if (messages.value.length > 0) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages.value.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }))))
      } catch (err) {
        console.error('Error saving to localStorage on close:', err)
      }
    }
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
      if (!authToken) {
        console.log('No auth token, skipping NocoBase load')
        // Try localStorage fallback even without token
        const cached = localStorage.getItem('chatMessages')
        if (cached) {
          const parsed = JSON.parse(cached)
          messages.value = parsed.map((msg: any) => ({
            id: `msg_${Math.random()}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          }))
          console.log('Loaded chat from localStorage (no auth token)')
        }
        return
      }

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
        if (result.messages && result.messages.length > 0) {
          messages.value = result.messages.map((msg: any) => ({
            id: `msg_${Math.random()}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          }))
          console.log('Loaded chat from NocoBase:', result.messages.length, 'messages')
          return // Success - loaded from NocoBase
        } else {
          console.log('NocoBase returned empty messages')
        }
      } else {
        console.log('NocoBase fetch failed:', response.status)
      }
    } catch (err) {
      console.error('Error loading from NocoBase:', err)
    }

    // Fallback: load from localStorage if NocoBase failed or is empty
    try {
      const cached = localStorage.getItem('chatMessages')
      if (cached) {
        const parsed = JSON.parse(cached)
        messages.value = parsed.map((msg: any) => ({
          id: `msg_${Math.random()}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        }))
        console.log('Loaded chat from localStorage (fallback):', parsed.length, 'messages')
      } else {
        console.log('No cached messages in localStorage')
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err)
    }
  }

  // Save chat messages to NocoBase (primary) + localStorage (fallback)
  const saveChatMessages = async () => {
    const messagesToSave = messages.value.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
    }))

    // Try to save to NocoBase first
    try {
      const authToken = localStorage.getItem('authToken')
      if (authToken) {
        const response = await fetch('/api/chat-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            action: 'save',
            messages: messagesToSave,
          }),
        })

        if (response.ok) {
          return // Success - saved to NocoBase
        } else {
          console.warn('Failed to save to NocoBase, using localStorage fallback')
        }
      }
    } catch (err) {
      console.warn('NocoBase save error, using localStorage fallback:', err)
    }

    // Fallback: save to localStorage
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messagesToSave))
      console.log('Saved chat to localStorage (fallback)')
    } catch (err) {
      console.error('Error saving to localStorage:', err)
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

    // If in active mode and no messages yet, send auto-greeting
    if (context.value.mode === 'active' && messages.value.length === 0) {
      await sendAutoGreeting()
    }
  }

  // Send automatic greeting when cabinet loads (active mode only)
  const sendAutoGreeting = async () => {
    // Get user email from auth
    const authToken = localStorage.getItem('authToken')
    let userEmail = ''
    if (authToken) {
      try {
        const decoded = Buffer.from(authToken, 'base64').toString('utf-8')
        userEmail = decoded.split(':')[0]
      } catch (e) {
        // Failed to decode, continue without it
      }
    }

    const greetingMessage = `Hi there! 👋 I see you're back in your Cabinet. I'm here to help you develop your next project vision. What would you like to build?`

    isLoading.value = true
    addMessage('assistant', greetingMessage)
    isLoading.value = false
  }

  const openChatInMode = (mode: 'passive' | 'active') => {
    context.value.mode = mode
    isOpen.value = true
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
    openChatInMode,
    addMessage,
    clearMessages,
    sendMessage,
    detectContext,
    loadChatMessages,
    saveChatMessages,
    saveContext,
    loadContext,
    initializeChat,
    sendAutoGreeting,
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
