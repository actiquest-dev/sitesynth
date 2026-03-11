<template>
  <div class="flex h-full bg-[#161616] text-white">
    <!-- Sidebar -->
    <div class="w-64 border-r border-[#333] flex flex-col bg-[#1a1a1a]">
      <!-- New Chat Button -->
      <button
        @click="startNewChat"
        class="m-4 px-4 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <span>➕</span>
        <span>New Chat</span>
      </button>

      <!-- Conversation History -->
      <div class="flex-1 overflow-y-auto space-y-2 px-3 pb-4">
        <div v-if="conversations.length === 0" class="text-[#888] text-sm text-center py-8">
          No conversations yet
        </div>
        <div
          v-for="conv in conversations"
          :key="conv.id"
          @click="selectConversation(conv.id)"
          :class="[
            'p-3 rounded-lg cursor-pointer transition truncate',
            selectedConversationId === conv.id
              ? 'bg-[#0033ff] text-white'
              : 'bg-[#2a2a2a] text-[#d4d4d4] hover:bg-[#3a3a3a]'
          ]"
          :title="conv.title"
        >
          {{ conv.title }}
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4">
        <div v-if="currentMessages.length === 0" class="text-center text-[#888] py-12">
          <p class="mb-2">Start a new conversation or select an existing one</p>
        </div>
        
        <div
          v-for="msg in currentMessages"
          :key="msg.id"
          :class="[
            'flex gap-3 animate-in',
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <!-- Avatar -->
          <div
            v-if="msg.role !== 'user'"
            class="w-8 h-8 rounded-full bg-[#0033ff] flex items-center justify-center flex-shrink-0 text-sm font-bold"
          >
            🤖
          </div>

          <!-- Message Bubble -->
          <div
            :class="[
              'px-4 py-2 rounded-lg max-w-md break-words',
              msg.role === 'user'
                ? 'bg-[#0033ff] text-white'
                : 'bg-[#2a2a2a] text-[#d4d4d4] border border-[#333]'
            ]"
          >
            <p>{{ msg.content }}</p>
            <span class="text-xs text-opacity-70 opacity-70 mt-1 block">
              {{ formatTime(msg.created_at) }}
            </span>
          </div>

          <!-- User Avatar -->
          <div
            v-if="msg.role === 'user'"
            class="w-8 h-8 rounded-full bg-[#636363] flex items-center justify-center flex-shrink-0 text-sm font-bold"
          >
            👤
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="loading" class="flex gap-3">
          <div class="w-8 h-8 rounded-full bg-[#0033ff] flex items-center justify-center text-sm">
            🤖
          </div>
          <div class="bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#333]">
            <div class="flex gap-1">
              <div class="w-2 h-2 bg-[#0033ff] rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-[#0033ff] rounded-full animate-bounce delay-100"></div>
              <div class="w-2 h-2 bg-[#0033ff] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mx-6 mb-4 p-3 bg-red-900/30 text-red-400 border border-red-600/50 rounded-lg text-sm">
        {{ error }}
      </div>

      <!-- Input Area -->
      <div class="border-t border-[#333] p-4 bg-[#1a1a1a]">
        <div class="flex gap-2">
          <input
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-[#333] focus:outline-none focus:border-[#0033ff] placeholder-[#888]"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: string
  title: string
  user_email: string
  agent_type: string
  created_at: string
  updated_at: string
}

const props = defineProps({
  agentType: {
    type: String,
    default: 'briefing' // 'briefing' or 'presale'
  },
  userEmail: {
    type: String,
    default: null
  }
})

const conversations = ref<Conversation[]>([])
const selectedConversationId = ref<string | null>(null)
const messages = ref<Message[]>([])
const messageInput = ref('')
const loading = ref(false)
const error = ref('')

// Computed properties
const currentMessages = computed(() => {
  if (!selectedConversationId.value) return []
  return messages.value.filter(m => m.id.includes(selectedConversationId.value || ''))
})

// Fetch conversations on mount
onMounted(async () => {
  await fetchConversations()
})

// Fetch all conversations for this agent
async function fetchConversations() {
  try {
    const email = props.userEmail || localStorage.getItem('user_email') || 'anonymous'
    const response = await $fetch('/api/chat/conversations', {
      method: 'GET',
      headers: {
        'x-user-email': email
      }
    })
    
    conversations.value = response.conversations || []
    if (conversations.value.length > 0 && !selectedConversationId.value) {
      selectConversation(conversations.value[0].id)
    }
  } catch (err) {
    console.error('Failed to fetch conversations:', err)
    error.value = 'Failed to load conversations'
  }
}

// Select a conversation and load its messages
async function selectConversation(conversationId: string) {
  selectedConversationId.value = conversationId
  await fetchMessages(conversationId)
}

// Fetch messages for a specific conversation
async function fetchMessages(conversationId: string) {
  try {
    const email = props.userEmail || localStorage.getItem('user_email') || 'anonymous'
    const response = await $fetch(`/api/chat/messages`, {
      method: 'GET',
      query: {
        conversation_id: conversationId
      },
      headers: {
        'x-user-email': email
      }
    })
    
    messages.value = response.messages || []
    await nextTick()
    scrollToBottom()
  } catch (err) {
    console.error('Failed to fetch messages:', err)
    error.value = 'Failed to load messages'
  }
}

// Start a new chat
async function startNewChat() {
  const email = props.userEmail || localStorage.getItem('user_email') || 'anonymous'
  
  try {
    const response = await $fetch('/api/chat/conversations', {
      method: 'POST',
      body: {
        title: `Chat - ${new Date().toLocaleDateString()}`,
        user_email: email,
        agent_type: props.agentType
      }
    })
    
    if (response.conversation) {
      conversations.value.push(response.conversation)
      selectConversation(response.conversation.id)
    }
  } catch (err) {
    console.error('Failed to create conversation:', err)
    error.value = 'Failed to create new chat'
  }
}

// Send a message
async function sendMessage() {
  if (!messageInput.value.trim() || !selectedConversationId.value) {
    return
  }

  const content = messageInput.value
  messageInput.value = ''
  loading.value = true
  error.value = ''

  try {
    const email = props.userEmail || localStorage.getItem('user_email') || 'anonymous'
    
    const response = await $fetch('/api/chat/messages', {
      method: 'POST',
      body: {
        conversation_id: selectedConversationId.value,
        content,
        role: 'user',
        agent_type: props.agentType
      },
      headers: {
        'x-user-email': email
      }
    })

    if (response.messages) {
      messages.value = response.messages
      await nextTick()
      scrollToBottom()
    }
  } catch (err) {
    console.error('Failed to send message:', err)
    error.value = 'Failed to send message. Try again.'
    messageInput.value = content // Restore input on error
  } finally {
    loading.value = false
  }
}

// Format timestamp
function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// Scroll to bottom of messages
function scrollToBottom() {
  const container = document.querySelector('[role="main"]')
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 100)
  }
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: slideIn 0.3s ease-out;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1.4s infinite;
}
</style>
