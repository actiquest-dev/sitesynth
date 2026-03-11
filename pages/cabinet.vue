<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />
    <ParticleEffect />

    <!-- Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div class="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl transform -translate-x-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
    </div>

    <ClientOnly>
      <div class="relative max-w-6xl w-full mx-auto px-6 md:px-12">
        <!-- Header with Welcome and Logout -->
        <div class="flex items-center justify-between mb-12">
          <div>
            <h1 class="text-5xl font-bold text-white mb-2">Your Cabinet</h1>
            <p class="text-xl text-[#999999]">
              Welcome back, <span class="text-white font-semibold">{{ userEmail }}</span>
            </p>
          </div>
          <button
            @click="handleLogout"
            class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
          >
            Sign Out
          </button>
        </div>

        <!-- TAB NAVIGATION -->
        <div class="flex items-center gap-2 mb-12 pb-6 border-b border-[#333] overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-[#0033ff] text-white'
                : 'text-[#999999] hover:text-white border border-transparent hover:border-[#333]'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- TAB: DASHBOARD -->
        <div v-if="activeTab === 'dashboard'" class="space-y-8">
          <!-- Quick Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 hover:border-[#0033ff] transition">
              <p class="text-[#999999] text-sm mb-2">Total Briefs</p>
              <p class="text-4xl font-bold text-white">{{ totalBriefs }}</p>
              <p class="text-[#999999] text-xs mt-2">{{ activeBriefs }} in progress</p>
            </div>

            <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 hover:border-[#0033ff] transition">
              <p class="text-[#999999] text-sm mb-2">Files Uploaded</p>
              <p class="text-4xl font-bold text-white">{{ userFiles.length }}</p>
              <p class="text-[#999999] text-xs mt-2">{{ totalFileSize }}</p>
            </div>

            <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 hover:border-[#0033ff] transition">
              <p class="text-[#999999] text-sm mb-2">Active Projects</p>
              <p class="text-4xl font-bold text-[#0033ff]">{{ stats.activeWebsites }}</p>
              <p class="text-[#999999] text-xs mt-2">{{ stats.totalProjects }} total</p>
            </div>
          </div>

          <!-- Primary Action: Create New Brief -->
          <div class="bg-gradient-to-r from-[#0033ff]/20 to-[#8D35FF]/20 border border-[#333] rounded-lg p-12 text-center">
            <h2 class="text-3xl font-bold text-white mb-4">✨ Ready to Create a Brief?</h2>
            <p class="text-[#999999] mb-8 max-w-xl mx-auto">
              Start a guided conversation with our AI to generate a professional 8-section project brief
            </p>
            <button
              @click="openBriefWizard"
              class="px-8 py-4 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105"
            >
              Create New Brief →
            </button>
          </div>

          <!-- Recent Briefs -->
          <div v-if="recentBriefs.length > 0">
            <h3 class="text-2xl font-bold text-white mb-6">Recent Briefs</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="brief in recentBriefs.slice(0, 4)"
                :key="brief.id"
                class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#0033ff] transition cursor-pointer"
                @click="() => { activeTab = 'briefs'; selectedBriefId = brief.id }"
              >
                <div class="flex items-start justify-between mb-3">
                  <h4 class="text-white font-bold flex-1">{{ brief.brief_data?.projectName || 'Untitled' }}</h4>
                  <span :class="[
                    'px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2',
                    brief.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                  ]">
                    {{ brief.status }}
                  </span>
                </div>
                <p class="text-[#999999] text-sm mb-4">{{ formatDate(brief.created_at) }}</p>
                <div class="flex items-center gap-2 text-xs text-[#777]">
                  <span class="px-2 py-1 bg-[#333] rounded">{{ brief.agent_type }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB: BRIEFS -->
        <div v-if="activeTab === 'briefs'" class="space-y-8">
          <!-- Action Bar -->
          <div class="flex items-center gap-4">
            <select
              v-model="filterAgent"
              class="px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white hover:border-[#0033ff] transition"
            >
              <option value="">All Agent Types</option>
              <option value="briefing">Briefing</option>
              <option value="presale">Presale</option>
            </select>

            <button
              @click="openBriefWizard"
              class="ml-auto px-6 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>+</span> New Brief
            </button>
          </div>

          <!-- Briefs List -->
          <div v-if="filteredBriefs.length === 0" class="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
            <p class="text-[#999999] mb-6">No briefs yet</p>
            <button
              @click="openBriefWizard"
              class="px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your First Brief
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="brief in filteredBriefs"
              :key="brief.id"
              class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 cursor-pointer hover:border-[#0033ff] transition"
              @click="viewBrief(brief)"
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

        <!-- TAB: CONVERSATIONS -->
        <div v-if="activeTab === 'conversations'" class="space-y-8">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-12 text-center">
            <p class="text-[#999999] mb-4">💬 Chat history coming soon</p>
            <p class="text-[#666] text-sm">Review and restart conversations that led to your briefs</p>
          </div>
        </div>

        <!-- TAB: FILES -->
        <div v-if="activeTab === 'files'" class="space-y-8">
          <p class="text-[#999999] text-sm mb-6">
            Upload reference files, brand guidelines, design assets, or documents. These will be analyzed by the AI agent when preparing your project brief.
          </p>

          <!-- Upload Area -->
          <div
            @dragover.prevent="dragActive = true"
            @dragleave="dragActive = false"
            @drop.prevent="handleFileDrop"
            :class="{
              'border-[#0033ff] bg-[#0033ff]/5': dragActive,
              'border-[#333]': !dragActive,
            }"
            class="border-2 border-dashed rounded-lg p-8 mb-8 transition cursor-pointer hover:border-[#0033ff]/50"
          >
            <input
              ref="fileInput"
              type="file"
              multiple
              @change="handleFileSelect"
              class="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
            />
            <div @click="fileInput?.click()" class="text-center">
              <p class="text-[#999999] mb-2">📤 Drop files here or click to browse</p>
              <p class="text-[#666] text-sm">Supported: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploading" class="mb-8 p-4 bg-[#0f0f0f] border border-[#333] rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <p class="text-white text-sm">Uploading files...</p>
              <p class="text-[#999999] text-sm">{{ uploadProgress }}%</p>
            </div>
            <div class="w-full bg-[#1a1a1a] rounded-full h-2">
              <div class="bg-[#0033ff] h-2 rounded-full transition-all" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>

          <!-- Files List -->
          <div v-if="userFiles.length === 0 && !uploading" class="text-center py-12">
            <p class="text-[#999999] mb-4">📂 No files uploaded yet</p>
            <p class="text-[#666] text-sm">Start by uploading some reference files</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="file in userFiles"
              :key="file.id"
              class="bg-[#0f0f0f] border border-[#333] rounded-lg p-4 flex items-center justify-between hover:border-[#0033ff] transition"
            >
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div class="text-2xl">{{ getFileIcon(file.name) }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold truncate">{{ file.name }}</p>
                  <p class="text-[#999999] text-sm">{{ formatFileSize(file.size) }} • {{ formatDate(file.uploadedAt) }}</p>
                </div>
              </div>
              <button
                @click.stop="deleteFile(file.id)"
                class="p-2 text-[#999999] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition ml-4"
                title="Delete file"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <!-- TAB: SETTINGS -->
        <div v-if="activeTab === 'settings'" class="space-y-8">
          <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8">
            <h3 class="text-2xl font-bold text-white mb-8">Account Settings</h3>

            <div class="space-y-6">
              <div class="pb-6 border-b border-[#333]">
                <p class="text-white font-semibold mb-2">Email Address</p>
                <p class="text-[#999999]">{{ userEmail }}</p>
              </div>

              <div class="pb-6 border-b border-[#333]">
                <p class="text-white font-semibold mb-4">Password</p>
                <button
                  class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                >
                  Change Password
                </button>
              </div>

              <div>
                <p class="text-white font-semibold mb-4">Billing Information</p>
                <button
                  class="px-6 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- BRIEF CREATION WIZARD MODAL -->
    <Teleport to="body">
      <div
        v-if="showBriefWizard"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click="closeBriefWizard"
      >
        <div
          class="bg-[#1a1a1a] border border-[#333] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="sticky top-0 bg-[#1a1a1a] border-b border-[#333] p-6 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white">Create New Brief</h2>
              <p class="text-[#999999] text-sm mt-1">Stage {{ wizardStage }} of 5</p>
            </div>
            <button
              @click="closeBriefWizard"
              class="text-[#999999] hover:text-white transition text-2xl"
            >
              ✕
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="px-6 pt-6">
            <div class="w-full bg-[#0f0f0f] rounded-full h-2">
              <div
                class="bg-[#0033ff] h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(wizardStage / 5) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <!-- STAGE 1: UPLOAD FILES -->
            <div v-if="wizardStage === 1" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">📤 Upload Reference Files</h3>
                <p class="text-[#999999] text-sm">
                  Start by uploading brand guidelines, wireframes, or any reference materials. The AI will analyze these files to understand your project context.
                </p>
              </div>

              <!-- Upload Area in Modal -->
              <div
                @dragover.prevent="dragActive = true"
                @dragleave="dragActive = false"
                @drop.prevent="handleFileDrop"
                :class="{
                  'border-[#0033ff] bg-[#0033ff]/5': dragActive,
                  'border-[#333]': !dragActive,
                }"
                class="border-2 border-dashed rounded-lg p-8 transition cursor-pointer"
              >
                <input
                  ref="wizardFileInput"
                  type="file"
                  multiple
                  @change="handleWizardFileSelect"
                  class="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                />
                <div @click="wizardFileInput?.click()" class="text-center">
                  <p class="text-[#999999] mb-2">📤 Drop files here or click to browse</p>
                  <p class="text-[#666] text-sm">Supported: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP</p>
                </div>
              </div>

              <!-- Files Added -->
              <div v-if="wizardFiles.length > 0" class="space-y-3">
                <p class="text-white text-sm font-semibold">{{ wizardFiles.length }} file(s) selected:</p>
                <div v-for="(file, idx) in wizardFiles" :key="idx" class="bg-[#0f0f0f] border border-[#333] rounded-lg p-3 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">{{ getFileIcon(file.name) }}</span>
                    <span class="text-white text-sm">{{ file.name }}</span>
                  </div>
                  <button
                    @click="wizardFiles.splice(idx, 1)"
                    class="text-[#999999] hover:text-red-400 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p class="text-[#999999] text-xs">💡 You can also skip this step and add files later</p>
            </div>

            <!-- STAGE 2: GUIDED CONVERSATION -->
            <div v-if="wizardStage === 2" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">💬 Guided Conversation</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Answer a few key questions about your project. The AI will extract important details to build your brief.
                </p>
              </div>

              <!-- Chat Messages -->
              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-96 overflow-y-auto space-y-4">
                <div v-for="(msg, idx) in chatHistory" :key="idx" :class="[
                  'p-4 rounded-lg',
                  msg.role === 'assistant' ? 'bg-[#1a1a1a] border border-[#333]' : 'bg-[#0033ff]/20 border border-[#0033ff]/50'
                ]">
                  <p :class="msg.role === 'assistant' ? 'text-white' : 'text-[#0033ff]'" class="text-sm">
                    {{ msg.role === 'assistant' ? '🤖 AI:' : '👤 You:' }}
                  </p>
                  <p class="text-[#999999] text-sm mt-1">{{ msg.content }}</p>
                </div>
              </div>

              <!-- Input -->
              <div class="flex gap-3">
                <input
                  v-model="userMessage"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Your answer..."
                  class="flex-1 px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#0033ff] focus:outline-none transition"
                />
                <button
                  @click="sendMessage"
                  class="px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </div>

            <!-- STAGE 3: GENERATE -->
            <div v-if="wizardStage === 3" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">✨ Generate Your Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  The AI is now synthesizing your 8-section professional brief using the information provided.
                </p>
              </div>

              <div v-if="isGenerating" class="space-y-6">
                <!-- Loading Animation -->
                <div class="flex justify-center">
                  <div class="relative w-16 h-16">
                    <div class="absolute inset-0 border-2 border-[#333] rounded-full"></div>
                    <div class="absolute inset-0 border-2 border-transparent border-t-[#0033ff] rounded-full animate-spin"></div>
                  </div>
                </div>
                <p class="text-center text-[#999999]">Generating your brief... This may take a moment</p>
              </div>

              <div v-else class="space-y-4">
                <p class="text-center text-green-400 font-semibold">✅ Brief generated successfully!</p>
                <p class="text-[#999999] text-sm">Preview of your brief will appear in the next step</p>
              </div>
            </div>

            <!-- STAGE 4: REVIEW & EDIT -->
            <div v-if="wizardStage === 4" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">👀 Review Your Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Review the generated brief. You can edit sections or regenerate if needed.
                </p>
              </div>

              <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 max-h-96 overflow-y-auto space-y-4">
                <p class="text-[#999999] text-sm">Brief preview would show here...</p>
                <p class="text-[#666] text-xs">Full brief viewing will be available in the final step</p>
              </div>

              <div class="flex gap-3">
                <button
                  @click="isGenerating = false; wizardStage = 2"
                  class="flex-1 px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                >
                  ← Edit Answers
                </button>
                <button
                  @click="wizardStage = 5"
                  class="flex-1 px-4 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Save Brief →
                </button>
              </div>
            </div>

            <!-- STAGE 5: SAVE & EXPORT -->
            <div v-if="wizardStage === 5" class="space-y-6">
              <div>
                <h3 class="text-xl font-bold text-white mb-2">💾 Save Your Brief</h3>
                <p class="text-[#999999] text-sm mb-6">
                  Save your brief to your dashboard or export it immediately.
                </p>
              </div>

              <div class="space-y-4">
                <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6">
                  <input
                    v-model="briefName"
                    type="text"
                    placeholder="Brief Name (e.g., 'E-Commerce Redesign')"
                    class="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:border-[#0033ff] focus:outline-none transition"
                  />
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <button
                    class="px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                  >
                    📄 Export MD
                  </button>
                  <button
                    class="px-4 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
                  >
                    📥 Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer: Navigation Buttons -->
          <div class="sticky bottom-0 bg-[#1a1a1a] border-t border-[#333] p-6 flex items-center justify-between">
            <button
              v-if="wizardStage > 1"
              @click="wizardStage--"
              class="px-6 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
            >
              ← Back
            </button>
            <div v-else></div>

            <div class="flex items-center gap-3">
              <button
                @click="closeBriefWizard"
                class="px-6 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
              >
                Cancel
              </button>
              <button
                v-if="wizardStage < 5"
                @click="nextWizardStage"
                class="px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Next →
              </button>
              <button
                v-else
                @click="saveBrief"
                class="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                ✅ Save Brief
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import GlowBlue from '@/components/effects/GlowBlue.vue'
import FormDataDisplay from '@/components/FormDataDisplay.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { logout, getCurrentUser, getToken } = useGoogleAuth()

const userEmail = ref('')
const activeTab = ref('dashboard')
const filterAgent = ref('')
const selectedBriefId = ref<string | null>(null)

// Brief Wizard State
const showBriefWizard = ref(false)
const wizardStage = ref(1)
const wizardFiles = ref<File[]>([])
const wizardFileInput = ref<HTMLInputElement | null>(null)
const chatHistory = ref<Array<{ role: string; content: string }>>([])
const userMessage = ref('')
const briefName = ref('')
const isGenerating = ref(false)

// Data
const stats = ref({ totalProjects: 0, totalSpent: 0, activeWebsites: 0 })
const briefs = ref<any[]>([])
const projects = ref<any[]>([])
const userFiles = ref<any[]>([])

// File Upload
const fileInput = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'briefs', label: '📋 Briefs' },
  { id: 'conversations', label: '💬 Conversations' },
  { id: 'files', label: '📂 Files' },
  { id: 'settings', label: '⚙️ Settings' },
]

const totalBriefs = computed(() => briefs.value.length)
const activeBriefs = computed(() => briefs.value.filter(b => b.status === 'draft').length)
const recentBriefs = computed(() => briefs.value.slice(0, 4))
const filteredBriefs = computed(() => {
  if (!filterAgent.value) return briefs.value
  return briefs.value.filter(b => b.agent_type === filterAgent.value)
})
const totalFileSize = computed(() => {
  const total = userFiles.value.reduce((sum, f) => sum + (f.size || 0), 0)
  return formatFileSize(total)
})

const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const getFileIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const icons: Record<string, string> = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    txt: '📋',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    zip: '📦',
  }
  return icons[ext || ''] || '📎'
}

const openBriefWizard = () => {
  showBriefWizard.value = true
  wizardStage.value = 1
  wizardFiles.value = []
  chatHistory.value = []
  userMessage.value = ''
  briefName.value = ''
  isGenerating.value = false
}

const closeBriefWizard = () => {
  showBriefWizard.value = false
}

const nextWizardStage = async () => {
  if (wizardStage.value === 1) {
    // Upload files if any
    if (wizardFiles.value.length > 0) {
      await uploadWizardFiles()
    }
    wizardStage.value = 2
  } else if (wizardStage.value === 2) {
    wizardStage.value = 3
    isGenerating.value = true
    // Simulate generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    isGenerating.value = false
  } else if (wizardStage.value === 3) {
    wizardStage.value = 4
  }
}

const sendMessage = () => {
  if (!userMessage.value.trim()) return

  chatHistory.value.push({ role: 'user', content: userMessage.value })

  // Simulate AI response
  setTimeout(() => {
    const responses = [
      "That sounds interesting! Can you tell me more about your target audience?",
      "Got it. What would you say is the main business goal for this project?",
      "I see. Do you have any budget or timeline constraints?",
      "Perfect! I think I have enough information now.",
    ]
    const response = responses[chatHistory.value.length % responses.length]
    chatHistory.value.push({ role: 'assistant', content: response })
  }, 500)

  userMessage.value = ''
}

const handleWizardFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    wizardFiles.value.push(...Array.from(input.files))
    input.value = ''
  }
}

const uploadWizardFiles = async () => {
  // Implementation for uploading wizard files
  console.log('Uploading wizard files:', wizardFiles.value)
}

const saveBrief = () => {
  console.log('Saving brief:', briefName.value)
  closeBriefWizard()
  // Reload briefs
  loadBriefs()
}

const viewBrief = (brief: any) => {
  selectedBriefId.value = brief.id
  // Would navigate to brief detail view
}

const downloadBrief = (brief: any) => {
  console.log('Downloading brief:', brief.id)
}

const deleteBrief = async (brief: any) => {
  if (confirm('Delete this brief?')) {
    console.log('Deleting brief:', brief.id)
    await loadBriefs()
  }
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    await uploadFiles(Array.from(input.files))
    input.value = ''
  }
}

const handleFileDrop = async (event: DragEvent) => {
  dragActive.value = false
  if (event.dataTransfer?.files) {
    await uploadFiles(Array.from(event.dataTransfer.files))
  }
}

const uploadFiles = async (files: File[]) => {
  if (files.length === 0) return

  uploading.value = true
  uploadProgress.value = 0

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
    }
    await loadUserFiles()
  } catch (error) {
    console.error('Upload error:', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

const deleteFile = async (fileId: string) => {
  if (confirm('Delete this file?')) {
    console.log('Deleting file:', fileId)
    await loadUserFiles()
  }
}

const loadBriefs = async () => {
  try {
    const response = await fetch('/api/briefs')
    if (response.ok) {
      const data = await response.json()
      briefs.value = data.data || []
    }
  } catch (error) {
    console.error('Error loading briefs:', error)
  }
}

const loadUserFiles = async () => {
  try {
    const response = await fetch('/api/files', {
      headers: { 'x-user-email': userEmail.value },
    })
    if (response.ok) {
      const data = await response.json()
      userFiles.value = data.data || []
    }
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

const handleLogout = async () => {
  await logout()
  navigateTo('/login')
}

onMounted(async () => {
  const user = getCurrentUser()
  if (!user) {
    navigateTo('/login')
    return
  }

  userEmail.value = user.email

  await loadBriefs()
  await loadUserFiles()
})

const siteUrl = useRuntimeConfig().public?.siteUrl

useSeoMeta({
  title: 'Cabinet | SiteSynth',
  description: 'Manage your SiteSynth projects and briefs.',
  ogTitle: 'Cabinet | SiteSynth',
  ogDescription: 'Your personal SiteSynth dashboard.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
