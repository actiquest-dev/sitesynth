<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen flex items-center justify-center pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />
    <ParticleEffect />

    <!-- Success Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div
        class="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-2xl w-full mx-auto px-6 md:px-12">
      <!-- Title Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">
          Welcome Back
        </h1>
        <p class="text-xl text-[#999999] mb-8">
          Sign in to access your SiteSynth cabinet
        </p>

        <!-- Trust Badge -->
        <div class="flex justify-center items-center gap-6 text-[#999999] text-sm flex-wrap">
          <div class="flex items-center gap-2">
            <span>🔒</span>
            <span>SSL Encrypted</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>Secure Login</span>
          </div>
        </div>
      </div>

      <!-- Login Card -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 md:p-12 mb-8">
        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-[#AA3733]/20 border border-[#AA3733] rounded-lg">
          <p class="text-[#AA3733] text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Google Sign-In Button -->
        <GoogleSignInButton
          :clientId="googleClientId"
          :onSuccess="handleGoogleResponse"
          :onError="(err) => errorMessage = err.message"
          class="mb-6"
        />

        <!-- Divider -->
        <div class="flex items-center gap-4 mb-6">
          <div class="flex-1 h-px bg-[#333]"></div>
          <span class="text-[#999999] text-sm">or</span>
          <div class="flex-1 h-px bg-[#333]"></div>
        </div>

        <!-- Email-based Access -->
        <div class="space-y-4">
          <div>
            <label class="block text-white font-semibold mb-2">Magic Link</label>
            <input
              v-model="emailInput"
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#555] focus:border-[#0033ff] focus:outline-none transition"
            />
          </div>

          <button
            @click="handleEmailLogin"
            :disabled="isLoading || !emailInput"
            class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Accessing...' : 'Access Your Account' }}
          </button>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 text-center text-[#999999] text-sm">
        <p class="mb-2">❓ Questions or issues?</p>
        <a href="mailto:hello@sitesynth.com" class="text-[#0033ff] hover:text-blue-400 transition font-semibold">
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
import GlowBlue from '@/components/effects/GlowBlue.vue'
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
