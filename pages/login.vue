<template>
  <HeaderSection />

  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg'); background-color: #161616; padding-top: 112px;"
  >
    <GlowEffect />
    <ParticleEffect />

    <div class="relative w-full max-w-lg mx-auto px-6 py-10">

      <!-- Heading -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-semibold text-white mb-2">Welcome back</h1>
        <p class="text-base text-[#555]">Sign in to access your SiteSynth cabinet</p>
      </div>

      <!-- Card -->
      <div class="border border-[#2a2a2a]" style="background: #161616;">

        <!-- Topbar -->
        <div class="h-11 border-b border-[#2a2a2a] flex items-center justify-between px-5" style="background: #1a1a1a;">
          <span class="text-xs text-[#444]" style="font-family: 'Inter', sans-serif;">Sign In</span>
          <div class="flex items-center gap-1.5">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-[#555]">
              <path d="M8 0a3.5 3.5 0 0 0-3.5 3.5V5H3.5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12.5 5h-1V3.5A3.5 3.5 0 0 0 8 0Zm-2 5V3.5a2 2 0 1 1 4 0V5H6Z"/>
            </svg>
            <span class="text-[10px] text-[#444]" style="font-family: 'Inter', sans-serif;">SSL Secured</span>
          </div>
        </div>

        <div class="px-10 py-9">

          <!-- Error -->
          <div v-if="errorMessage" class="mb-5 p-3.5 bg-[#AA3733]/10 border border-[#AA3733]/40 flex gap-2.5 items-start">
            <svg viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 text-[#AA3733] flex-shrink-0 mt-0.5">
              <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
            </svg>
            <p class="text-[#AA3733] text-xs">{{ errorMessage }}</p>
          </div>

          <!-- Google -->
          <GoogleSignInButton
            :clientId="googleClientId"
            :onSuccess="handleGoogleResponse"
            :onError="(err) => errorMessage = err.message"
          />

          <!-- Divider -->
          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-[#222]"></div>
            <span class="text-[10px] uppercase tracking-widest text-[#333]">or</span>
            <div class="flex-1 h-px bg-[#222]"></div>
          </div>

          <!-- Magic Link -->
          <div class="space-y-3">
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-[#444] mb-1.5">Email *</label>
              <input
                v-model="emailInput"
                type="email"
                placeholder="your@email.com"
                class="w-full border px-3 py-2.5 text-sm text-white placeholder:text-[#333] focus:outline-none transition-colors"
                style="background: #1a1a1a; border-color: #2a2a2a;"
                @focus="e => (e.target as HTMLInputElement).style.borderColor = '#8D35FF'"
                @blur="e => (e.target as HTMLInputElement).style.borderColor = '#2a2a2a'"
              />
            </div>
            <button
              @click="handleEmailLogin"
              :disabled="isLoading || !emailInput"
              class="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-[#8D35FF] text-white hover:bg-[#7B2EF0]"
            >
              <svg v-if="isLoading" class="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ isLoading ? 'Accessing...' : 'Access Your Account' }}
            </button>
          </div>

        </div>
      </div>

      <!-- Help -->
      <div class="mt-5 text-center" style="font-family: 'Inter', sans-serif;">
        <p class="mb-1.5 flex items-center justify-center gap-1.5 text-[11px] text-[#444]">
          <svg viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3 text-[#555] flex-shrink-0">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.92 6.085h.001a.75.75 0 1 1-1.342-.67c.8-1.6 2.254-1.86 3.172-1.677.942.188 1.674.7 2.018 1.477.35.795.257 1.947-.877 2.968a5.134 5.134 0 0 1-.66.51 3.63 3.63 0 0 0-.43.344.365.365 0 0 0-.084.157v.013a.75.75 0 0 1-1.496-.082 1.86 1.86 0 0 1 .4-.947c.19-.23.43-.428.6-.563l.04-.03a4.05 4.05 0 0 0 .47-.38c.68-.62.74-1.132.617-1.413-.13-.295-.437-.524-.842-.607-.38-.076-.921.024-1.587 1.32ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
          </svg>
          Questions or issues?
        </p>
        <a href="mailto:hello@sitesynth.com" class="text-[11px] text-[#8D35FF] hover:text-[#a060ff] transition">
          Contact Support →
        </a>
      </div>

    </div>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import GlowEffect from '@/components/effects/GlowEffect.vue'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'
import { useNocoBase } from '@/composables/useNocoBase'

const { handleGoogleSignIn, isLoading } = useGoogleAuth()
const { getList } = useNocoBase()

const emailInput = ref('')
const errorMessage = ref('')
const config = useRuntimeConfig()
const googleClientId = computed(() => config.public?.googleClientId || '')

// Handle Google Sign-In response
const handleGoogleResponse = async (response: any) => {
  errorMessage.value = ''
  try {
    const success = await handleGoogleSignIn(response)
    if (success) {
      console.log('✅ Google Sign-In successful, redirecting...')
      await navigateTo('/cabinet')
    } else {
      errorMessage.value = 'Google Sign-In failed. Please try again.'
    }
  } catch (err: any) {
    console.error('Google Sign-In error:', err)
    errorMessage.value = err.message || 'Google Sign-In failed. Please try again.'
  }
}

// Handle Email-based Login
const handleEmailLogin = async () => {
  if (!emailInput.value) {
    errorMessage.value = 'Please enter your email'
    return
  }

  errorMessage.value = ''

  try {
    // Check if email exists in NocoBase orders
    const allOrders = await getList('orders')
    const userOrders = allOrders.filter((order: any) => {
      const formData = typeof order.form_data === 'string'
        ? JSON.parse(order.form_data)
        : order.form_data
      return formData?.email === emailInput.value || order.email === emailInput.value
    })

    if (userOrders.length === 0) {
      errorMessage.value = 'No orders found for this email. Please complete your intake form first.'
      return
    }

    // Create simple auth token
    const authToken = Buffer.from(`${emailInput.value}:${Date.now()}`).toString('base64')

    // Store in localStorage
    localStorage.setItem('authToken', authToken)
    localStorage.setItem('user', JSON.stringify({
      email: emailInput.value,
      provider: 'email',
      authenticatedAt: new Date().toISOString(),
    }))

    console.log('✅ Email login successful')

    // Redirect to cabinet
    await navigateTo('/cabinet')
  } catch (error: any) {
    console.error('Email login error:', error)
    errorMessage.value = 'An error occurred. Please try again.'
  }
}

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl

useSeoMeta({
  title: 'Sign In | SiteSynth',
  description: 'Sign in to your SiteSynth account and access your projects.',
  ogTitle: 'Sign In | SiteSynth',
  ogDescription: 'Access your SiteSynth cabinet.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
