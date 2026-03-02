<template>
  <div class="admin-section">
    <h3>🔄 Workflow Builder</h3>
    <p class="section-desc">Create multi-step workflows for agents</p>

    <!-- Agent Type Tabs -->
    <div class="agent-tabs">
      <button
        v-for="type in ['briefing', 'presale']"
        :key="type"
        :class="['tab', { active: selectedAgent === type }]"
        @click="selectedAgent = type as 'briefing' | 'presale'"
      >
        {{ type === 'briefing' ? '📋 Briefing' : '💬 Pre-Sale' }}
      </button>
    </div>

    <!-- Create Workflow Form -->
    <div class="workflow-form">
      <div class="form-group">
        <label>Workflow Name</label>
        <input v-model="workflowName" placeholder="e.g., Client Onboarding" />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea
          v-model="workflowDesc"
          placeholder="What does this workflow do?"
          rows="3"
        ></textarea>
      </div>

      <!-- Steps Editor -->
      <div class="steps-editor">
        <h4>Steps</h4>
        <div v-for="(step, idx) in steps" :key="idx" class="step-item">
          <div class="step-num">Step {{ idx + 1 }}</div>
          <div class="step-inputs">
            <input
              v-model="step.prompt"
              placeholder="Enter prompt for this step..."
              class="step-prompt"
            />
            <button @click="removeStep(idx)" class="btn-remove">✕</button>
          </div>
        </div>

        <button @click="addStep" class="btn-add-step">+ Add Step</button>
      </div>

      <!-- Action Buttons -->
      <div class="form-actions">
        <button
          @click="saveWorkflow"
          :disabled="isSaving || !workflowName.trim() || steps.length === 0"
          class="btn-save"
        >
          {{ isSaving ? '⏳ Saving...' : '💾 Save Workflow' }}
        </button>
        <button @click="resetForm" class="btn-reset">Reset</button>
      </div>

      <div v-if="saveMessage" :class="['message', saveMessageType]">
        {{ saveMessage }}
      </div>
    </div>

    <!-- Active Workflows List -->
    <div class="workflows-list">
      <h4>Active Workflows</h4>
      <div v-if="workflows.length === 0" class="empty">
        No workflows yet
      </div>

      <div v-for="wf in workflows" :key="wf.id" class="workflow-item">
        <div class="workflow-header">
          <div>
            <div class="workflow-title">{{ wf.name }}</div>
            <div class="workflow-desc">{{ wf.description }}</div>
          </div>
          <button @click="deleteWorkflow(wf.id)" class="btn-delete" title="Delete">
            🗑️
          </button>
        </div>
        <div class="workflow-steps">
          <div v-for="(step, idx) in wf.steps_json" :key="idx" class="step-badge">
            {{ idx + 1 }}. {{ step.prompt.substring(0, 30) }}...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Step {
  step: number
  prompt: string
}

interface Workflow {
  id: string
  name: string
  description: string
  steps_json: Step[]
}

const selectedAgent = ref<'briefing' | 'presale'>('briefing')
const workflowName = ref('')
const workflowDesc = ref('')
const steps = ref<Step[]>([{ step: 1, prompt: '' }])
const workflows = ref<Workflow[]>([])
const isSaving = ref(false)
const saveMessage = ref('')
const saveMessageType = ref<'success' | 'error'>('success')

// Load workflows
const loadWorkflows = async () => {
  try {
    const response = await fetch(`/api/workflows?agentType=${selectedAgent.value}`)
    const data = await response.json()
    workflows.value = data.data || []
  } catch (error) {
    console.error('Failed to load workflows:', error)
  }
}

// Add new step
const addStep = () => {
  steps.value.push({
    step: steps.value.length + 1,
    prompt: '',
  })
}

// Remove step
const removeStep = (idx: number) => {
  steps.value.splice(idx, 1)
  // Renumber steps
  steps.value.forEach((step, i) => {
    step.step = i + 1
  })
}

// Save workflow
const saveWorkflow = async () => {
  if (!workflowName.value.trim() || steps.value.length === 0) {
    saveMessage.value = '❌ Please fill in workflow name and at least one step'
    saveMessageType.value = 'error'
    return
  }

  isSaving.value = true
  saveMessage.value = ''

  try {
    const response = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentType: selectedAgent.value,
        name: workflowName.value,
        description: workflowDesc.value,
        stepsJson: steps.value,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      saveMessage.value = '✅ Workflow saved successfully'
      saveMessageType.value = 'success'
      resetForm()
      await loadWorkflows()
    } else {
      saveMessage.value = '❌ ' + (data.statusMessage || 'Failed to save')
      saveMessageType.value = 'error'
    }
  } catch (error: any) {
    saveMessage.value = '❌ Error: ' + error.message
    saveMessageType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

// Delete workflow
const deleteWorkflow = async (id: string) => {
  if (!confirm('Delete this workflow?')) return

  try {
    const response = await fetch(`/api/workflows/${id}`, { method: 'DELETE' })
    if (response.ok) {
      await loadWorkflows()
    }
  } catch (error) {
    console.error('Failed to delete workflow:', error)
  }
}

// Reset form
const resetForm = () => {
  workflowName.value = ''
  workflowDesc.value = ''
  steps.value = [{ step: 1, prompt: '' }]
}

onMounted(() => {
  loadWorkflows()
})

watch(() => selectedAgent.value, () => {
  loadWorkflows()
})
</script>

<style scoped>
.admin-section {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.admin-section h3 {
  color: #fff;
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.section-desc {
  color: #94a3b8;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.agent-tabs {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  color: #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  background: rgba(30, 41, 59, 0.8);
}

.tab.active {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.workflow-form {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
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

.steps-editor {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(100, 116, 139, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.steps-editor h4 {
  color: #cbd5e1;
  margin: 0 0 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
  display: flex;
  gap: 1rem;
  align-items: start;
}

.step-num {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.step-inputs {
  flex: 1;
  display: flex;
  gap: 0.5rem;
}

.step-prompt {
  flex: 1;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 0.9rem;
  font-family: 'Monaco', 'Courier New', monospace;
}

.step-prompt:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.7);
}

.btn-remove {
  padding: 0.5rem 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-add-step {
  width: 100%;
  padding: 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px dashed rgba(34, 197, 94, 0.3);
  color: #22c55e;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-add-step:hover {
  background: rgba(34, 197, 94, 0.2);
  border-style: solid;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-save,
.btn-reset {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-reset {
  background: rgba(100, 116, 139, 0.1);
  border: 1px solid rgba(100, 116, 139, 0.3);
  color: #cbd5e1;
}

.btn-reset:hover {
  background: rgba(100, 116, 139, 0.2);
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 8px;
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

.workflows-list {
  margin-top: 2rem;
}

.workflows-list h4 {
  color: #cbd5e1;
  margin: 0 0 1rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty {
  color: #64748b;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.workflow-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
}

.workflow-item:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(100, 116, 139, 0.3);
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.workflow-title {
  color: #fff;
  font-weight: 600;
}

.workflow-desc {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.btn-delete {
  padding: 0.4rem 0.6rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-delete:hover {
  transform: scale(1.2);
}

.workflow-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.step-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid rgba(59, 130, 246, 0.3);
}
</style>
