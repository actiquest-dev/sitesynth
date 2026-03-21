<template>
  <HeaderSection />

  <section class="relative overflow-hidden border-b border-[#333] bg-[#161616] pb-16 text-white md:pb-24">
    <GlowBlue />
    <ParticleEffect />

    <div class="relative mx-auto max-w-7xl px-6 pt-20 md:px-12 md:pt-32">
      <div class="mb-12 text-center">
        <h1 class="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl">
          Agent Management
        </h1>
        <p class="mx-auto max-w-2xl text-base leading-relaxed text-[#d4d4d4] sm:text-lg">
          Configure prompts, models, workflows, and knowledge sources for internal agents.
        </p>
      </div>
    </div>
  </section>

  <BannerSection id="banner-agent-config" tag="h2" text="Agent Configuration" />

  <section class="relative min-h-screen overflow-hidden bg-[#161616] pb-16 pt-16 md:pb-24 md:pt-24">
    <GlowBlue />
    <ParticleEffect />

    <div class="pointer-events-none absolute inset-0 opacity-70">
      <div class="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl"></div>
      <div class="absolute left-1/3 top-1/2 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
    </div>

    <div class="relative mx-auto max-w-7xl px-6 md:px-12">
      <div v-if="pageMessage" class="mb-6 rounded-lg border px-4 py-3 text-sm font-semibold" :class="pageMessageClass">
        {{ pageMessage }}
      </div>

      <div class="space-y-8">
        <div class="group relative overflow-hidden rounded-lg border border-[#333] bg-[#1a1a1a] p-8 transition-colors duration-300 hover:bg-white/5">
          <GlowBlue />

          <div class="relative z-10">
            <h2 class="mb-2 text-2xl font-bold text-white">Briefing Specialist</h2>
            <p class="mb-6 text-[#d4d4d4]">Active mode - Cabinet briefing assistant</p>

            <div class="space-y-6">
              <div class="form-group">
                <label class="mb-2 block font-semibold text-[#cbd5e1]">System Prompt</label>
                <textarea
                  v-model="briefingAgent.systemPrompt"
                  rows="10"
                  class="w-full rounded-lg border border-[#333] bg-[#0f0f0f] px-4 py-3 font-mono text-sm text-white transition focus:border-[#0033ff] focus:outline-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label class="mb-2 block font-semibold text-[#cbd5e1]">Temperature (0-1)</label>
                  <div class="flex items-center gap-4">
                    <input
                      v-model.number="briefingAgent.temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#636363]"
                    />
                    <span class="w-12 font-bold text-white">{{ briefingAgent.temperature.toFixed(1) }}</span>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block font-semibold text-[#cbd5e1]">Max Tokens</label>
                  <input
                    v-model.number="briefingAgent.maxTokens"
                    type="number"
                    min="100"
                    max="8000"
                    step="100"
                    class="w-full rounded-lg border border-[#333] bg-[#0f0f0f] px-4 py-3 text-sm text-white transition focus:border-[#0033ff] focus:outline-none"
                  />
                </div>
              </div>

              <button
                :disabled="loadingBriefing"
                class="w-full rounded-lg bg-[#0033ff] px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                @click="saveBriefingAgent"
              >
                {{ loadingBriefing ? 'Saving...' : 'Save Briefing Agent' }}
              </button>

              <div v-if="messageBriefing" :class="messageBriefingClass">
                {{ messageBriefing }}
              </div>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-lg border border-[#333] bg-[#1a1a1a] p-8 transition-colors duration-300 hover:bg-white/5">
          <GlowBlue />

          <div class="relative z-10">
            <h2 class="mb-2 text-2xl font-bold text-white">General Consultant</h2>
            <p class="mb-6 text-[#d4d4d4]">Passive mode - Website Q&amp;A assistant</p>

            <div class="space-y-6">
              <div class="form-group">
                <label class="mb-2 block font-semibold text-[#cbd5e1]">System Prompt</label>
                <textarea
                  v-model="consultantAgent.systemPrompt"
                  rows="10"
                  class="w-full rounded-lg border border-[#333] bg-[#0f0f0f] px-4 py-3 font-mono text-sm text-white transition focus:border-[#0033ff] focus:outline-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label class="mb-2 block font-semibold text-[#cbd5e1]">Temperature (0-1)</label>
                  <div class="flex items-center gap-4">
                    <input
                      v-model.number="consultantAgent.temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-[#636363]"
                    />
                    <span class="w-12 font-bold text-white">{{ consultantAgent.temperature.toFixed(1) }}</span>
                  </div>
                </div>

                <div>
                  <label class="mb-2 block font-semibold text-[#cbd5e1]">Max Tokens</label>
                  <input
                    v-model.number="consultantAgent.maxTokens"
                    type="number"
                    min="100"
                    max="8000"
                    step="100"
                    class="w-full rounded-lg border border-[#333] bg-[#0f0f0f] px-4 py-3 text-sm text-white transition focus:border-[#0033ff] focus:outline-none"
                  />
                </div>
              </div>

              <button
                :disabled="loadingConsultant"
                class="w-full rounded-lg bg-[#0033ff] px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                @click="saveConsultantAgent"
              >
                {{ loadingConsultant ? 'Saving...' : 'Save Consultant Agent' }}
              </button>

              <div v-if="messageConsultant" :class="messageConsultantClass">
                {{ messageConsultant }}
              </div>
            </div>
          </div>
        </div>

        <DocumentUpload />
        <WorkflowBuilder />

        <div class="group relative overflow-hidden rounded-lg border border-[#333] bg-[#1a1a1a] p-8 transition-colors duration-300 hover:bg-white/5">
          <GlowBlue />

          <div class="relative z-10">
            <h3 class="mb-6 text-2xl font-bold text-white">How it works</h3>
            <ul class="space-y-3">
              <li class="flex items-start gap-3 text-[#d4d4d4]">
                <span class="mt-0.5 font-bold text-[#0033ff]">▸</span>
                <span><strong class="text-[#0033ff]">System Prompt:</strong> Core instructions for the agent behavior.</span>
              </li>
              <li class="flex items-start gap-3 text-[#d4d4d4]">
                <span class="mt-0.5 font-bold text-[#0033ff]">▸</span>
                <span><strong class="text-[#0033ff]">Temperature:</strong> Creativity level from precise to exploratory.</span>
              </li>
              <li class="flex items-start gap-3 text-[#d4d4d4]">
                <span class="mt-0.5 font-bold text-[#0033ff]">▸</span>
                <span><strong class="text-[#0033ff]">Max Tokens:</strong> Maximum response length budget.</span>
              </li>
              <li class="flex items-start gap-3 text-[#d4d4d4]">
                <span class="mt-0.5 font-bold text-[#0033ff]">▸</span>
                <span><strong class="text-[#0033ff]">Documents:</strong> Upload knowledge files for agent retrieval context.</span>
              </li>
              <li class="flex items-start gap-3 text-[#d4d4d4]">
                <span class="mt-0.5 font-bold text-[#0033ff]">▸</span>
                <span><strong class="text-[#0033ff]">Workflows:</strong> Define multi-step execution flows per agent.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DocumentUpload from '~/components/DocumentUpload.vue'
import WorkflowBuilder from '~/components/WorkflowBuilder.vue'
import HeaderSection from '~/components/layout/HeaderSection.vue'
import GlowBlue from '~/components/effects/GlowBlue.vue'
import ParticleEffect from '~/components/effects/ParticleEffect.vue'
import BannerSection from '~/components/sections/BannerSection.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { getCurrentUser, getGoogleIdToken, loadStoredAuth } = useGoogleAuth()

const briefingAgent = ref({
  name: 'Viz - Briefing Specialist',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '',
})

const consultantAgent = ref({
  name: 'Viz - General Consultant',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '',
})

const loadingBriefing = ref(false)
const loadingConsultant = ref(false)
const messageBriefing = ref('')
const messageConsultant = ref('')
const messageBriefingType = ref<'success' | 'error'>('success')
const messageConsultantType = ref<'success' | 'error'>('success')
const pageMessage = ref('')
const pageMessageType = ref<'success' | 'error'>('success')

const messageBriefingClass = computed(() =>
  messageBriefingType.value === 'success'
    ? 'rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm font-semibold text-[#22c55e]'
    : 'rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm font-semibold text-[#ef4444]'
)

const messageConsultantClass = computed(() =>
  messageConsultantType.value === 'success'
    ? 'rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm font-semibold text-[#22c55e]'
    : 'rounded-lg border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-sm font-semibold text-[#ef4444]'
)

const pageMessageClass = computed(() =>
  pageMessageType.value === 'success'
    ? 'border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]'
    : 'border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]'
)

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-google-id-token': getGoogleIdToken() || '',
})

const loadAgentConfigs = async () => {
  try {
    const response = await fetch('/api/admin/agents-config', {
      headers: {
        'x-google-id-token': getGoogleIdToken() || '',
      },
    })

    if (response.status === 401 || response.status === 403) {
      await navigateTo('/admin/login')
      return
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.statusMessage || 'Failed to load agent configs')
    }

    if (data.data?.briefingAgent) {
      briefingAgent.value = { ...briefingAgent.value, ...data.data.briefingAgent }
    }
    if (data.data?.consultantAgent) {
      consultantAgent.value = { ...consultantAgent.value, ...data.data.consultantAgent }
    }
  } catch (error: any) {
    pageMessage.value = error.message || 'Failed to load agent configs'
    pageMessageType.value = 'error'
  }
}

onMounted(async () => {
  loadStoredAuth()
  const user = getCurrentUser()
  const email = user?.email?.toLowerCase() || ''

  if (email !== 'hello@sitesynth.com') {
    await navigateTo('/admin/login')
    return
  }

  await loadAgentConfigs()
})

const saveBriefingAgent = async () => {
  loadingBriefing.value = true
  messageBriefing.value = ''

  try {
    const response = await fetch('/api/admin/agents-config', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({
        agentType: 'briefingAgent',
        name: briefingAgent.value.name,
        temperature: briefingAgent.value.temperature,
        maxTokens: briefingAgent.value.maxTokens,
        systemPrompt: briefingAgent.value.systemPrompt,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.statusMessage || 'Failed to update briefing agent')
    }

    messageBriefing.value = data.message || 'Briefing agent updated successfully'
    messageBriefingType.value = 'success'
  } catch (error: any) {
    messageBriefing.value = error.message || 'Failed to update briefing agent'
    messageBriefingType.value = 'error'
  } finally {
    loadingBriefing.value = false
  }
}

const saveConsultantAgent = async () => {
  loadingConsultant.value = true
  messageConsultant.value = ''

  try {
    const response = await fetch('/api/admin/agents-config', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({
        agentType: 'consultantAgent',
        name: consultantAgent.value.name,
        temperature: consultantAgent.value.temperature,
        maxTokens: consultantAgent.value.maxTokens,
        systemPrompt: consultantAgent.value.systemPrompt,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.statusMessage || 'Failed to update consultant agent')
    }

    messageConsultant.value = data.message || 'Consultant agent updated successfully'
    messageConsultantType.value = 'success'
  } catch (error: any) {
    messageConsultant.value = error.message || 'Failed to update consultant agent'
    messageConsultantType.value = 'error'
  } finally {
    loadingConsultant.value = false
  }
}
</script>
