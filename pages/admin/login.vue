<template>
  <section
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#161616]"
    style="background-image: url('/assets/new-assets/test/sitesynth-animated-gradient-v2.svg'); background-size: cover; background-position: center;"
  >
    <GlowEffect />
    <ParticleEffect />

    <div class="relative w-full max-w-lg mx-auto px-6 py-10">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-semibold text-white mb-2">Admin Access</h1>
        <p class="text-base text-[#999999]">Sign in with the internal Sitesynth Google account</p>
      </div>

      <div class="border border-[#2a2a2a] bg-[#161616]">
        <div class="h-11 border-b border-[#2a2a2a] flex items-center justify-between px-5 bg-[#1a1a1a]">
          <span class="text-xs text-[#777]">Sitesynth Admin</span>
          <span class="text-[10px] text-[#777]">Google only</span>
        </div>

        <div class="px-10 py-9 space-y-5">
          <div v-if="errorMessage" class="p-3.5 bg-[#AA3733]/10 border border-[#AA3733]/40">
            <p class="text-[#AA3733] text-xs">{{ errorMessage }}</p>
          </div>

          <GoogleSignInButton
            :clientId="googleClientId"
            :onSuccess="handleGoogleResponse"
            :onError="(err) => errorMessage = err.message"
          />

          <p class="text-xs text-[#666] leading-relaxed">
            Only <span class="text-white">hello@sitesynth.com</span> is allowed to access the internal admin area.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import GlowEffect from '@/components/effects/GlowEffect.vue'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton.vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const { handleGoogleSignIn, getCurrentUser } = useGoogleAuth()
const config = useRuntimeConfig()
const googleClientId = computed(() => config.public?.googleClientId || '')
const errorMessage = ref('')

const handleGoogleResponse = async (response: any) => {
  errorMessage.value = ''
  try {
    const success = await handleGoogleSignIn(response)
    if (!success) {
      errorMessage.value = 'Google Sign-In failed. Please try again.'
      return
    }

    const user = getCurrentUser()
    if (!user?.email) {
      errorMessage.value = 'Google session was created but no user email was returned.'
      return
    }

    if (user.email.toLowerCase() !== 'hello@sitesynth.com') {
      errorMessage.value = 'This Google account is not allowed to access Sitesynth Admin.'
      return
    }

    await navigateTo('/admin')
  } catch (error: any) {
    errorMessage.value = error.message || 'Admin sign-in failed.'
  }
}

useSeoMeta({
  title: 'Admin Login | SiteSynth',
  description: 'Internal Sitesynth admin login.',
})
</script>
