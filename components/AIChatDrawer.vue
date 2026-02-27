<template>
  <Transition name="slide-in-right">
    <div
      v-if="isOpen"
      class="chat-widget fixed right-0 top-0 h-screen w-full max-w-md border-l border-gray-700 shadow-2xl z-50 flex flex-col"
      style="background: linear-gradient(160deg, #2d1050 0%, #1a1a1a 45%)"
    >
      <!-- Header -->
      <div class="bg-[#8D35FF] p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-white flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-[#8D35FF]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5m-15-4h12m-12 3h12m-12 3h6"
              />
            </svg>
          </div>
          <div>
            <h3 class="text-white font-semibold">SiteSynth AI</h3>
            <p class="text-xs" style="color: #ffffff !important">Always here to help</p>
          </div>
        </div>
        <button
          @click="closeChat"
          class="text-white hover:bg-purple-700 p-2 rounded transition-colors"
          aria-label="Close chat"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Messages Area -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <!-- Welcome message if no messages -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="text-sm space-y-4">
            <div>
              <p class="text-lg font-semibold mb-2" style="color: #d0d0d0 !important">👋 Welcome!</p>
              <p style="color: #d0d0d0 !important">Start a conversation with our AI assistant.</p>
            </div>
            <div class="text-xs">
              <p style="color: #d0d0d0 !important">Ask us about:</p>
              <p style="color: #d0d0d0 !important">• Our services & expertise</p>
              <p style="color: #d0d0d0 !important">• Project requirements</p>
              <p style="color: #d0d0d0 !important">• Pricing & timelines</p>
              <p style="color: #d0d0d0 !important">• Design & development</p>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <template v-for="(message, index) in messages" :key="message.id">
          <!-- User Message -->
          <div
            v-if="message.role === 'user'"
            class="flex justify-end"
          >
            <div class="max-w-xs bg-[#8D35FF] rounded-lg rounded-tr-none p-3">
              <p class="text-sm" style="color: #f9fafb !important">{{ message.content }}</p>
              <span class="text-xs mt-1 block" style="color: #d0d0d0">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>

          <!-- Assistant Message -->
          <div v-else class="flex justify-start">
            <div class="max-w-xs bg-gray-700 rounded-lg rounded-tl-none p-3">
              <div class="text-sm prose-chat" style="color: #f9fafb !important" v-html="renderMarkdown(message.content)"></div>
              <span class="text-xs mt-1 block" style="color: #d0d0d0">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>
        </template>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-start">
          <div class="bg-gray-700 rounded-lg rounded-tl-none p-3">
            <div class="flex gap-1">
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0ms"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 150ms"
              ></div>
              <div
                class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 300ms"
              ></div>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="flex justify-start">
          <div class="max-w-xs bg-red-900/30 border border-red-700 text-red-200 rounded-lg rounded-tl-none p-3">
            <p class="text-sm">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-gray-700 p-4 bg-[#0f0f0f]">
        <form @submit.prevent="handleSendMessage" class="flex gap-2">
          <input
            v-model="inputMessage"
            type="text"
            placeholder="Type your message..."
            class="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8D35FF] text-sm"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="isLoading || !inputMessage.trim()"
            class="bg-[#8D35FF] text-white rounded-lg px-4 py-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useAIChat } from '@/composables/useAIChat'

const renderMarkdown = (text: string): string => {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^[-•] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>')
}

const { isOpen, messages, isLoading, error, sendMessage, closeChat, initializeChat } = useAIChat()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

// Auto-scroll to bottom when messages change
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

// Auto-scroll when chat opens and load chat history
watch(isOpen, async (newVal) => {
  if (newVal) {
    // Load previous chat messages on first open
    await initializeChat()
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
})

const handleSendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message) return

  inputMessage.value = ''
  await sendMessage(message)
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
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
