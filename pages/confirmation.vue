<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen flex items-center justify-center pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowGreen />
    <ParticleEffect />

    <!-- Success Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-70">
      <div
        class="absolute top-0 left-1/2 w-96 h-96 bg-green-500/30 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/3 left-1/4 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-2xl w-full mx-auto px-6 md:px-12 text-center">
      <!-- Success Icon -->
      <div class="mb-8 flex justify-center">
        <div
          class="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center animate-pulse"
        >
          <svg
            class="w-12 h-12 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <!-- Success Message -->
      <h1 class="text-5xl font-bold text-white mb-4">
        Order Confirmed!
      </h1>
      <p class="text-2xl text-[#999999] mb-12">
        Thank you for your purchase
      </p>

      <!-- Order Number -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12">
        <p class="text-[#999999] text-sm mb-2">Order Number:</p>
        <p class="text-2xl font-mono font-bold text-[#0033ff]">
          #{{ orderNumber }}
        </p>
      </div>

      <!-- Email Confirmation -->
      <div class="mb-12">
        <p class="text-[#999999] mb-2">Your confirmation has been sent to:</p>
        <p class="text-xl text-white font-semibold">{{ userEmail }}</p>
      </div>

      <!-- What's Next -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12 text-left">
        <h2 class="text-xl font-bold text-white mb-6">What's Next?</h2>

        <div class="space-y-6">
          <div class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 bg-[#0033ff] text-white rounded-full flex items-center justify-center font-bold"
            >
              1
            </span>
            <div>
              <p class="text-white font-semibold">
                Check your email for invoice and receipt
              </p>
              <p class="text-[#999999] text-sm mt-1">
                Look for our email within the next few minutes
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 bg-[#0033ff] text-white rounded-full flex items-center justify-center font-bold"
            >
              2
            </span>
            <div>
              <p class="text-white font-semibold">
                We'll start your project on {{ projectStartDate }}
              </p>
              <p class="text-[#999999] text-sm mt-1">
                Our team will kick off development right away
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <span
              class="flex-shrink-0 w-8 h-8 bg-[#0033ff] text-white rounded-full flex items-center justify-center font-bold"
            >
              3
            </span>
            <div>
              <p class="text-white font-semibold">
                You'll receive project kickoff details via email
              </p>
              <p class="text-[#999999] text-sm mt-1">
                Schedule, timeline, and next steps will be shared with you
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Questions Section -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12 text-left">
        <h2 class="text-xl font-bold text-white mb-6">Questions?</h2>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <span class="text-2xl">📧</span>
            <div>
              <p class="text-white font-semibold">Email us:</p>
              <a
                href="mailto:hello@sitesynth.com"
                class="text-[#0033ff] hover:text-blue-400 transition"
              >
                hello@sitesynth.com
              </a>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-2xl">💬</span>
            <div>
              <p class="text-white font-semibold">Schedule a call:</p>
              <a
                href="https://calendly.com/hello-sitesynth"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[#0033ff] hover:text-blue-400 transition text-sm"
              >
                Book a 30-minute consultation with our team
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Authorization Section -->
      <div class="bg-[#0033ff]/10 border border-[#0033ff] rounded-lg p-8 mb-8">
        <h3 class="text-xl font-bold text-white mb-2">Access Your Project</h3>
        <p class="text-[#999999] mb-6 text-sm">
          Sign in to view your project details, communicate with our team, and track progress
        </p>

        <!-- Google OAuth Button -->
        <button
          @click="signInWithGoogle"
          class="w-full px-6 py-3 bg-white text-[#161616] rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 mb-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <!-- Divider -->
        <div class="relative mb-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#333]"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-[#161616] text-[#999999]">or</span>
          </div>
        </div>

        <!-- Magic Link Section -->
        <div>
          <input
            v-model="loginEmail"
            type="email"
            placeholder="Enter your email"
            class="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder:text-[#666] focus:border-[#0033ff] focus:outline-none transition mb-3"
          />
          <button
            @click="sendMagicLink"
            :disabled="!loginEmail.value || isSendingMagic.value"
            class="w-full px-6 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {{ isSendingMagic ? 'Sending...' : 'Send Magic Link' }}
          </button>
        </div>
      </div>

      <!-- Trust Badge -->
      <div class="mt-16 pt-8 border-t border-[#333]">
        <div class="flex justify-center items-center gap-6 text-[#999999] text-sm flex-wrap">
          <div class="flex items-center gap-2">
            <span>🔒</span>
            <span>SSL Encrypted</span>
          </div>
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>Secure Payment</span>
          </div>
          <div class="flex items-center gap-2">
            <span>💳</span>
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";
import GlowGreen from "@/components/effects/GlowGreen.vue";
import { useCursorGlow } from "@/composables/useCursorGlow";

// Initialize cursor glow effect
useCursorGlow();

const paymentData = ref(null);
const loginEmail = ref('');
const isSendingMagic = ref(false);

// Google OAuth sign in
const signInWithGoogle = async () => {
  try {
    // Redirect to Google OAuth login page
    // This will be implemented with proper OAuth flow
    window.location.href = '/login?provider=google';
  } catch (error) {
    console.error('Google sign-in error:', error);
  }
};

// Magic link sign in
const sendMagicLink = async () => {
  if (!loginEmail.value) return;

  isSendingMagic.value = true;
  try {
    const response = await fetch('/api/auth/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail.value }),
    });

    if (response.ok) {
      console.log('✅ Magic link sent to', loginEmail.value);
      // Show success message
      alert(`Magic link sent to ${loginEmail.value}`);
      loginEmail.value = '';
    } else {
      throw new Error('Failed to send magic link');
    }
  } catch (error: any) {
    console.error('Magic link error:', error);
    alert('Failed to send magic link. Please try again.');
  } finally {
    isSendingMagic.value = false;
  }
};

// Load payment data from sessionStorage
onMounted(() => {
  try {
    const result = sessionStorage.getItem('paymentResult');
    if (result) {
      paymentData.value = JSON.parse(result);
      console.log('✅ Payment data loaded:', paymentData.value);
    }
  } catch (error) {
    console.warn('Could not load payment data:', error);
  }
});

const userEmail = computed(() => {
  return paymentData.value?.email || 'your@email.com';
});

const orderNumber = computed(() => {
  if (paymentData.value?.chargeId) {
    // Generate order number from charge ID
    return `SYNTH-2026-${paymentData.value.chargeId.substring(0, 6).toUpperCase()}`;
  }
  return 'SYNTH-2026-000000';
});

const projectStartDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});


// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl;

useSeoMeta({
  title: "Order Confirmed | SiteSynth",
  description:
    "Your SiteSynth order has been confirmed. We'll start your project right away!",
  ogTitle: "Order Confirmed | SiteSynth",
  ogDescription: "Your SiteSynth order has been confirmed.",
  ogImage: `${siteUrl}/assets/shareimage.png`,
});
</script>
