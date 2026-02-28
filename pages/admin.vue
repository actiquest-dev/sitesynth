<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1>✨ Agent Management Console</h1>
      <p>Configure and manage AI agents in real-time</p>
    </div>

    <!-- Briefing Agent Card -->
    <div class="agent-card">
      <h2>📋 Briefing Specialist</h2>
      <p class="agent-description">Active mode - Cabinet briefing assistant</p>

      <div class="form-group">
        <label>System Prompt</label>
        <textarea
          v-model="briefingAgent.systemPrompt"
          placeholder="Enter system prompt..."
          rows="6"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Temperature (0-1)</label>
          <input
            v-model.number="briefingAgent.temperature"
            type="number"
            min="0"
            max="1"
            step="0.1"
            placeholder="0.7"
          />
          <small>{{ briefingAgent.temperature }}</small>
        </div>

        <div class="form-group">
          <label>Max Tokens</label>
          <input
            v-model.number="briefingAgent.maxTokens"
            type="number"
            min="100"
            max="8000"
            step="100"
            placeholder="4096"
          />
          <small>{{ briefingAgent.maxTokens }}</small>
        </div>
      </div>

      <button @click="saveBriefingAgent" class="btn-save" :disabled="loadingBriefing">
        {{ loadingBriefing ? '⏳ Saving...' : '💾 Save Briefing Agent' }}
      </button>
      <div v-if="messageBriefing" :class="['message', messageBriefingType]">
        {{ messageBriefing }}
      </div>
    </div>

    <!-- Consultant Agent Card -->
    <div class="agent-card">
      <h2>💬 General Consultant</h2>
      <p class="agent-description">Passive mode - Website Q&A assistant</p>

      <div class="form-group">
        <label>System Prompt</label>
        <textarea
          v-model="consultantAgent.systemPrompt"
          placeholder="Enter system prompt..."
          rows="6"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Temperature (0-1)</label>
          <input
            v-model.number="consultantAgent.temperature"
            type="number"
            min="0"
            max="1"
            step="0.1"
            placeholder="0.7"
          />
          <small>{{ consultantAgent.temperature }}</small>
        </div>

        <div class="form-group">
          <label>Max Tokens</label>
          <input
            v-model.number="consultantAgent.maxTokens"
            type="number"
            min="100"
            max="8000"
            step="100"
            placeholder="4096"
          />
          <small>{{ consultantAgent.maxTokens }}</small>
        </div>
      </div>

      <button @click="saveConsultantAgent" class="btn-save" :disabled="loadingConsultant">
        {{ loadingConsultant ? '⏳ Saving...' : '💾 Save Consultant Agent' }}
      </button>
      <div v-if="messageConsultant" :class="['message', messageConsultantType]">
        {{ messageConsultant }}
      </div>
    </div>

    <!-- Info Section -->
    <div class="info-section">
      <h3>📌 How it works</h3>
      <ul>
        <li><strong>System Prompt:</strong> Core instructions for the agent behavior</li>
        <li><strong>Temperature:</strong> Creativity level (0 = precise, 1 = creative)</li>
        <li><strong>Max Tokens:</strong> Maximum response length</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
