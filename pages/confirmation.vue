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
            {{ isLoading ? 'Accessing...' : 'Send Magic Link' }}
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mt-4 p-4 bg-[#AA3733]/20 border border-[#AA3733] rounded-lg">
          <p class="text-[#AA3733] text-sm">{{ errorMessage }}</p>
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
import GoogleSignInButton from "@/components/auth/GoogleSignInButton.vue";
import { useCursorGlow } from "@/composables/useCursorGlow";
import { useGoogleAuth } from "@/composables/useGoogleAuth";
import { useNocoBase } from "@/composables/useNocoBase";

// Initialize cursor glow effect
useCursorGlow();

const { handleGoogleSignIn } = useGoogleAuth();
const { getList } = useNocoBase();

const paymentData = ref(null);
const emailInput = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const config = useRuntimeConfig();
const googleClientId = computed(() => config.public?.googleClientId || '');

// Handle Google Sign-In response
const handleGoogleResponse = async (response: any) => {
  errorMessage.value = '';
  try {
    const success = await handleGoogleSignIn(response);
    if (success) {
      console.log('✅ Google Sign-In successful, redirecting...');
      await navigateTo('/cabinet');
    } else {
      errorMessage.value = 'Google Sign-In failed. Please try again.';
    }
  } catch (err: any) {
    console.error('Google Sign-In error:', err);
    errorMessage.value = err.message || 'Google Sign-In failed. Please try again.';
  }
};

// Handle Email-based Login
const handleEmailLogin = async () => {
  if (!emailInput.value) {
    errorMessage.value = 'Please enter your email';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Check if email exists in NocoBase orders
    const allOrders = await getList('orders');
    const userOrders = allOrders.filter((order: any) => {
      const formData = typeof order.form_data === 'string'
        ? JSON.parse(order.form_data)
        : order.form_data;
      return formData?.email === emailInput.value || order.email === emailInput.value;
    });

    if (userOrders.length === 0) {
      errorMessage.value = 'No orders found for this email. Please complete your intake form first.';
      return;
    }

    // Create simple auth token
    const authToken = Buffer.from(`${emailInput.value}:${Date.now()}`).toString('base64');

    // Store in localStorage
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify({
      email: emailInput.value,
      provider: 'email',
      authenticatedAt: new Date().toISOString(),
    }));

    console.log('✅ Email login successful');

    // Redirect to cabinet
    await navigateTo('/cabinet');
  } catch (error: any) {
    console.error('Email login error:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
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
