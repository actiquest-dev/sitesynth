<template>
  <Transition name="slide-in-right">
    <div
      v-if="isOpen"
      class="chat-widget fixed right-0 top-0 h-screen w-full max-w-md border-l border-gray-700 shadow-2xl z-50 flex flex-col bg-[#1a1a1a]"
    >
      <!-- Header -->
      <div class="bg-[#0033ff] p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <h3 class="text-white font-semibold">{{ agentLabel }}</h3>
            <p class="text-xs text-blue-200">Powered by Gemini</p>
          </div>
        </div>
        <button
          @click="handleClose"
          class="text-white hover:bg-blue-700 p-2 rounded transition-colors"
          aria-label="Close chat"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="text-sm space-y-4">
            <p class="text-lg font-semibold text-[#d4d4d4]">👋 Welcome!</p>
            <p class="text-[#999999]">Start a conversation with our AI.</p>
          </div>
        </div>

        <!-- Messages -->
        <div v-for="msg in messages" :key="msg.id" :class="['flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start']">
          <div v-if="msg.role !== 'user'" class="w-8 h-8 rounded-full bg-[#0033ff] flex items-center justify-center flex-shrink-0 text-sm">
            🤖
          </div>

          <div :class="['px-4 py-2 rounded-lg max-w-xs break-words', msg.role === 'user' ? 'bg-[#0033ff] text-white' : 'bg-[#2a2a2a] text-[#d4d4d4] border border-[#636363]']">
            <p class="text-sm">{{ msg.content }}</p>
            <span class="text-xs text-opacity-70 opacity-70 mt-1 block">{{ formatTime(msg.created_at) }}</span>
          </div>

          <div v-if="msg.role === 'user'" class="w-8 h-8 rounded-full bg-[#636363] flex items-center justify-center flex-shrink-0 text-sm">
            👤
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-[#0033ff] flex items-center justify-center text-sm">🤖</div>
          <div class="bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#636363]">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-[#0033ff] rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-[#0033ff] rounded-full animate-bounce delay-100"></div>
              <div class="w-2 h-2 bg-[#0033ff] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mx-0 p-3 bg-red-900/30 text-red-400 border border-red-600/50 rounded-lg text-sm">
          {{ error }}
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-[#636363] p-4 bg-[#0f0f0f]">
        <div class="flex gap-2">
          <input
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-[#636363] focus:outline-none focus:border-[#0033ff] placeholder-[#888] text-sm"
            :disabled="loading"
          />
          <button
            @click="sendMessage"
            :disabled="loading || !messageInput.trim()"
            class="px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

const props = defineProps({
  agentType: {
    type: String,
    default: 'presale' // 'briefing' or 'presale'
  },
  userEmail: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = defineModel<boolean>('modelValue', { default: false })

const messages = ref<Message[]>([])
const messageInput = ref('')
const loading = ref(false)
const error = ref('')
const messagesContainer = ref<HTMLElement>()
const selectedConversationId = ref<string | null>(null)

const agentLabel = computed(() => props.agentType === 'briefing' ? '🤖 Briefing Assistant' : '💬 AI Consultant')

// Get user email for API calls
const getUserEmail = () => props.userEmail || localStorage.getItem('user_email') || 'anonymous'

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
  isOpen.value = false
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
    const email = getUserEmail()
    
    // First, try to get existing conversations
    const getResponse = await fetch(`/api/chat/conversations?agentType=${props.agentType}`, {
      method: 'GET',
      headers: {
        'x-user-email': email
      }
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
    
    // No existing conversations, create a new one
    const createResponse = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': email
      },
      body: JSON.stringify({
        title: `${props.agentType === 'briefing' ? 'Briefing' : 'Consultation'} - ${new Date().toLocaleDateString()}`,
        user_email: email,
        agent_type: props.agentType
      })
    })

    if (createResponse.ok) {
      const data = await createResponse.json()
      selectedConversationId.value = data.data?.id || data.conversation?.id
      console.log('Created new conversation:', selectedConversationId.value)
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
    const email = getUserEmail()
    const response = await fetch(`/api/chat/messages?conversation_id=${conversationId}`, {
      method: 'GET',
      headers: {
        'x-user-email': email
      }
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

onMounted(async () => {
  // Initialize when component mounts and drawer is already open
  if (isOpen.value) {
    await initializeConversation()
  }
})

// Initialize conversation when drawer opens
watch(isOpen, async (newVal) => {
  if (newVal && !selectedConversationId.value) {
    await initializeConversation()
  }
})

const sendMessage = async () => {
  if (!messageInput.value.trim() || !selectedConversationId.value) return

  const content = messageInput.value
  messageInput.value = ''
  loading.value = true
  error.value = ''

  try {
    const email = getUserEmail()
    
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
        'x-user-email': email
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
