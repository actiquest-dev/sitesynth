<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen flex items-center justify-center pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <ParticleEffect />

    <!-- Success Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-60">
      <div
        class="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-2xl w-full mx-auto px-6 md:px-12">
      <!-- Title Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">
          Create Your Account
        </h1>
        <p class="text-xl text-[#999999] mb-8">
          Join SiteSynth and start building amazing projects
        </p>

        <!-- Trust Badge -->
        <div class="flex justify-center items-center gap-6 text-[#999999] text-sm flex-wrap">
          <div class="flex items-center gap-2">
            <span>🔒</span>
            <span>SSL Encrypted</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>Secure Registration</span>
          </div>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 md:p-12 mb-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Error Messages -->
          <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p class="text-green-400 text-sm">{{ successMessage }}</p>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-white font-semibold mb-3">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="your@email.com"
              required
              class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#0033ff] transition"
            />
            <p v-if="errors.email" class="text-red-400 text-sm mt-2">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-white font-semibold mb-3">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="At least 8 characters"
              required
              class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#0033ff] transition"
            />
            <p v-if="errors.password" class="text-red-400 text-sm mt-2">
              {{ errors.password }}
            </p>
            <p class="text-[#999999] text-sm mt-2">
              Must be at least 8 characters long
            </p>
          </div>

          <!-- Password Confirmation Field -->
          <div>
            <label for="confirmPassword" class="block text-white font-semibold mb-3">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Repeat your password"
              required
              class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#0033ff] transition"
            />
            <p v-if="errors.confirmPassword" class="text-red-400 text-sm mt-2">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Terms Agreement -->
          <div class="flex items-start gap-3">
            <input
              id="terms"
              v-model="formData.agreedToTerms"
              type="checkbox"
              required
              class="w-5 h-5 mt-1 accent-[#0033ff] cursor-pointer"
            />
            <label for="terms" class="text-[#999999] text-sm leading-relaxed cursor-pointer">
              I agree to the
              <a href="/terms" class="text-[#0033ff] hover:text-blue-400 transition">
                Terms of Service
              </a>
              and
              <a href="/privacy" class="text-[#0033ff] hover:text-blue-400 transition">
                Privacy Policy
              </a>
            </label>
          </div>
          <p v-if="errors.terms" class="text-red-400 text-sm -mt-4">
            {{ errors.terms }}
          </p>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <span v-if="!isLoading">Create Account</span>
            <span v-else>Creating Account...</span>
          </button>

          <!-- Divider -->
          <div class="relative flex items-center gap-4 my-8">
            <div class="flex-grow border-t border-[#333]"></div>
            <span class="text-[#999999] text-sm">Already have an account?</span>
            <div class="flex-grow border-t border-[#333]"></div>
          </div>

          <!-- Login Link -->
          <NuxtLink
            to="/login"
            class="block w-full text-center py-3 border border-[#0033ff] text-[#0033ff] rounded-lg font-semibold hover:bg-[#0033ff] hover:text-white transition"
          >
            Sign In Instead
          </NuxtLink>
        </form>
      </div>

      <!-- Info Section -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 text-left">
        <h2 class="text-xl font-bold text-white mb-6">Why Choose SiteSynth?</h2>

        <div class="space-y-4">
          <div class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 bg-[#0033ff] text-white rounded-full flex items-center justify-center font-bold text-sm"
            >
              ✓
            </span>
            <div>
              <p class="text-white font-semibold">
                Professional Websites in Minutes
              </p>
              <p class="text-[#999999] text-sm mt-1">
                No coding required. Create stunning sites instantly
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 bg-[#0033ff] text-white rounded-full flex items-center justify-center font-bold text-sm"
            >
              ✓
            </span>
            <div>
              <p class="text-white font-semibold">
                Fully Customizable
              </p>
              <p class="text-[#999999] text-sm mt-1">
                Tailor every aspect to match your brand
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 bg-[#0033ff] text-white rounded-full flex items-center justify-center font-bold text-sm"
            >
              ✓
            </span>
            <div>
              <p class="text-white font-semibold">
                Expert Support
              </p>
              <p class="text-[#999999] text-sm mt-1">
                Our team is here to help you succeed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'
import { useSupabaseAuth } from '@/composables/useSupabaseAuth'

const { register, isLoading: authLoading } = useSupabaseAuth()

const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  agreedToTerms: false,
})

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
})

const validateForm = (): boolean => {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.terms = ''

  let isValid = true

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    isValid = false
  }

  // Password confirmation
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  // Terms agreement
  if (!formData.agreedToTerms) {
    errors.terms = 'You must agree to the terms and privacy policy'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  error.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    const result = await register(formData.email, formData.password)

    if (result.success) {
      successMessage.value = 'Account created successfully! Redirecting to login...'
      // Reset form
      formData.email = ''
      formData.password = ''
      formData.confirmPassword = ''
      formData.agreedToTerms = false

      // Redirect to login or cabinet after a short delay
      setTimeout(() => {
        navigateTo('/cabinet')
      }, 1500)
    } else {
      error.value = result.error || 'Failed to create account. Please try again.'
    }
  } catch (err: any) {
    error.value = err.message || 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl

useSeoMeta({
  title: 'Register | SiteSynth',
  description: 'Create your SiteSynth account and start building professional websites instantly.',
  ogTitle: 'Register | SiteSynth',
  ogDescription: 'Join SiteSynth and create amazing websites.',
  ogImage: `${siteUrl}/assets/shareimage.png`,
})
</script>
