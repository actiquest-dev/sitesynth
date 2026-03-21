<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="max-w-6xl mx-auto px-6 py-12 space-y-8">
      <div>
        <h1 class="text-3xl font-bold">Sitesynth Admin</h1>
        <p class="text-slate-400 mt-2">Internal control plane for agent behavior, integrations, and operational tooling.</p>
      </div>

      <div v-if="message" class="text-sm" :class="hasError ? 'text-red-400' : 'text-slate-300'">
        {{ message }}
      </div>

      <div v-if="isAdmin" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NuxtLink to="/admin/agents" class="border border-slate-800 bg-slate-900 p-6 hover:border-violet-500/40 hover:bg-slate-900/80 transition">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Agents</h2>
            <span class="text-xs text-violet-300 border border-violet-500/30 px-2 py-1">Internal</span>
          </div>
          <p class="text-sm text-slate-400">Edit system prompts, temperature, token budgets, workflows, and knowledge sources for briefing and presale agents.</p>
        </NuxtLink>

        <NuxtLink to="/admin/integrations" class="border border-slate-800 bg-slate-900 p-6 hover:border-violet-500/40 hover:bg-slate-900/80 transition">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Integrations</h2>
            <span class="text-xs text-violet-300 border border-violet-500/30 px-2 py-1">Internal</span>
          </div>
          <p class="text-sm text-slate-400">Manage the shared Sitesynth Figma OAuth connection, callback URL, and MCP probe state.</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { getCurrentUser, loadStoredAuth } = useGoogleAuth()
const currentUserEmail = ref('')
const isAdmin = computed(() => currentUserEmail.value.toLowerCase() === 'hello@sitesynth.com')
const message = ref('')
const hasError = ref(false)

onMounted(() => {
  loadStoredAuth()
  const user = getCurrentUser()
  currentUserEmail.value = user?.email || ''

  if (!currentUserEmail.value) {
    navigateTo('/login')
    return
  }

  if (!isAdmin.value) {
    hasError.value = true
    message.value = 'Admin access required'
  }
})
</script>
