<template>
  <div class="admin-section">
    <h3>📄 Knowledge Base Management</h3>
    <p class="section-desc">Upload documents that agents can use as context</p>

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

    <!-- Upload Form -->
    <div class="upload-form">
      <div class="form-group">
        <label>Document Title</label>
        <input v-model="docTitle" placeholder="e.g., Case Study - Acme Corp" />
      </div>

      <div class="form-group">
        <label>Document Content</label>
        <textarea
          v-model="docContent"
          placeholder="Paste your document content here..."
          rows="6"
        ></textarea>
      </div>

      <button @click="uploadDocument" :disabled="isUploading" class="btn-upload">
        {{ isUploading ? '⏳ Uploading...' : '📤 Upload Document' }}
      </button>

      <div v-if="uploadMessage" :class="['message', uploadMessageType]">
        {{ uploadMessage }}
      </div>
    </div>

    <!-- Documents List -->
    <div class="documents-list">
      <h4>Documents</h4>
      <div v-if="documents.length === 0" class="empty">
        No documents yet
      </div>

      <div v-for="doc in documents" :key="doc.id" class="doc-item">
        <div class="doc-header">
          <div class="doc-title">{{ doc.title }}</div>
          <button @click="deleteDocument(doc.id)" class="btn-delete" title="Delete">🗑️</button>
        </div>
        <div class="doc-meta">
          <span class="date">{{ formatDate(doc.created_at) }}</span>
          <span class="by">by {{ doc.created_by }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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
