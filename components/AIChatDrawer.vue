<template>
  <Transition name="slide-in-right">
    <div
      v-if="isOpen"
      class="fixed right-0 top-0 h-screen w-full max-w-md bg-[#1a1a1a] border-l border-gray-700 shadow-2xl z-50 flex flex-col"
    >
      <!-- Header -->
      <div class="bg-[#0033ff] p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-white flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-[#0033ff]"
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
            <p class="text-blue-100 text-xs">Always here to help</p>
          </div>
        </div>
        <button
          @click="closeChat"
          class="text-white hover:bg-blue-700 p-2 rounded transition-colors"
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
        class="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1a1a1a]"
      >
        <!-- Welcome message if no messages -->
        <div v-if="messages.length === 0" class="text-center py-8">
          <div class="text-gray-400 text-sm space-y-4">
            <div>
              <p class="text-lg font-semibold text-white mb-2">👋 Welcome!</p>
              <p>Start a conversation with our AI assistant.</p>
            </div>
            <div class="text-xs text-gray-500">
              <p>Ask us about:</p>
              <p>• Our services & expertise</p>
              <p>• Project requirements</p>
              <p>• Pricing & timelines</p>
              <p>• Design & development</p>
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
            <div class="max-w-xs bg-[#0033ff] text-white rounded-lg rounded-tr-none p-3">
              <p class="text-sm">{{ message.content }}</p>
              <span class="text-xs text-blue-100 mt-1 block">
                {{ formatTime(message.timestamp) }}
              </span>
            </div>
          </div>

          <!-- Assistant Message -->
          <div v-else class="flex justify-start">
            <div class="max-w-xs bg-gray-700 text-gray-100 rounded-lg rounded-tl-none p-3">
              <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
              <span class="text-xs text-gray-400 mt-1 block">
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
            class="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0033ff] text-sm"
            :disabled="isLoading"
          />
          <button
            type="submit"
            :disabled="isLoading || !inputMessage.trim()"
            class="bg-[#0033ff] text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

const { isOpen, messages, isLoading, error, sendMessage, closeChat } = useAIChat()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement>()

// Auto-scroll to bottom when messages change
watch(messages, async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}, { deep: true })

// Auto-scroll when chat opens
watch(isOpen, async (newVal) => {
  if (newVal) {
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
</style>
