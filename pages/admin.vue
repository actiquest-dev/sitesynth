<template>
  <HeaderSection />

  <!-- HERO SECTION WITH EFFECTS -->
  <section class="relative bg-[#161616] text-white overflow-hidden pb-16 md:pb-24 border-b border-[#636363]">
    <!-- Glow Effects -->
    <GlowBlue />
    <ParticleEffect />

    <div class="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32">
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          ✨ Agent Management
        </h1>
        <p class="text-base sm:text-lg text-[#d4d4d4] max-w-2xl mx-auto leading-relaxed">
          Configure and manage AI agents in real-time
        </p>
      </div>
    </div>
  </section>

  <BannerSection id="banner-agent-config" tag="h2" text="Agent Configuration" />

  <!-- Admin Content -->
  <section class="relative bg-[#161616] min-h-screen pt-16 md:pt-24 pb-16 md:pb-24 overflow-hidden">
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

    <div class="relative max-w-7xl mx-auto px-6 md:px-12">
      <div class="space-y-8">
        <!-- Briefing Agent Card -->
        <div class="group relative overflow-hidden bg-[#1a1a1a] hover:bg-white/5 transition-colors duration-300 border border-[#636363] rounded-lg p-8">
          <GlowBlue />
          
          <div class="relative z-10">
            <h2 class="text-2xl font-bold text-white mb-2">📋 Briefing Specialist</h2>
            <p class="text-[#d4d4d4] mb-6">Active mode - Cabinet briefing assistant</p>

            <div class="space-y-6">
              <div class="form-group">
                <label class="block text-[#cbd5e1] font-semibold mb-2">System Prompt</label>
                <textarea
                  v-model="briefingAgent.systemPrompt"
                  placeholder="Enter system prompt..."
                  rows="5"
                  class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#636363] rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#0033ff] transition"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[#cbd5e1] font-semibold mb-2">Temperature (0-1)</label>
                  <div class="flex items-center gap-4">
                    <input
                      v-model.number="briefingAgent.temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="flex-1 h-2 bg-[#636363] rounded-lg appearance-none cursor-pointer"
                    />
                    <span class="text-white font-bold w-12">{{ briefingAgent.temperature.toFixed(1) }}</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[#cbd5e1] font-semibold mb-2">Max Tokens</label>
                  <input
                    v-model.number="briefingAgent.maxTokens"
                    type="number"
                    min="100"
                    max="8000"
                    step="100"
                    class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#636363] rounded-lg text-white text-sm focus:outline-none focus:border-[#0033ff] transition"
                  />
                </div>
              </div>

              <button 
                @click="saveBriefingAgent"
                :disabled="loadingBriefing"
                class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {{ loadingBriefing ? '⏳ Saving...' : '💾 Save Briefing Agent' }}
              </button>

              <div v-if="messageBriefing" :class="['px-4 py-3 rounded-lg text-sm font-semibold', messageBriefingType === 'success' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30' : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30']">
                {{ messageBriefing }}
              </div>
            </div>
          </div>
        </div>

        <!-- Consultant Agent Card -->
        <div class="group relative overflow-hidden bg-[#1a1a1a] hover:bg-white/5 transition-colors duration-300 border border-[#636363] rounded-lg p-8">
          <GlowBlue />
          
          <div class="relative z-10">
            <h2 class="text-2xl font-bold text-white mb-2">💬 General Consultant</h2>
            <p class="text-[#d4d4d4] mb-6">Passive mode - Website Q&A assistant</p>

            <div class="space-y-6">
              <div class="form-group">
                <label class="block text-[#cbd5e1] font-semibold mb-2">System Prompt</label>
                <textarea
                  v-model="consultantAgent.systemPrompt"
                  placeholder="Enter system prompt..."
                  rows="5"
                  class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#636363] rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#0033ff] transition"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-[#cbd5e1] font-semibold mb-2">Temperature (0-1)</label>
                  <div class="flex items-center gap-4">
                    <input
                      v-model.number="consultantAgent.temperature"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      class="flex-1 h-2 bg-[#636363] rounded-lg appearance-none cursor-pointer"
                    />
                    <span class="text-white font-bold w-12">{{ consultantAgent.temperature.toFixed(1) }}</span>
                  </div>
                </div>

                <div>
                  <label class="block text-[#cbd5e1] font-semibold mb-2">Max Tokens</label>
                  <input
                    v-model.number="consultantAgent.maxTokens"
                    type="number"
                    min="100"
                    max="8000"
                    step="100"
                    class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#636363] rounded-lg text-white text-sm focus:outline-none focus:border-[#0033ff] transition"
                  />
                </div>
              </div>

              <button 
                @click="saveConsultantAgent"
                :disabled="loadingConsultant"
                class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {{ loadingConsultant ? '⏳ Saving...' : '💾 Save Consultant Agent' }}
              </button>

              <div v-if="messageConsultant" :class="['px-4 py-3 rounded-lg text-sm font-semibold', messageConsultantType === 'success' ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30' : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30']">
                {{ messageConsultant }}
              </div>
            </div>
          </div>
        </div>

      <!-- Document Upload -->
      <DocumentUpload />

      <!-- Workflow Builder -->
      <WorkflowBuilder />

      <!-- Info Section -->
        <div class="group relative overflow-hidden bg-[#1a1a1a] hover:bg-white/5 transition-colors duration-300 border border-[#636363] rounded-lg p-8">
          <GlowBlue />
          
          <div class="relative z-10">
            <h3 class="text-2xl font-bold text-white mb-6">📌 How it works</h3>
            <ul class="space-y-3">
              <li class="text-[#d4d4d4] flex items-start gap-3">
                <span class="text-[#0033ff] font-bold mt-0.5">▸</span>
                <span><strong class="text-[#0033ff]">System Prompt:</strong> Core instructions for the agent behavior</span>
              </li>
              <li class="text-[#d4d4d4] flex items-start gap-3">
                <span class="text-[#0033ff] font-bold mt-0.5">▸</span>
                <span><strong class="text-[#0033ff]">Temperature:</strong> Creativity level (0 = precise, 1 = creative)</span>
              </li>
              <li class="text-[#d4d4d4] flex items-start gap-3">
                <span class="text-[#0033ff] font-bold mt-0.5">▸</span>
                <span><strong class="text-[#0033ff]">Max Tokens:</strong> Maximum response length</span>
              </li>
              <li class="text-[#d4d4d4] flex items-start gap-3">
                <span class="text-[#0033ff] font-bold mt-0.5">▸</span>
                <span><strong class="text-[#0033ff]">Documents:</strong> Upload knowledge base files for agents to reference</span>
              </li>
              <li class="text-[#d4d4d4] flex items-start gap-3">
                <span class="text-[#0033ff] font-bold mt-0.5">▸</span>
                <span><strong class="text-[#0033ff]">Workflows:</strong> Create multi-step processes for agents to follow</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DocumentUpload from '~/components/DocumentUpload.vue'
import WorkflowBuilder from '~/components/WorkflowBuilder.vue'
import HeaderSection from '~/components/layout/HeaderSection.vue'
import GlowBlue from '~/components/effects/GlowBlue.vue'
import ParticleEffect from '~/components/effects/ParticleEffect.vue'
import BannerSection from '~/components/sections/BannerSection.vue'

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
const messageBriefingType = ref('success')
const messageConsultantType = ref('success')

// Load current agent configs on mount
onMounted(async () => {
  try {
    const response = await fetch('/api/admin/agents-config')
    if (response.ok) {
      const data = await response.json()
      if (data.data.briefingAgent) {
        briefingAgent.value = { ...briefingAgent.value, ...data.data.briefingAgent }
      }
      if (data.data.consultantAgent) {
        consultantAgent.value = { ...consultantAgent.value, ...data.data.consultantAgent }
      }
    }
  } catch (error) {
    console.error('Failed to load agent configs:', error)
  }
})

const saveBriefingAgent = async () => {
  loadingBriefing.value = true
  messageBriefing.value = ''

  try {
    const response = await fetch('/api/admin/agents-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentType: 'briefingAgent',
        temperature: briefingAgent.value.temperature,
        maxTokens: briefingAgent.value.maxTokens,
        systemPrompt: briefingAgent.value.systemPrompt,
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      messageBriefing.value = '✅ ' + (data.message || 'Briefing agent updated successfully!')
      messageBriefingType.value = 'success'
    } else {
      messageBriefing.value = '❌ ' + (data.statusMessage || 'Failed to update agent')
      messageBriefingType.value = 'error'
    }
  } catch (error: any) {
    messageBriefing.value = '❌ Error: ' + error.message
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentType: 'consultantAgent',
        temperature: consultantAgent.value.temperature,
        maxTokens: consultantAgent.value.maxTokens,
        systemPrompt: consultantAgent.value.systemPrompt,
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      messageConsultant.value = '✅ ' + (data.message || 'Consultant agent updated successfully!')
      messageConsultantType.value = 'success'
    } else {
      messageConsultant.value = '❌ ' + (data.statusMessage || 'Failed to update agent')
      messageConsultantType.value = 'error'
    }
  } catch (error: any) {
    messageConsultant.value = '❌ Error: ' + error.message
    messageConsultantType.value = 'error'
  } finally {
    loadingConsultant.value = false
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.admin-header {
  text-align: center;
  margin-bottom: 3rem;
  color: #fff;
}

.admin-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.admin-header p {
  font-size: 1rem;
  color: #94a3b8;
  margin: 0;
}

.agent-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.agent-card h2 {
  color: #fff;
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.agent-description {
  color: #94a3b8;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #cbd5e1;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 8px;
  color: #fff;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.8rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.btn-save {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.message.success {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.info-section {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.info-section h3 {
  color: #fff;
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.info-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-section li {
  color: #cbd5e1;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.5;
}

.info-section li:before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #3b82f6;
  font-weight: bold;
}

.info-section strong {
  color: #60a5fa;
}
</style>
