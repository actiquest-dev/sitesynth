<template>
  <HeaderSection />

  <section class="relative bg-[#161616] min-h-screen flex items-center justify-center pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
    <!-- Background Effects -->
    <ParticleEffect />

    <!-- Success Gradient Background -->
    <div class="absolute inset-0 pointer-events-none opacity-60">
      <div
        class="absolute top-0 left-1/2 w-96 h-96 bg-green-500/20 rounded-full blur-3xl transform -translate-x-1/2"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
        ✅ Order Confirmed!
      </h1>
      <p class="text-2xl text-[#999999] mb-12">
        Thank you for your purchase
      </p>

      <!-- Order Number -->
      <div class="bg-[#1a1a1a] border border-[#333] rounded-lg p-8 mb-12">
        <p class="text-[#999999] text-sm mb-2">Order Number:</p>
        <p class="text-2xl font-mono font-bold text-[#0033ff]">
          #SYNTH-2026-001234
        </p>
      </div>

      <!-- Email Confirmation -->
      <div class="mb-12">
        <p class="text-[#999999] mb-2">Your confirmation has been sent to:</p>
        <p class="text-xl text-white font-semibold">your@email.com</p>
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
              <p class="text-[#999999] text-sm">
                Book a 30-minute consultation with our team
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Share Section (Optional) -->
      <div class="mb-12">
        <p class="text-[#999999] mb-6">Share your excitement 🚀</p>
        <div class="flex gap-4 justify-center">
          <button
            @click="copyOrderLink"
            class="px-6 py-3 border border-[#0033ff] text-[#0033ff] rounded-lg font-semibold hover:bg-[#0033ff] hover:text-white transition"
          >
            Copy Link
          </button>

          <a
            href="https://twitter.com/intent/tweet?text=I%20just%20launched%20my%20project%20with%20SiteSynth%21%20%23web%20%23design&url=https://sitesynth.com"
            target="_blank"
            class="px-6 py-3 border border-[#1DA1F2] text-[#1DA1F2] rounded-lg font-semibold hover:bg-[#1DA1F2] hover:text-white transition"
          >
            Twitter
          </a>

          <a
            href="https://www.linkedin.com/sharing/share-offsite/?url=https://sitesynth.com"
            target="_blank"
            class="px-6 py-3 border border-[#0A66C2] text-[#0A66C2] rounded-lg font-semibold hover:bg-[#0A66C2] hover:text-white transition"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <!-- CTA Buttons -->
      <div class="space-y-4">
        <button
          @click="downloadInvoice"
          class="w-full md:w-auto px-8 py-3 border border-[#999999] text-[#999999] rounded-lg font-semibold hover:border-white hover:text-white transition"
        >
          📥 Download Invoice
        </button>

        <NuxtLink
          to="/"
          class="block md:inline-block px-8 py-3 bg-[#0033ff] text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Back to Home
        </NuxtLink>
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

<script setup>
import { ref, computed } from "vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const projectStartDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const copyOrderLink = () => {
  const link = `${window.location.origin}/?order=SYNTH-2026-001234`;
  navigator.clipboard.writeText(link);
  alert("Order link copied to clipboard!");
};

const downloadInvoice = () => {
  // Simulate invoice download
  alert("Invoice download started");
};

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
