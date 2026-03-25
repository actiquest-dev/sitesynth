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
        class="absolute bottom-0 right-0 w-96 h-96 bg-[#8D35FF]/25 rounded-full blur-3xl"
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
        <p class="text-2xl font-mono font-bold text-[#8D35FF]">
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
              class="flex-shrink-0 w-8 h-8 bg-[#8D35FF] text-white rounded-full flex items-center justify-center font-bold"
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
              class="flex-shrink-0 w-8 h-8 bg-[#8D35FF] text-white rounded-full flex items-center justify-center font-bold"
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
              class="flex-shrink-0 w-8 h-8 bg-[#8D35FF] text-white rounded-full flex items-center justify-center font-bold"
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
                class="text-[#8D35FF] hover:text-[#B78CFF] transition"
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
                class="text-[#8D35FF] hover:text-[#B78CFF] transition text-sm"
              >
                Book a 30-minute consultation with our team
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Authorization Section -->
      <div class="bg-[#8D35FF]/10 border border-[#8D35FF] rounded-lg p-8 mb-8">
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
          <div v-if="!codeStep">
            <!-- Step 1: Email Input -->
            <div>
              <label class="block text-white font-semibold mb-2">Email Address</label>
              <input
                v-model="emailInput"
                type="email"
                placeholder="your@email.com"
                class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#555] focus:border-[#8D35FF] focus:outline-none transition"
              />
            </div>

            <button
              @click="handleSendCode"
              :disabled="isLoading || !emailInput"
              class="w-full px-6 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-[#7B2EF0] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Sending...' : 'Send Verification Code' }}
            </button>
          </div>

          <div v-else>
            <!-- Step 2: Code Input -->
            <p class="text-[#999999] text-sm mb-3">Enter the 4-digit code sent to <span class="text-white font-semibold">{{ emailInput }}</span></p>
            
            <div>
              <label class="block text-white font-semibold mb-2">Verification Code</label>
              <input
                v-model="codeInput"
                type="text"
                placeholder="1234"
                maxlength="4"
                class="w-full px-4 py-3 bg-[#0f0f0f] border border-[#333] rounded-lg text-white placeholder-[#555] focus:border-[#8D35FF] focus:outline-none transition text-center text-2xl tracking-widest"
              />
            </div>

            <button
              @click="handleVerifyCode"
              :disabled="isLoading || !codeInput"
              class="w-full px-6 py-3 bg-[#8D35FF] text-white rounded-lg font-semibold hover:bg-[#7B2EF0] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Verifying...' : 'Access Your Account' }}
            </button>

            <button
              @click="handleBackToEmail"
              class="w-full px-6 py-3 border border-[#333] text-[#999999] rounded-lg font-semibold hover:border-[#8D35FF] hover:text-[#8D35FF] transition"
            >
              ← Use Different Email
            </button>
          </div>
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

// Initialize cursor glow effect
useCursorGlow();

const { handleGoogleSignIn } = useGoogleAuth();

const paymentData = ref(null);
const emailInput = ref('');
const codeInput = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const codeStep = ref(false);

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

// Handle sending verification code
const handleSendCode = async () => {
  if (!emailInput.value) {
    errorMessage.value = 'Please enter your email';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await fetch('/api/auth/send-magic-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: emailInput.value }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      errorMessage.value = result.error || 'Failed to send code. Please try again.';
      console.error('❌ Send code error:', result);
      return;
    }

    // Move to step 2
    codeStep.value = true;
    console.log('✅ Code sent to:', emailInput.value);

  } catch (error: any) {
    console.error('Send code error:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Handle verifying code
const handleVerifyCode = async () => {
  if (!codeInput.value) {
    errorMessage.value = 'Please enter the verification code';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    // ✅ Get claim token from localStorage if available (for anonymous chat linking)
    let claimToken = null;
    try {
      claimToken = localStorage.getItem('sitesynth_claim_token');
    } catch (e) {
      // localStorage might not be available
    }

    const requestBody: any = {
      email: emailInput.value.trim().toLowerCase(),
      code: codeInput.value.trim()
    };

    // ✅ Include claim token if available
    if (claimToken) {
      requestBody.claimToken = claimToken;
    }

    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      errorMessage.value = result.error || 'Invalid or expired code. Please try again.';
      console.error('❌ Verify code error:', result);
      return;
    }

    // ✅ Log conversation claiming result if applicable
    if (result.conversationClaimed) {
      console.log(`✅ Anonymous conversation claimed: ${result.conversationId}`);
    }

    // Store auth data
    const authToken = btoa(`${emailInput.value}:${Date.now()}`);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify({
      email: emailInput.value,
      provider: 'email',
      authenticatedAt: new Date().toISOString(),
    }));

    console.log('✅ Code verified, redirecting to cabinet');

    // Redirect to cabinet
    await navigateTo('/cabinet');
  } catch (error: any) {
    console.error('Verify code error:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Handle going back to email input
const handleBackToEmail = () => {
  codeStep.value = false;
  codeInput.value = '';
  errorMessage.value = '';
};

// Send payment confirmation email
const sendConfirmationEmail = async (paymentInfo: any) => {
  try {
    const orderNum = `SYNTH-2026-${paymentInfo.chargeId.substring(0, 6).toUpperCase()}`;
    
    // Calculate project start date
    const date = new Date();
    date.setDate(date.getDate() + 5);
    const startDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    const response = await fetch('/api/email/send-payment-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: paymentInfo.email,
        fullName: paymentInfo.fullName || 'Valued Customer',
        orderNumber: orderNum,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency || 'USD',
        paymentMethod: paymentInfo.paymentMethod || 'Credit Card',
        projectStartDate: startDate,
      }),
    });

    const result = await response.json();
    if (result.success) {
      console.log('✅ Confirmation email sent successfully');
    } else {
      console.warn('⚠️ Failed to send confirmation email:', result.error);
    }
  } catch (error: any) {
    console.error('Error sending confirmation email:', error);
  }
};

// Save order to Supabase
const saveOrderToSupabase = async (paymentInfo: any) => {
  try {
    const orderNum = `SYNTH-2026-${paymentInfo.chargeId.substring(0, 6).toUpperCase()}`;
    
    // Get form data from localStorage
    const formDataStr = localStorage.getItem('intakeFormData');
    const formData = formDataStr ? JSON.parse(formDataStr) : {};

    const response = await fetch('/api/orders/save-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: paymentInfo.email,
        fullName: paymentInfo.fullName,
        orderNumber: orderNum,
        chargeId: paymentInfo.chargeId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency || 'USD',
        paymentMethod: paymentInfo.paymentMethod,
        formData: formData,
      }),
    });

    const result = await response.json();
    if (result.success) {
      console.log('✅ Order saved to Supabase:', result.order);
    } else {
      console.warn('⚠️ Failed to save order:', result.error);
    }
  } catch (error: any) {
    console.error('Error saving order to Supabase:', error);
  }
};

// Load payment data from localStorage (persistent storage)
onMounted(() => {
  try {
    const result = localStorage.getItem('paymentResult');
    if (result) {
      paymentData.value = JSON.parse(result);
      console.log('✅ Payment data loaded:', paymentData.value);
      
      // Send confirmation email AND save to Supabase
      sendConfirmationEmail(paymentData.value);
      saveOrderToSupabase(paymentData.value);
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
