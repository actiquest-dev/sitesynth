<template>
  <Teleport to="body" v-if="isOpen">
    <div class="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center">
      <div class="bg-[#161616] border border-[#333] w-full max-w-4xl mx-4 rounded-none flex flex-col" style="max-height: 90vh">
        <!-- Header -->
        <div class="bg-[#161616] border-b border-[#333] p-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 class="text-xl font-semibold text-white">{{ brief?.name || 'Untitled Brief' }}</h2>
            <p class="text-[#666] text-sm mt-1">Edit and refine with AI assistance</p>
          </div>
          <button @click="$emit('close')" class="text-[#666] hover:text-white text-xl">✕</button>
        </div>

        <!-- Content: Brief Display & Chat -->
        <div class="flex flex-1 overflow-hidden">
          <!-- Left: Brief Content -->
          <div class="flex-1 border-r border-[#333] overflow-y-auto p-6 space-y-4">
            <div v-if="editMode" class="space-y-4">
              <h3 class="text-white font-semibold">Edit Brief Content</h3>
              <textarea
                v-model="editedContent"
                rows="20"
                class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition resize-none"
              ></textarea>
              <div class="flex gap-2">
                <button
                  @click="saveBriefEdit"
                  :disabled="isSaving"
                  class="px-6 py-2 bg-green-600 text-white rounded-none hover:bg-green-700 transition disabled:opacity-50"
                >
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  @click="editMode = false"
                  class="px-6 py-2 border border-[#333] text-[#999] rounded-none hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div v-else class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-white font-semibold">Brief Content</h3>
                <button
                  @click="editMode = true"
                  class="px-4 py-2 border border-[#8D35FF] text-[#8D35FF] rounded-none hover:bg-[#8D35FF]/10 transition text-sm"
                >
                  ✎ Edit
                </button>
              </div>
              <div class="bg-[#0f0f0f] border border-[#333] rounded-none p-6 text-white text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto" v-html="formatBrief(brief?.content || '')"></div>
            </div>
          </div>

          <!-- Right: AI Chat for Refinement -->
          <div class="w-96 border-l border-[#333] flex flex-col bg-[#0f0f0f]">
            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto p-4 space-y-3" ref="chatContainer">
              <div v-if="chatMessages.length === 0" class="text-center py-8">
                <p class="text-[#666] text-sm">Ask the AI to refine your brief</p>
                <p class="text-[#555] text-xs mt-2">Examples:<br/>• Make section X more detailed<br/>• Change tone to be more X<br/>• Add information about Y</p>
              </div>
              <div v-for="msg in chatMessages" :key="msg.id" :class="[
                'p-3 rounded-none',
                msg.role === 'assistant' ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-[#8D35FF]/20 border border-[#8D35FF]/30'
              ]">
                <p :class="msg.role === 'assistant' ? 'text-[#999]' : 'text-[#8D35FF]'" class="text-xs font-semibold mb-1">
                  {{ msg.role === 'assistant' ? '🤖 AI' : '👤 You' }}
                </p>
                <p class="text-white text-sm">{{ msg.content }}</p>
              </div>
              <div v-if="isRefining" class="flex items-center gap-2 text-[#666] text-sm">
                <div class="w-2 h-2 bg-[#8D35FF] rounded-full animate-pulse"></div>
                AI is thinking...
              </div>
            </div>

            <!-- Chat Input -->
            <div class="border-t border-[#333] p-4 space-y-3">
              <textarea
                v-model="userQuestion"
                @keydown.ctrl.enter="sendRefinement"
                placeholder="Ask AI to improve sections..."
                rows="3"
                class="w-full px-3 py-2 bg-[#161616] border border-[#333] rounded-none text-white placeholder-[#666] focus:border-[#8D35FF] focus:outline-none transition resize-none text-sm"
              ></textarea>
              <button
                @click="sendRefinement"
                :disabled="!userQuestion.trim() || isRefining"
                class="w-full px-4 py-2 bg-[#8D35FF] text-white rounded-none hover:bg-[#7B2AE8] transition disabled:opacity-50 text-sm"
              >
                {{ isRefining ? 'Refining...' : 'Ask AI (Ctrl+Enter)' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  brief: any
  userEmail: string
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const editMode = ref(false)
const editedContent = ref('')
const isSaving = ref(false)
const isRefining = ref(false)
const userQuestion = ref('')
const chatMessages = ref<Array<{ id: string; role: string; content: string }>>([])
const chatContainer = ref<HTMLElement | null>(null)
const refinementConversationId = ref<string | null>(null)

const formatBrief = (content: string): string => {
  if (!content) return ''
  return content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-[#8D35FF] mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/^- (.+)$/gm, '<li class="text-[#ccc] ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
}

const saveBriefEdit = async () => {
  if (!props.brief?.id) return
  isSaving.value = true
  try {
    const response = await fetch(`/api/briefs/${props.brief.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-email': props.userEmail,
      },
      body: JSON.stringify({
        content: editedContent.value,
      }),
    })

    if (!response.ok) throw new Error('Failed to save brief')
    editMode.value = false
    emit('saved')
  } catch (error) {
    console.error('[Brief] Error saving:', error)
    alert('Failed to save brief. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const { deviceId } = useAnonymousChat()

const buildChatHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (props.userEmail) headers['x-user-email'] = props.userEmail
  if (deviceId) headers['x-device-id'] = deviceId
  return headers
}

const sendRefinement = async () => {
  if (!userQuestion.value.trim() || !props.brief?.id || isRefining.value) return

  const question = userQuestion.value
  userQuestion.value = ''
  isRefining.value = true

  // Add user message to chat
  chatMessages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: question,
  })

  try {
    // Create conversation for brief refinement if needed
    if (!refinementConversationId.value) {
      const convResponse = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: buildChatHeaders(),
        body: JSON.stringify({
          title: `Brief Refinement - ${props.brief.name}`,
          agentType: 'briefing',
          stage: 'brief-refinement',
        }),
      })

      if (convResponse.ok) {
        const convData = await convResponse.json()
        refinementConversationId.value = convData.data?.id
      }
    }

    // Send message to AI agent
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: buildChatHeaders(),
      body: JSON.stringify({
        conversation_id: refinementConversationId.value,
        message: question,
        agent_type: 'briefing',
        stage: 'brief-refinement',
        briefContext: props.brief.content,
      }),
    })

    const data = await response.json()

    if (data.data?.response) {
      chatMessages.value.push({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.data.response,
      })
    }
  } catch (error) {
    console.error('[Brief] Error refining:', error)
    chatMessages.value.push({
      id: `error-${Date.now()}`,
      role: 'assistant',
      content: 'Sorry, I had trouble processing that. Please try again.',
    })
  } finally {
    isRefining.value = false
    await nextTick()
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  }
}

onMounted(() => {
  if (props.isOpen && props.brief?.content) {
    editedContent.value = props.brief.content
  }
})
</script>
