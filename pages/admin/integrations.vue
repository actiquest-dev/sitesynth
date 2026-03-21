<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div>
        <h1 class="text-3xl font-bold">Integrations</h1>
        <p class="text-slate-400 mt-2">Internal Sitesynth control plane. Shared service connections live here, not in client cabinet.</p>
      </div>

      <div class="border border-slate-800 bg-slate-900">
        <div class="px-6 py-4 border-b border-slate-800">
          <h2 class="text-lg font-semibold">Figma</h2>
          <p class="text-sm text-slate-400 mt-1">Shared Sitesynth Figma connection for MCP-driven builder jobs.</p>
        </div>

        <div class="px-6 py-6 space-y-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm font-medium">{{ figma.connected ? 'Connected' : 'Not connected' }}</p>
              <p class="text-xs text-slate-400 mt-1">
                {{ figma.connected
                  ? `Connected${figma.connectedAt ? ' · ' + formatDateTime(figma.connectedAt) : ''}`
                  : 'Connect the shared Sitesynth Figma account once, then builder jobs can run automatically.' }}
              </p>
            </div>
            <span :class="[
              'px-2 py-1 text-xs border',
              figma.connected
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
            ]">
              {{ figma.connected ? 'Connected' : 'Disconnected' }}
            </span>
          </div>

          <div class="space-y-2">
            <label class="block text-xs uppercase tracking-[0.16em] text-slate-400">App Base URL</label>
            <div class="flex gap-3">
              <input
                v-model="figma.appBaseUrl"
                class="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-violet-500"
                placeholder="https://sitesynth-eight.vercel.app"
              />
              <button
                @click="saveAppBaseUrl"
                :disabled="loading"
                class="px-4 py-3 border border-slate-700 text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
              >
                Save URL
              </button>
            </div>
            <p class="text-xs text-slate-500">Callback URL: {{ figma.redirectUri || '—' }}</p>
          </div>

          <div class="flex items-center gap-3 flex-wrap">
            <button
              @click="startFigmaOAuth"
              :disabled="loading"
              class="px-4 py-3 bg-violet-600 text-white hover:bg-violet-700 transition disabled:opacity-50"
            >
              {{ figma.connected ? 'Reconnect Figma' : 'Connect Figma' }}
            </button>
            <button
              @click="loadStatus"
              :disabled="loading"
              class="px-4 py-3 border border-slate-700 text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
            >
              Refresh status
            </button>
            <button
              @click="probeMcp"
              :disabled="loading || !figma.connected"
              class="px-4 py-3 border border-slate-700 text-slate-200 hover:bg-slate-800 transition disabled:opacity-50"
            >
              MCP probe
            </button>
          </div>

          <div v-if="message" class="text-sm" :class="hasError ? 'text-red-400' : 'text-violet-300'">
            {{ message }}
          </div>

          <div v-if="probe" class="border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300 space-y-2">
            <div>Status: {{ probe.status }}</div>
            <div>Refreshed token: {{ probe.refreshed ? 'yes' : 'no' }}</div>
            <div>Expires at: {{ probe.expiresAt || '—' }}</div>
            <div>Body preview: {{ probe.bodyPreview || '—' }}</div>
            <div class="text-slate-500">Full probe payload is logged in browser console as `[Figma MCP Probe]`.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

definePageMeta({
  middleware: ['auth'],
})

const { getCurrentUser, getGoogleIdToken, loadStoredAuth } = useGoogleAuth()

const currentUserEmail = ref('')
const isAdmin = computed(() => currentUserEmail.value.toLowerCase() === 'hello@sitesynth.com')

const figma = reactive({
  connected: false,
  status: 'disconnected',
  appBaseUrl: '',
  redirectUri: '',
  connectedAt: '' as string | null,
})

const loading = ref(false)
const message = ref('')
const hasError = ref(false)
const probe = ref<any | null>(null)

const adminHeaders = () => ({
  'Content-Type': 'application/json',
  'x-google-id-token': getGoogleIdToken() || '',
})

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const loadStatus = async () => {
  if (!isAdmin.value) return
  loading.value = true
  message.value = ''
  hasError.value = false
  try {
    const response = await fetch('/api/admin/figma/oauth/status', {
      headers: { 'x-google-id-token': getGoogleIdToken() || '' },
    })
    const data = await response.json()
    if (!response.ok || !data?.success) throw new Error(data?.statusMessage || data?.error || 'Failed to load integration status')
    figma.connected = !!data.data.connected
    figma.status = data.data.status || 'disconnected'
    figma.appBaseUrl = data.data.appBaseUrl || ''
    figma.redirectUri = data.data.redirectUri || ''
    figma.connectedAt = data.data.connectedAt || null
  } catch (error: any) {
    hasError.value = true
    message.value = error.message || 'Failed to load integration status'
  } finally {
    loading.value = false
  }
}

const saveAppBaseUrl = async () => {
  if (!isAdmin.value) return
  loading.value = true
  message.value = ''
  hasError.value = false
  try {
    const response = await fetch('/api/admin/figma/oauth/status', {
      method: 'PUT',
      headers: adminHeaders(),
      body: JSON.stringify({ appBaseUrl: figma.appBaseUrl }),
    })
    const data = await response.json()
    if (!response.ok || !data?.success) throw new Error(data?.statusMessage || data?.error || 'Failed to save app URL')
    figma.redirectUri = data.data.redirectUri || ''
    message.value = 'App URL saved'
  } catch (error: any) {
    hasError.value = true
    message.value = error.message || 'Failed to save app URL'
  } finally {
    loading.value = false
  }
}

const startFigmaOAuth = async () => {
  if (!isAdmin.value) return
  if (!getGoogleIdToken()) {
    hasError.value = true
    message.value = 'Admin Google session is required. Please sign in again.'
    return
  }
  const response = await fetch('/api/admin/figma/oauth/start', {
    headers: { 'x-google-id-token': getGoogleIdToken() || '' },
  })
  const data = await response.json().catch(() => ({}))
  if (response.ok && data?.success && data?.data?.authUrl) {
    window.location.href = data.data.authUrl
    return
  }
  hasError.value = true
  message.value = data?.statusMessage || data?.error || 'Failed to start Figma OAuth'
}

const probeMcp = async () => {
  if (!isAdmin.value) return
  loading.value = true
  message.value = ''
  hasError.value = false
  probe.value = null
  try {
    const response = await fetch('/api/admin/figma/mcp/probe', {
      headers: { 'x-google-id-token': getGoogleIdToken() || '' },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data?.statusMessage || data?.error || 'Failed to probe Figma MCP')
    probe.value = data.data
    console.log('[Figma MCP Probe]', data.data)
    message.value = data.data?.ok ? `MCP probe succeeded (${data.data.status})` : `MCP probe responded with ${data.data.status}`
  } catch (error: any) {
    hasError.value = true
    message.value = error.message || 'Failed to probe Figma MCP'
    console.error('[Figma MCP Probe] Error', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadStoredAuth()
  const user = getCurrentUser()
  currentUserEmail.value = user?.email || ''

  if (!isAdmin.value) {
    hasError.value = true
    message.value = 'Admin access required'
    return
  }

  const params = new URLSearchParams(window.location.search)
  if (params.get('figma') === 'connected') {
    message.value = 'Figma connected successfully'
    hasError.value = false
  }

  await loadStatus()
})
</script>
