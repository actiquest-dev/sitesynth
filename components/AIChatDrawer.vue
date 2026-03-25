<template>
  <Transition name="slide-in-right">
    <div
      v-if="isOpen"
      class="chat-widget fixed right-0 top-0 h-screen w-full max-w-[400px] border-l border-[#2a2a2a] z-50 flex flex-col bg-[#111]"
    >
      <!-- Header -->
      <div class="px-5 py-4 flex items-center justify-between border-b border-[#222]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[#8D35FF] flex items-center justify-center flex-shrink-0 p-1.5">
            <img src="/assets/Vector.svg" alt="SiteSynth" class="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <h3 class="text-white text-sm font-semibold leading-tight">{{ agentLabel }}</h3>
            <span class="flex items-center gap-1.5">
              <span class="relative flex h-1.5 w-1.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22c55e]"></span>
              </span>
              <span class="text-[10px] text-[#666] tracking-wide">Online</span>
            </span>
          </div>
        </div>
        <button
          @click="handleClose"
          class="text-[#666] hover:text-white p-1.5 transition-colors"
          aria-label="Close chat"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 space-y-4">
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-4 text-center py-10">
          <div class="w-12 h-12 rounded-full bg-[#8D35FF]/15 border border-[#8D35FF]/30 flex items-center justify-center p-2.5">
            <img src="/assets/Vector.svg" alt="SiteSynth" class="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div>
            <p class="text-white font-semibold text-sm mb-1">How can we help?</p>
            <p class="text-[#666] text-xs leading-relaxed">Ask anything about SiteSynth,<br>pricing, or your project.</p>
          </div>
        </div>

        <!-- Messages -->
        <div v-for="msg in messages" :key="msg.id" :class="['flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start']">
          <div v-if="msg.role !== 'user'" class="w-6 h-6 rounded-full bg-[#8D35FF] flex items-center justify-center flex-shrink-0 mt-0.5 p-1">
            <img src="/assets/Vector.svg" alt="SS" class="w-full h-full object-contain brightness-0 invert" />
          </div>

          <div :class="['px-3.5 py-2.5 max-w-[78%] break-words', msg.role === 'user' ? 'bg-[#8D35FF] text-white' : 'bg-[#1e1e1e] text-[#d4d4d4] border border-[#2a2a2a]']">
            <div class="text-sm leading-relaxed" v-html="parseMarkdown(msg.content)"></div>
            <span class="text-[10px] opacity-50 mt-1.5 block">{{ formatTime(msg.created_at) }}</span>
          </div>

          <div v-if="msg.role === 'user'" class="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg class="w-3.5 h-3.5 text-[#888]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex gap-2.5">
          <div class="w-6 h-6 rounded-full bg-[#8D35FF] flex items-center justify-center flex-shrink-0 mt-0.5 p-1">
            <img src="/assets/Vector.svg" alt="SS" class="w-full h-full object-contain brightness-0 invert" />
          </div>
          <div class="bg-[#1e1e1e] px-3.5 py-3 border border-[#2a2a2a]">
            <div class="flex gap-1 items-center">
              <div class="w-1.5 h-1.5 bg-[#8D35FF] rounded-full animate-bounce"></div>
              <div class="w-1.5 h-1.5 bg-[#8D35FF] rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div class="w-1.5 h-1.5 bg-[#8D35FF] rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="p-3 bg-red-900/20 text-red-400 border border-red-800/40 text-xs">
          {{ error }}
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-[#222] p-4 bg-[#0d0d0d]">
        <div class="flex gap-2">
          <input
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-3.5 py-2.5 bg-[#1a1a1a] text-white border border-[#2a2a2a] focus:outline-none focus:border-[#8D35FF] placeholder-[#555] text-sm transition-colors"
            :disabled="loading"
          />
          <button
            @click="sendMessage"
            :disabled="loading || !messageInput.trim()"
            class="px-5 py-2.5 bg-[#8D35FF] text-white text-sm font-semibold hover:bg-[#7B2EF0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useChatDrawer } from '@/composables/useChatDrawer'
import { useAnonymousChat } from '@/composables/useAnonymousChat'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

const props = defineProps({
  agentType: {
    type: String,
    default: 'presale'
  },
  userEmail: {
    type: String,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  },
  briefContext: {
    type: Object as () => { id: string; name: string; content: string; files?: string[]; fileIds?: string[] } | null,
    default: null
  }
})

const emit = defineEmits(['update:isOpen'])
const { setBriefDraft, requestBriefDraftApply } = useChatDrawer()
const { deviceId, setConversationId, setClaimToken } = useAnonymousChat()

const messages = ref<Message[]>([])
const messageInput = ref('')
const loading = ref(false)
const error = ref('')
const messagesContainer = ref<HTMLElement>()
const selectedConversationId = ref<string | null>(null)

const agentLabel = computed(() => {
  if (props.agentType === 'post-brief') return 'Design Strategist'
  if (props.agentType === 'briefing') return 'Briefing Assistant'
  return 'AI Consultant'
})

// Determine authentication status and get headers for API calls
const getAuthHeaders = () => {
  if (props.userEmail) {
    // Authenticated user: pass email
    return { 'x-user-email': props.userEmail }
  } else {
    // Anonymous user: pass device_id
    return { 'x-device-id': deviceId }
  }
}

// Parse markdown to HTML (simple version without external deps)
const parseMarkdown = (text: string): string => {
  let html = text
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  // Code blocks (```code```)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  
  // Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#333] px-1 py-0.5 rounded">$1</code>')
  
  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
  
  // Lists - preserve * at start of line (don't convert to italic)
  // This must come BEFORE italic parsing
  html = html.replace(/^\* (.*?)$/gm, '• $1')
  
  // Italic (*text*) - but NOT at start of line (that's a list marker)
  // Only match if surrounded by non-whitespace
  html = html.replace(/([^\n*])\*([^\s*][^\*]*?[^\s*])\*([^\n*])/g, '$1<em class="italic">$2</em>$3')
  
  // Links [text](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 underline" target="_blank">$1</a>')
  
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-2">$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-3">$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-4">$1</h1>')
  
  // Line breaks (handle \n properly)
  html = html.replace(/\n/g, '<br>')
  
  return html
}

// Format time
const formatTime = (isoString: string): string => {
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Handle close
const handleClose = () => {
  emit('update:isOpen', false)
}

// Scroll to bottom
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, scrollToBottom, { deep: true })

// Load or create conversation on mount
const initializeConversation = async () => {
  try {
    const authHeaders = getAuthHeaders()
    const isAuthenticated = !!props.userEmail

    // Post-brief mode: reuse the brief's own conversation_id directly
    if (props.agentType === 'post-brief' && props.briefContext?.conversationId) {
      selectedConversationId.value = props.briefContext.conversationId
      await loadConversationMessages(props.briefContext.conversationId)
      return
    }

    // For authenticated users, try to get existing conversations
    if (isAuthenticated) {
      const getResponse = await fetch(`/api/chat/conversations?agentType=${props.agentType}`, {
        method: 'GET',
        headers: authHeaders
      })

      if (getResponse.ok) {
        const getResult = await getResponse.json()
        const conversations = getResult.data || []

        if (conversations.length > 0) {
          // Use the most recent conversation
          const conversation = conversations[0]
          selectedConversationId.value = conversation.id
          console.log('Loaded existing conversation:', conversation.id)

          // Load messages for this conversation
          await loadConversationMessages(conversation.id)
          return
        }
      }
    }

    // Create a new conversation (anonymous or authenticated)
    const createResponse = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        title: `${props.agentType === 'briefing' ? 'Briefing' : 'Consultation'} - ${new Date().toLocaleDateString()}`,
        agentType: props.agentType
      })
    })

    if (createResponse.ok) {
      const data = await createResponse.json()
      const conversationId = data.data?.id || data.conversation?.id
      selectedConversationId.value = conversationId

      console.log('Created new conversation:', conversationId)

      // ✅ For anonymous users: store conversation_id and claim_token in localStorage
      if (!isAuthenticated && conversationId) {
        setConversationId(conversationId)
        if (data.data?.claim_token || data.claim_token) {
          const claimToken = data.data?.claim_token || data.claim_token
          setClaimToken(claimToken)
          console.log('[AIChatDrawer] Stored claim_token for future registration')
        }
      }

      // Persist presale conversation_id so payment page can claim it after registration
      if (props.agentType === 'presale' && conversationId) {
        try { localStorage.setItem('presale_conversation_id', conversationId) } catch {}
      }
    } else {
      console.error('Failed to create conversation:', createResponse.status, createResponse.statusText)
      error.value = `Chat initialization failed: ${createResponse.status}`
    }
  } catch (err) {
    console.error('Failed to initialize conversation:', err)
    error.value = 'Failed to initialize chat'
  }
}

// Load messages for a specific conversation
const loadConversationMessages = async (conversationId: string) => {
  try {
    const authHeaders = getAuthHeaders()
    const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`, {
      method: 'GET',
      headers: authHeaders
    })

    if (response.ok) {
      const data = await response.json()
      messages.value = data.messages || data.data || []
      console.log('Loaded messages:', messages.value.length)
    }
  } catch (err) {
    console.error('Failed to load messages:', err)
  }
}

// Send proactive greeting from AI after brief is created
const sendProactiveGreeting = async () => {
  if (!selectedConversationId.value || !props.briefContext) return
  loading.value = true
  error.value = ''

  try {
    const authHeaders = getAuthHeaders()
    const brief = props.briefContext

    // Short trigger — server builds the real system prompt with brief context
    const triggerPrompt = `Brief "${brief.name}" has been created. Please introduce yourself and guide the user proactively.`

    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({
        conversation_id: selectedConversationId.value,
        message: triggerPrompt,
        history: [],
        agent_type: 'post-brief',
        hidden_trigger: true,       // don't save trigger as user message
        briefContext: props.briefContext  // pass brief for server-side system prompt
      })
    })

    const data = await response.json()
    if (response.ok && data.messages) {
      // Only keep AI response messages (skip the hidden trigger)
      messages.value = data.messages.filter((m: Message) => m.role === 'assistant')
      await scrollToBottom()
    }
  } catch (err) {
    console.error('Failed to send proactive greeting:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Initialize when component mounts and drawer is already open
  if (props.isOpen) {
    await initializeConversation()
    if (props.agentType === 'post-brief' && props.briefContext) {
      await sendProactiveGreeting()
    }
  }
})

// Initialize conversation when drawer opens
watch(() => props.isOpen, async (newVal) => {
  if (!newVal) return
  // If post-brief with a known conversation — just load messages, don't create new
  if (props.agentType === 'post-brief' && props.briefContext?.conversationId) {
    selectedConversationId.value = props.briefContext.conversationId
    await loadConversationMessages(props.briefContext.conversationId)
    if (messages.value.length === 0) {
      await sendProactiveGreeting()
    }
  } else if (!selectedConversationId.value) {
    await initializeConversation()
  }
})

// When switching to post-brief mode — reuse brief's conversation (same lifecycle thread)
watch(() => props.agentType, async (newVal, oldVal) => {
  if (newVal !== oldVal && props.isOpen) {
    if (newVal === 'post-brief' && props.briefContext?.conversationId) {
      // Use the brief's conversation_id — this is the SAME conversation from presale
      selectedConversationId.value = props.briefContext.conversationId
      await loadConversationMessages(props.briefContext.conversationId)
      // Only greet if no AI messages exist yet in this conversation for post-brief
      const hasPostBriefMessages = messages.value.some((m: Message) => m.role === 'assistant' && m.content?.includes('brief'))
      if (!hasPostBriefMessages) {
        await sendProactiveGreeting()
      }
    } else {
      // For other mode switches, reinitialize normally
      await initializeConversation()
    }
  }
})

const sendMessage = async () => {
  if (!messageInput.value.trim() || !selectedConversationId.value) return

  const content = messageInput.value
  messageInput.value = ''
  loading.value = true
  error.value = ''

  try {
    const authHeaders = getAuthHeaders()

    // Add user message to local state
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: content,
      created_at: new Date().toISOString()
    }
    messages.value.push(userMessage)
    await scrollToBottom()

    // Send message with full conversation history
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        conversation_id: selectedConversationId.value,
        message: content,
        history: messages.value.filter(m => m.id !== userMessage.id),
        agent_type: props.agentType
      })
    })

    const data = await response.json()
    
    if (response.ok && data.messages) {
      messages.value = data.messages
      await scrollToBottom()
      if (data.briefDraft && props.briefContext?.id) {
        const draftPayload = { briefId: props.briefContext.id, markdown: data.briefDraft }
        console.log('[AIChatDrawer Draft Debug] briefDraft received', {
          briefId: draftPayload.briefId,
          agentType: props.agentType,
          conversationId: selectedConversationId.value,
          length: data.briefDraft.length,
        })
        setBriefDraft(draftPayload)
        requestBriefDraftApply(draftPayload)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sitesynth:brief-draft-ready', { detail: draftPayload }))
        }
      } else {
        console.log('[AIChatDrawer Draft Debug] no briefDraft in response', {
          hasBriefDraft: Boolean(data.briefDraft),
          hasBriefContextId: Boolean(props.briefContext?.id),
          agentType: props.agentType,
        })
      }
    } else {
      error.value = data.error || 'Failed to send message'
      // Remove temporary user message on error
      messages.value = messages.value.filter(m => m.id !== userMessage.id)
    }
  } catch (err) {
    console.error('Error sending message:', err)
    error.value = 'Failed to send message'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.chat-widget,
.chat-widget input,
.chat-widget button,
.chat-widget h3,
.chat-widget p,
.chat-widget span {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.slide-in-right-enter-active,
.slide-in-right-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-in-right-enter-from {
  transform: translateX(100%);
}

.slide-in-right-leave-to {
  transform: translateX(100%);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Markdown styles inside chat — :deep() needed for v-html content */
:deep(.prose-chat *) { color: #f9fafb; }
:deep(.prose-chat p) { margin: 0 0 0.5rem 0; }
:deep(.prose-chat p:last-child) { margin-bottom: 0; }
:deep(.prose-chat strong) { font-weight: 600; color: #ffffff; }
:deep(.prose-chat em) { font-style: italic; }
:deep(.prose-chat ul) { list-style: disc; padding-left: 1.25rem; margin: 0.25rem 0; }
:deep(.prose-chat ol) { list-style: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
:deep(.prose-chat li) { margin: 0.15rem 0; }
:deep(.prose-chat code) { background: rgba(0,0,0,0.3); border-radius: 3px; padding: 0.1rem 0.3rem; font-size: 0.8em; font-family: monospace; }
:deep(.prose-chat pre) { background: rgba(0,0,0,0.4); border-radius: 6px; padding: 0.75rem; margin: 0.5rem 0; overflow-x: auto; }
:deep(.prose-chat pre code) { background: none; padding: 0; }
:deep(.prose-chat h1), :deep(.prose-chat h2), :deep(.prose-chat h3) { font-weight: 700; margin: 0.5rem 0 0.25rem; color: #ffffff; }
</style>
