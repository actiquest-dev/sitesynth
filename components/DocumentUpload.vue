<template>
  <div class="group relative overflow-hidden bg-[#1a1a1a] hover:bg-white/5 transition-colors duration-300 border border-[#333] rounded-lg p-8">
    <GlowBlue />
    
    <div class="relative z-10">
      <h3 class="text-2xl font-bold text-white mb-2">📄 Knowledge Base Management</h3>
      <p class="text-[#d4d4d4] mb-6">Upload documents that agents can use as context</p>

      <!-- Agent Type Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          v-for="type in ['briefing', 'presale']"
          :key="type"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition',
            selectedAgent === type
              ? 'bg-[#0033ff] text-white'
              : 'bg-[#0f0f0f] border border-[#333] text-[#d4d4d4] hover:border-[#0033ff]'
          ]"
          @click="selectedAgent = type as 'briefing' | 'presale'"
        >
          {{ type === 'briefing' ? '📋 Briefing' : '💬 Pre-Sale' }}
        </button>
      </div>

      <!-- Upload Form -->
      <div class="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 mb-6">
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-[#cbd5e1] font-semibold mb-2">Document Title</label>
            <input
              v-model="docTitle"
              type="text"
              placeholder="e.g., Case Study - Acme Corp"
              class="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-lg text-white text-sm focus:outline-none focus:border-[#0033ff] transition"
            />
          </div>

          <div>
            <label class="block text-[#cbd5e1] font-semibold mb-2">Document Content</label>
            <textarea
              v-model="docContent"
              placeholder="Paste your document content here..."
              rows="4"
              class="w-full px-4 py-2 bg-[#161616] border border-[#333] rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#0033ff] transition resize-none"
            ></textarea>
          </div>
        </div>

        <button
          @click="uploadDocument"
          :disabled="isUploading"
          class="w-full px-4 py-2 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ isUploading ? '⏳ Uploading...' : '📤 Upload Document' }}
        </button>

        <div
          v-if="uploadMessage"
          :class="[
            'mt-3 px-4 py-2 rounded-lg text-sm font-semibold',
            uploadMessageType === 'success'
              ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30'
              : 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30'
          ]"
        >
          {{ uploadMessage }}
        </div>
      </div>

      <!-- Documents List -->
      <div>
        <h4 class="text-[#cbd5e1] font-semibold mb-3">Documents</h4>
        <div v-if="documents.length === 0" class="text-center text-[#64748b] py-4">
          No documents yet
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="doc in documents"
            :key="doc.id"
            class="bg-[#161616] border border-[#333] rounded-lg p-4 flex items-center justify-between hover:border-[#0033ff]/50 transition"
          >
            <div class="flex-1">
              <p class="text-white font-semibold text-sm">{{ doc.title }}</p>
              <p class="text-[#64748b] text-xs mt-1">{{ formatDate(doc.created_at) }} • by {{ doc.created_by }}</p>
            </div>
            <button
              @click="deleteDocument(doc.id)"
              class="ml-4 text-[#ef4444] hover:text-red-500 transition text-lg"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import GlowBlue from '~/components/effects/GlowBlue.vue'

interface Document {
  id: string
  title: string
  created_at: string
  created_by: string
}

const selectedAgent = ref<'briefing' | 'presale'>('briefing')
const docTitle = ref('')
const docContent = ref('')
const documents = ref<Document[]>([])
const isUploading = ref(false)
const uploadMessage = ref('')
const uploadMessageType = ref<'success' | 'error'>('success')

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// Load documents
const loadDocuments = async () => {
  try {
    const response = await fetch(`/api/documents?agentType=${selectedAgent.value}`)
    const data = await response.json()
    documents.value = data.data || []
  } catch (error) {
    console.error('Failed to load documents:', error)
  }
}

// Upload document
const uploadDocument = async () => {
  if (!docTitle.value.trim() || !docContent.value.trim()) {
    uploadMessage.value = '❌ Please fill in all fields'
    uploadMessageType.value = 'error'
    return
  }

  isUploading.value = true
  uploadMessage.value = ''

  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentType: selectedAgent.value,
        title: docTitle.value,
        content: docContent.value,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      uploadMessage.value = '✅ Document uploaded successfully'
      uploadMessageType.value = 'success'
      docTitle.value = ''
      docContent.value = ''
      await loadDocuments()
    } else {
      uploadMessage.value = '❌ ' + (data.statusMessage || 'Failed to upload')
      uploadMessageType.value = 'error'
    }
  } catch (error: any) {
    uploadMessage.value = '❌ Error: ' + error.message
    uploadMessageType.value = 'error'
  } finally {
    isUploading.value = false
  }
}

// Delete document
const deleteDocument = async (docId: string) => {
  if (!confirm('Delete this document?')) return

  try {
    const response = await fetch(`/api/documents/${docId}`, { method: 'DELETE' })
    if (response.ok) {
      await loadDocuments()
    }
  } catch (error) {
    console.error('Failed to delete document:', error)
  }
}

onMounted(() => {
  loadDocuments()
})

watch(() => selectedAgent.value, () => {
  loadDocuments()
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

.upload-form {
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

.btn-upload {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.btn-upload:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-upload:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.documents-list {
  margin-top: 2rem;
}

.documents-list h4 {
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

.doc-item {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
}

.doc-item:hover {
  background: rgba(15, 23, 42, 0.7);
  border-color: rgba(100, 116, 139, 0.3);
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.doc-title {
  color: #fff;
  font-weight: 600;
  flex: 1;
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

.doc-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #64748b;
}
</style>
