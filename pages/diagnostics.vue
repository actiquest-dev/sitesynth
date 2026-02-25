<template>
  <div class="p-8 bg-[#161616] text-white min-h-screen">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">🔍 Google Auth Diagnostics</h1>

      <!-- Current Origin -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">Current Origin</h2>
        <code class="bg-[#0f0f0f] p-4 rounded block text-sm">{{ currentOrigin }}</code>
      </div>

      <!-- Client ID from env -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">Client ID</h2>
        <code class="bg-[#0f0f0f] p-4 rounded block text-sm break-all">
          {{ clientId || '❌ NOT SET' }}
        </code>
      </div>

      <!-- Required Origins in Google Console -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">✅ Required Origins in Google Console</h2>
        <p class="text-[#999999] mb-4">These MUST be added to:</p>
        <p class="text-sm mb-4">Google Cloud Console → Credentials → OAuth 2.0 Client IDs → {{ clientIdShort }} → Authorized JavaScript origins</p>
        <div class="space-y-2">
          <div v-for="origin in requiredOrigins" :key="origin" class="bg-[#0f0f0f] p-3 rounded font-mono text-sm border border-[#333]">
            <span v-if="currentOrigin === origin" class="text-green-400">✅</span>
            <span v-else class="text-[#999999]">⚠️</span>
            {{ origin }}
          </div>
        </div>
      </div>

      <!-- Test Google SDK -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 mb-8">
        <h2 class="text-2xl font-bold mb-4">Google SDK Status</h2>
        <p class="text-sm mb-4">{{ googleSdkLoaded ? '✅ Loaded' : '❌ Not loaded' }}</p>
        <button
          @click="testGoogleSDK"
          class="bg-[#0033ff] text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          Load Google SDK Now
        </button>
      </div>

      <!-- Troubleshooting -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">🛠️ Troubleshooting</h2>
        <ol class="space-y-3 text-sm">
          <li><strong>1.</strong> Copy your Client ID from above</li>
          <li><strong>2.</strong> Go to https://console.cloud.google.com/</li>
          <li><strong>3.</strong> Credentials → OAuth 2.0 Client IDs → Find your Client ID</li>
          <li><strong>4.</strong> In "Authorized JavaScript origins" section, add ALL origins from above</li>
          <li><strong>5.</strong> Click <strong>SAVE</strong> ⭐ (this is important!)</li>
          <li><strong>6.</strong> Reload this page (Cmd+Shift+R)</li>
          <li><strong>7.</strong> Check if current origin matches one of required origins (marked with ✅)</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const currentOrigin = ref('')
const clientId = ref('')
const googleSdkLoaded = ref(false)

const requiredOrigins = [
  'http://localhost:3000',
  'http://localhost',
  'https://sitesynth.com',
  'https://www.sitesynth.com',
]

const clientIdShort = computed(() => {
  if (!clientId.value) return 'YOUR_CLIENT_ID'
  return clientId.value.substring(0, 10) + '...' + clientId.value.substring(clientId.value.length - 10)
})

onMounted(() => {
  currentOrigin.value = window.location.origin
  const config = useRuntimeConfig()
  clientId.value = config.public?.googleClientId || ''
  googleSdkLoaded.value = !!window.google
})

const testGoogleSDK = () => {
  if (googleSdkLoaded.value) {
    console.log('✅ Google SDK already loaded')
    return
  }

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    googleSdkLoaded.value = !!window.google
    if (window.google) {
      console.log('✅ Google SDK loaded successfully')
    } else {
      console.error('❌ Google SDK failed to load')
    }
  }
  document.head.appendChild(script)
}
</script>
