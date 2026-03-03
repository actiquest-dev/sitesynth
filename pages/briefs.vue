<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />
    <ParticleEffect />

    <!-- Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div
        class="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <ClientOnly>
      <div class="relative max-w-6xl w-full mx-auto px-6 md:px-12">
        <!-- Navigation Tabs -->
        <div class="flex items-center gap-6 mb-12 pb-6 border-b border-[#333]">
          <NuxtLink
            to="/cabinet"
            class="text-[#999999] hover:text-white transition font-semibold"
          >
            ← Back to Cabinet
          </NuxtLink>
        </div>

        <!-- Header -->
        <div class="mb-12">
          <h1 class="text-5xl font-bold text-white mb-2">Project Briefs</h1>
          <p class="text-xl text-[#999999]">
            Create and manage project briefs from your conversations
          </p>
        </div>

        <!-- Action Bar -->
        <div class="flex items-center gap-4 mb-8">
          <select
            v-model="filterAgent"
            class="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:border-[#0033ff] transition"
          >
            <option value="">All Agent Types</option>
            <option value="briefing">Briefing</option>
            <option value="presale">Presale</option>
          </select>

          <button
            @click="showGenerateModal = true"
            class="ml-auto px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+</span> Generate from Conversation
          </button>
        </div>

        <!-- Briefs List -->
        <div v-if="filteredBriefs.length === 0" class="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
          <p class="text-[#999999] mb-6">No briefs yet</p>
          <button
            @click="showGenerateModal = true"
            class="px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Your First Brief
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="brief in filteredBriefs"
            :key="brief.id"
            @click="selectedBrief = brief"
            class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 cursor-pointer hover:border-[#0033ff] transition"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-xl font-bold text-white mb-2">
                  {{ brief.brief_data?.projectName || 'Untitled Brief' }}
                </h3>
                <p class="text-[#999999] text-sm mb-4">
                  {{ brief.brief_data?.companyIntroduction?.mission || 'No description' }}
                </p>
                <div class="flex items-center gap-4 text-xs text-[#777]">
                  <span class="px-2 py-1 bg-[#333] rounded">{{ brief.agent_type }}</span>
                  <span>{{ formatDate(brief.created_at) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-3 ml-4">
                <button
                  @click.stop="downloadBrief(brief)"
                  class="p-2 bg-[#333] hover:bg-[#444] rounded-lg transition"
                  title="Download as PDF"
                >
                  📥
                </button>
                <button
                  @click.stop="deleteBrief(brief)"
                  class="p-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Brief Editor Modal -->
    <div
      v-if="selectedBrief"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="selectedBrief = null"
    >
      <div
        class="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="sticky top-0 bg-[#1a1a1a] border-b border-[#333] p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">{{ selectedBrief.brief_data?.projectName }}</h2>
          <button
            @click="selectedBrief = null"
            class="text-[#999999] hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <!-- Modal Content: Tabs -->
        <div class="p-6">
          <div class="flex gap-4 mb-8 border-b border-[#333] pb-4">
            <button
              v-for="tab in briefTabs"
              :key="tab"
              @click="activeBriefTab = tab"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition',
                activeBriefTab === tab
                  ? 'bg-[#0033ff] text-white'
                  : 'text-[#999999] hover:text-white'
              ]"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Tab Content: View -->
          <div v-if="activeBriefTab === 'View'" class="space-y-8">
            <!-- Company Introduction -->
            <div v-if="selectedBrief.brief_data?.companyIntroduction">
              <h3 class="text-xl font-bold text-white mb-4">🏢 Company Introduction</h3>
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 space-y-4">
                <div>
                  <p class="text-[#999999] text-sm">Organization</p>
                  <p class="text-white font-semibold">{{ selectedBrief.brief_data.companyIntroduction.companyName }}</p>
                </div>
                <div>
                  <p class="text-[#999999] text-sm">Mission</p>
                  <p class="text-white">{{ selectedBrief.brief_data.companyIntroduction.mission }}</p>
                </div>
              </div>
            </div>

            <!-- Scope & Acceptance -->
            <div v-if="selectedBrief.brief_data?.scopeAndAcceptanceCriteria">
              <h3 class="text-xl font-bold text-white mb-4">✅ Scope & Acceptance Criteria</h3>
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 space-y-4">
                <div>
                  <p class="text-[#999999] text-sm">Main Objective</p>
                  <p class="text-white">{{ selectedBrief.brief_data.scopeAndAcceptanceCriteria.mainObjective }}</p>
                </div>
                <div v-if="selectedBrief.brief_data.scopeAndAcceptanceCriteria.deliverables?.length">
                  <p class="text-[#999999] text-sm mb-2">Deliverables</p>
                  <ul class="space-y-1 text-white">
                    <li v-for="d in selectedBrief.brief_data.scopeAndAcceptanceCriteria.deliverables" :key="d">
                      • {{ d }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Goals & Objectives -->
            <div v-if="selectedBrief.brief_data?.goalsAndObjectives">
              <h3 class="text-xl font-bold text-white mb-4">🎯 Goals & Objectives</h3>
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 space-y-4">
                <div v-if="selectedBrief.brief_data.goalsAndObjectives.businessGoals?.length">
                  <p class="text-[#999999] text-sm mb-2">Business Goals</p>
                  <ul class="space-y-1 text-white">
                    <li v-for="g in selectedBrief.brief_data.goalsAndObjectives.businessGoals" :key="g">
                      • {{ g }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Timeline & Budget -->
            <div v-if="selectedBrief.brief_data?.timelineAndBudget">
              <h3 class="text-xl font-bold text-white mb-4">⌛️ Timeline & Budget</h3>
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-[#999999] text-sm">Budget</p>
                    <p class="text-white font-semibold">{{ selectedBrief.brief_data.timelineAndBudget.totalBudget }}</p>
                  </div>
                  <div>
                    <p class="text-[#999999] text-sm">Timeline</p>
                    <p class="text-white font-semibold">
                      {{ selectedBrief.brief_data.timelineAndBudget.startDate }} →
                      {{ selectedBrief.brief_data.timelineAndBudget.deadline }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Content: Edit -->
          <div v-if="activeBriefTab === 'Edit'" class="space-y-6">
            <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <p class="text-blue-200 text-sm">
                ✏️ Edit fields to update your brief. Changes are saved automatically.
              </p>
            </div>

            <div v-if="editableField === 'projectName'" class="space-y-2">
              <label class="text-[#999999] text-sm">Project Name</label>
              <input
                v-model="selectedBrief.brief_data.projectName"
                @blur="saveBriefField('projectName')"
                class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:border-[#0033ff] outline-none"
                placeholder="Enter project name"
              />
            </div>

            <div class="space-y-2">
              <label class="text-[#999999] text-sm">Sections</label>
              <div class="space-y-3">
                <button
                  v-for="field in editableFields"
                  :key="field"
                  @click="editableField = field"
                  :class="[
                    'w-full text-left px-4 py-3 bg-[#0f0f0f] border rounded-lg transition',
                    editableField === field
                      ? 'border-[#0033ff] text-white'
                      : 'border-[#333] text-[#999999] hover:border-[#555]'
                  ]"
                >
                  {{ field }}
                </button>
              </div>
            </div>
          </div>

          <!-- Tab Content: Markdown -->
          <div v-if="activeBriefTab === 'Markdown'" class="space-y-4">
            <div class="relative">
              <pre class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 text-white text-sm max-h-96 overflow-auto">{{ selectedBrief.markdown_content }}</pre>
              <button
                @click="copyToClipboard(selectedBrief.markdown_content)"
                class="absolute top-4 right-4 px-3 py-1 bg-[#333] hover:bg-[#444] rounded text-white text-sm transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-[#1a1a1a] border-t border-[#333] p-6 flex items-center justify-between">
          <button
            @click="selectedBrief = null"
            class="px-6 py-2 text-[#999999] hover:text-white transition"
          >
            Close
          </button>
          <div class="flex gap-3">
            <button
              @click="downloadBrief(selectedBrief)"
              class="px-6 py-2 bg-[#333] hover:bg-[#444] rounded-lg text-white transition"
            >
              📥 Download
            </button>
            <button
              @click="deleteBrief(selectedBrief)"
              class="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-white transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate from Conversation Modal -->
    <div
      v-if="showGenerateModal"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="showGenerateModal = false"
    >
      <div
        class="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-2xl w-full"
        @click.stop
      >
        <div class="border-b border-[#333] p-6 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">Generate Brief from Conversation</h2>
          <button
            @click="showGenerateModal = false"
            class="text-[#999999] hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="text-[#999999] text-sm mb-2 block">Select Conversation</label>
            <select
              v-model="selectedConversationId"
              class="w-full px-4 py-2 bg-[#0f0f0f] border border-[#333] rounded-lg text-white focus:border-[#0033ff] outline-none"
            >
              <option value="">Choose a conversation...</option>
              <option v-for="conv in conversations" :key="conv.id" :value="conv.id">
                {{ conv.title || 'Untitled' }} ({{ formatDate(conv.created_at) }})
              </option>
            </select>
          </div>

          <div v-if="generatingBrief" class="text-center py-8">
            <div class="inline-block animate-spin mr-2">⟳</div>
            <span class="text-[#999999]">Generating brief...</span>
          </div>
        </div>

        <div class="border-t border-[#333] p-6 flex gap-4 justify-end">
          <button
            @click="showGenerateModal = false"
            class="px-6 py-2 text-[#999999] hover:text-white transition"
          >
            Cancel
          </button>
          <button
            @click="generateBriefFromConversation"
            :disabled="!selectedConversationId || generatingBrief"
            class="px-6 py-2 bg-[#0033ff] hover:bg-blue-700 disabled:bg-[#333] text-white rounded-lg transition font-semibold"
          >
            Generate Brief
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import html2pdf from 'html2pdf.js'

const router = useRouter()

// State
const briefs = ref<any[]>([])
const conversations = ref<any[]>([])
const selectedBrief = ref<any>(null)
const filterAgent = ref('')
const showGenerateModal = ref(false)
const selectedConversationId = ref('')
const generatingBrief = ref(false)
const activeBriefTab = ref('View')
const editableField = ref('')

const briefTabs = ['View', 'Edit', 'Markdown']
const editableFields = ['projectName', 'Company Introduction', 'Scope', 'Goals', 'Timeline & Budget']

// Get user email
const { $fetch } = useNuxtApp()
const userEmail = useAuthStore()?.user?.email || localStorage.getItem('user_email') || ''

// Computed
const filteredBriefs = computed(() => {
  return filterAgent.value
    ? briefs.value.filter(b => b.agent_type === filterAgent.value)
    : briefs.value
})

// Methods
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const loadBriefs = async () => {
  try {
    const { data } = await $fetch('/api/briefs', {
      headers: { 'x-user-email': userEmail }
    })
    briefs.value = data || []
  } catch (error) {
    console.error('Error loading briefs:', error)
  }
}

const loadConversations = async () => {
  try {
    const { data } = await $fetch('/api/chat/conversations', {
      headers: { 'x-user-email': userEmail }
    })
    conversations.value = data || []
  } catch (error) {
    console.error('Error loading conversations:', error)
  }
}

const generateBriefFromConversation = async () => {
  if (!selectedConversationId.value) return

  generatingBrief.value = true
  try {
    const response = await $fetch('/api/chat/generate-brief', {
      method: 'POST',
      headers: { 'x-user-email': userEmail },
      body: {
        conversation_id: selectedConversationId.value,
        agent_type: 'briefing'
      }
    })

    if (response.status === 'success') {
      await loadBriefs()
      showGenerateModal.value = false
      selectedConversationId.value = ''
    }
  } catch (error) {
    console.error('Error generating brief:', error)
  } finally {
    generatingBrief.value = false
  }
}

const downloadBrief = async (brief: any) => {
  const projectName = brief.brief_data?.projectName || 'brief'
  
  // Convert markdown to HTML with professional styling
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${projectName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 40px;
            background-color: #fff;
          }
          h1, h2, h3 {
            color: #0033ff;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 32px;
            border-bottom: 3px solid #0033ff;
            padding-bottom: 12px;
          }
          h2 {
            font-size: 24px;
            margin-top: 32px;
          }
          h3 {
            font-size: 18px;
          }
          p {
            margin: 12px 0;
          }
          ul, ol {
            margin: 12px 0;
            padding-left: 24px;
          }
          li {
            margin: 8px 0;
          }
          .section {
            margin-bottom: 32px;
            page-break-inside: avoid;
          }
          .emoji {
            margin-right: 8px;
            font-size: 24px;
          }
          code {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background-color: #f5f5f5;
            padding: 12px;
            border-radius: 4px;
            overflow-x: auto;
          }
          blockquote {
            border-left: 4px solid #0033ff;
            margin: 12px 0;
            padding-left: 12px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          table th {
            background-color: #f5f5f5;
          }
          .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #ddd;
            color: #999;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="content">
          ${convertMarkdownToHtml(brief.markdown_content)}
        </div>
        <div class="footer">
          <p>Generated by SiteSynth on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `
  
  const element = document.createElement('div')
  element.innerHTML = htmlContent
  element.style.display = 'none'
  document.body.appendChild(element)
  
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${projectName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  }
  
  try {
    await html2pdf().set(opt).from(element).save()
  } catch (error) {
    console.error('Error generating PDF:', error)
  } finally {
    document.body.removeChild(element)
  }
}

const convertMarkdownToHtml = (markdown: string): string => {
  let html = markdown
    // Headers
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    // Lists (simple conversion)
    .replace(/^\* (.*?)$/gm, '<li>$1</li>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    // Wrap in paragraphs
    .replace(/^([^<][^<]*)$/gm, '<p>$1</p>')
  
  return `<div class="section">${html}</div>`
}

const saveBriefField = async (field: string) => {
  if (!selectedBrief.value) return

  try {
    await $fetch(`/api/briefs/${selectedBrief.value.id}`, {
      method: 'PATCH',
      headers: { 'x-user-email': userEmail },
      body: {
        brief_data: selectedBrief.value.brief_data
      }
    })
  } catch (error) {
    console.error('Error saving field:', error)
  }
}

const deleteBrief = async (brief: any) => {
  if (!confirm('Are you sure you want to delete this brief?')) return

  try {
    await $fetch(`/api/briefs/${brief.id}`, {
      method: 'DELETE',
      headers: { 'x-user-email': userEmail }
    })

    await loadBriefs()
    selectedBrief.value = null
  } catch (error) {
    console.error('Error deleting brief:', error)
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// Lifecycle
onMounted(() => {
  loadBriefs()
  loadConversations()
})

// Auto-save when closing modal
watch(() => selectedBrief.value, (newVal) => {
  if (!newVal && selectedBrief.value) {
    // Brief was closed, save it
    if (selectedBrief.value.brief_data) {
      saveBriefField('all')
    }
  }
})
</script>
