<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-white mb-2">AI Agent Configuration</h1>
        <p class="text-slate-400">Customize system prompts and settings for both agent modes</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <p class="text-slate-400 mt-4">Loading agent configurations...</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Briefing Agent Card -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-xl">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">{{ configs.briefingAgent?.name || 'Briefing Agent' }}</h2>
            <p class="text-slate-400 text-sm">Active Briefing Mode - Cabinet View</p>
          </div>

          <form @submit.prevent="saveConfig('briefingAgent')" class="space-y-6">
            <!-- Temperature -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Temperature</label>
              <input
                v-model.number="briefingForm.temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <p class="text-xs text-slate-500 mt-1">0 = deterministic, 1 = creative</p>
            </div>

            <!-- Max Tokens -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Max Tokens</label>
              <input
                v-model.number="briefingForm.maxTokens"
                type="number"
                min="100"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <p class="text-xs text-slate-500 mt-1">Higher = longer responses</p>
            </div>

            <!-- System Prompt -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">System Prompt</label>
              <textarea
                v-model="briefingForm.systemPrompt"
                rows="12"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 font-mono text-sm"
                placeholder="Enter system prompt..."
              ></textarea>
              <p class="text-xs text-slate-500 mt-1">{{ briefingForm.systemPrompt.length || 0 }} characters</p>
            </div>

            <!-- Save Button -->
            <button
              type="submit"
              :disabled="savingBriefing"
              class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              {{ savingBriefing ? 'Saving...' : 'Save Briefing Config' }}
            </button>

            <div v-if="successBriefing" class="p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-sm">
              ✓ Configuration saved successfully
            </div>
            <div v-if="errorBriefing" class="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              × {{ errorBriefing }}
            </div>
          </form>
        </div>

        <!-- Presale Agent Card -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-xl">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">{{ configs.consultantAgent?.name || 'Consultant Agent' }}</h2>
            <p class="text-slate-400 text-sm">Presale Mode - Public Website</p>
          </div>

          <form @submit.prevent="saveConfig('consultantAgent')" class="space-y-6">
            <!-- Temperature -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Temperature</label>
              <input
                v-model.number="presaleForm.temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <p class="text-xs text-slate-500 mt-1">0 = deterministic, 1 = creative</p>
            </div>

            <!-- Max Tokens -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Max Tokens</label>
              <input
                v-model.number="presaleForm.maxTokens"
                type="number"
                min="100"
                class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
              <p class="text-xs text-slate-500 mt-1">Higher = longer responses</p>
            </div>

            <!-- System Prompt -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">System Prompt</label>
              <textarea
                v-model="presaleForm.systemPrompt"
                rows="12"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 font-mono text-sm"
                placeholder="Enter system prompt..."
              ></textarea>
              <p class="text-xs text-slate-500 mt-1">{{ presaleForm.systemPrompt.length || 0 }} characters</p>
            </div>

            <!-- Save Button -->
            <button
              type="submit"
              :disabled="savingPresale"
              class="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
            >
              {{ savingPresale ? 'Saving...' : 'Save Consultant Config' }}
            </button>

            <div v-if="successPresale" class="p-3 bg-green-900/20 border border-green-800 rounded-lg text-green-400 text-sm">
              ✓ Configuration saved successfully
            </div>
            <div v-if="errorPresale" class="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
              × {{ errorPresale }}
            </div>
          </form>
        </div>
      </div>

      <!-- Info Section -->
      <div class="mt-12 bg-slate-800 rounded-lg border border-slate-700 p-8">
        <h3 class="text-lg font-bold text-white mb-4">ℹ️ About Agent Modes</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 class="font-semibold text-purple-400 mb-2">Briefing Mode</h4>
            <p>Used when users are logged into their Cabinet. This agent actively guides clients through project development with strategic recommendations.</p>
          </div>
          <div>
            <h4 class="font-semibold text-purple-400 mb-2">Presale Mode</h4>
            <p>Used on the public website for anonymous visitors. This agent answers questions and gently guides prospects toward booking a consultation.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

interface AgentConfig {
  name: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  model?: string
}

const loading = ref(true)
const configs = ref<{ briefingAgent?: AgentConfig; consultantAgent?: AgentConfig }>({})
const { getCurrentUser, getGoogleIdToken, loadStoredAuth } = useGoogleAuth()
const currentUserEmail = ref('')
const isAdmin = computed(() => currentUserEmail.value.toLowerCase() === 'hello@sitesynth.com')

// Form states
const briefingForm = ref<Partial<AgentConfig>>({ temperature: 0.7, maxTokens: 4096, systemPrompt: '' })
const presaleForm = ref<Partial<AgentConfig>>({ temperature: 0.7, maxTokens: 4096, systemPrompt: '' })

// Save states
const savingBriefing = ref(false)
const savingPresale = ref(false)
const successBriefing = ref(false)
const successPresale = ref(false)
const errorBriefing = ref('')
const errorPresale = ref('')

// Load initial configs
onMounted(async () => {
  loadStoredAuth()
  const user = getCurrentUser()
  currentUserEmail.value = user?.email || ''
  if (!currentUserEmail.value) {
    navigateTo('/admin/login')
    return
  }
  if (!isAdmin.value) {
    errorBriefing.value = 'Admin access required'
    loading.value = false
    return
  }
  try {
    const response = await fetch('/api/admin/agents-config', {
      headers: {
        'x-google-id-token': getGoogleIdToken() || '',
      },
    })
    const result = await response.json()

    if (result.data) {
      configs.value = result.data
      briefingForm.value = { ...result.data.briefingAgent }
      presaleForm.value = { ...result.data.consultantAgent }
    }
  } catch (error) {
    console.error('Failed to load configs:', error)
  } finally {
    loading.value = false
  }
})

// Save config
const saveConfig = async (agentType: 'briefingAgent' | 'consultantAgent') => {
  const isPresale = agentType === 'consultantAgent'
  const form = isPresale ? presaleForm : briefingForm
  const savingRef = isPresale ? savingPresale : savingBriefing
  const successRef = isPresale ? successBriefing : successPresale
  const errorRef = isPresale ? errorBriefing : errorPresale

  savingRef.value = true
  successRef.value = false
  errorRef.value = ''

  try {
    const response = await fetch('/api/admin/agents-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-google-id-token': getGoogleIdToken() || '',
      },
      body: JSON.stringify({
        agentType,
        temperature: form.value.temperature,
        maxTokens: form.value.maxTokens,
        systemPrompt: form.value.systemPrompt,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.statusMessage || 'Failed to save config')
    }

    successRef.value = true
    configs.value[agentType as keyof typeof configs.value] = result.data

    // Clear success message after 3 seconds
    setTimeout(() => {
      successRef.value = false
    }, 3000)
  } catch (error: any) {
    errorRef.value = error.message || 'An error occurred'
    console.error('Save error:', error)
  } finally {
    savingRef.value = false
  }
}
</script>
