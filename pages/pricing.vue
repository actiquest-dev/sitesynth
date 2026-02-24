<template>
  <HeaderSection />

  <!-- HERO SECTION WITH EFFECTS -->
  <section class="relative bg-[#161616] text-white overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24">
    <!-- Glow Effects -->
    <GlowBlue />
    <ParticleEffect />

    <div class="relative max-w-7xl mx-auto px-6 md:px-12">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-8">
          Simple, Transparent<br />
          <span
            class="bg-gradient-to-r from-[#0033ff] via-[#8D35FF] to-[#AA3733] bg-clip-text text-transparent"
          >
            Pricing
          </span>
        </h1>
        <p class="text-xl text-[#999999] max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your project. Scale up anytime as your
          needs grow.
        </p>
      </div>

      <!-- Tag Pills -->
      <div class="mt-10 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        <div
          v-for="tag in pricingTags"
          :key="tag"
          class="group tag-pill cursor-default rounded-full border-2 border-[#333] p-[2px] hover:border-[#0033ff] transition-all duration-300"
        >
          <div
            class="tag-pill-inner rounded-full bg-[#161616] px-4 py-2 text-sm font-medium text-white/80 group-hover:text-white transition-all"
          >
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRICING CARDS SECTION -->
  <section class="relative bg-[#161616] py-16 md:py-24">
    <!-- Background Gradients -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-[#0033ff]/30 to-transparent rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-[#8D35FF]/30 to-transparent rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 md:px-12">
      <h2 class="text-4xl md:text-5xl font-extrabold text-center text-white mb-20">
        Choose Your Plan
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <!-- Card Component -->
        <div
          v-for="card in pricingCards"
          :key="card.id"
          class="group relative bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#0033ff] transition-all duration-300 overflow-hidden h-full"
        >
          <!-- Glow on hover -->
          <div
            class="absolute inset-0 bg-gradient-to-br from-[#0033ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          ></div>

          <!-- Content -->
          <div class="relative z-10 p-8 flex flex-col h-full">
            <!-- Badge -->
            <div v-if="card.badge" class="mb-6">
              <span
                class="inline-block px-3 py-1 bg-[#AA3733] text-white text-xs font-semibold rounded"
              >
                {{ card.badge }}
              </span>
            </div>

            <!-- Title & Price -->
            <div class="mb-8">
              <h3 class="text-2xl font-bold text-white mb-3">{{ card.title }}</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-extrabold text-white">{{
                  card.price
                }}</span>
                <span v-if="card.period" class="text-[#999999]">{{
                  card.period
                }}</span>
              </div>
            </div>

            <!-- Features -->
            <div class="space-y-3 mb-10 flex-grow">
              <div v-for="feature in card.features" :key="feature" class="flex items-start gap-3">
                <svg
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-white text-sm">{{ feature }}</span>
              </div>
            </div>

            <!-- Divider & Delivery Time -->
            <div class="border-t border-[#333] py-4 mb-6">
              <p class="text-[#999999] text-sm">
                <span class="font-semibold text-white">{{ card.deliveryLabel }}:</span>
                {{ card.delivery }}
              </p>
            </div>

            <!-- CTA Button -->
            <NuxtLink
              :to="card.cta.href"
              :class="[
                'w-full px-6 py-3 text-center rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105',
                card.cta.className,
              ]"
            >
              {{ card.cta.text }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ SECTION -->
  <section class="relative bg-[#161616] py-16 md:py-24">
    <!-- Glow Effect -->
    <GlowRed />

    <div class="relative max-w-4xl mx-auto px-6 md:px-12">
      <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-16 text-center">
        Frequently Asked Questions
      </h2>

      <div class="space-y-4">
        <div
          v-for="(item, idx) in faqItems"
          :key="idx"
          class="group border border-[#333] rounded-lg overflow-hidden hover:border-[#0033ff] transition-colors duration-300"
        >
          <button
            @click="toggleFAQ(idx)"
            class="w-full px-6 py-4 flex items-center justify-between bg-[#1a1a1a] hover:bg-[#222] transition-colors text-left"
          >
            <span class="text-lg font-semibold text-white">{{ item.question }}</span>
            <svg
              :class="{
                'rotate-180': expandedFAQ === idx,
              }"
              class="w-5 h-5 text-[#0033ff] transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          <div
            v-if="expandedFAQ === idx"
            class="px-6 py-4 bg-[#161616] border-t border-[#333]"
          >
            <p class="text-[#999999] text-base leading-relaxed">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <FooterSection />
</template>

<script setup>
import { ref } from "vue";
import GlowBlue from "@/components/effects/GlowBlue.vue";
import GlowRed from "@/components/effects/GlowRed.vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const expandedFAQ = ref(null);

const pricingTags = [
  "No Setup Fees",
  "Flexible Scope",
  "Pay Once",
  "Quick Turnaround",
];

const pricingCards = [
  {
    id: "starter",
    title: "Starter",
    price: "€500",
    period: null,
    deliveryLabel: "Delivery",
    delivery: "5 days",
    features: [
      "Mobile Adaptation",
      "1 Page",
      "Plausible Analytics",
      "Vercel Deploy",
      "Contact Form",
    ],
    cta: {
      text: "Get Started",
      href: "/intake",
      className:
        "bg-[#0033ff] text-white hover:bg-blue-700 group-hover:shadow-lg group-hover:shadow-blue-500/50",
    },
  },
  {
    id: "growth",
    title: "Growth",
    price: "€900",
    period: null,
    deliveryLabel: "Delivery",
    delivery: "7 days",
    features: [
      "Decap CMS Integration",
      "Up to 5 Pages",
      "Everything from Starter",
      "+€100 per extra page",
    ],
    cta: {
      text: "Get Started",
      href: "/intake",
      className:
        "bg-[#0033ff] text-white hover:bg-blue-700 group-hover:shadow-lg group-hover:shadow-blue-500/50",
    },
  },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    period: "Pricing",
    badge: "Most Popular",
    deliveryLabel: "Timeline",
    delivery: "Custom",
    features: [
      "Custom Portal",
      "Webshop Integration",
      "Custom Plugins",
      "Dedicated Support",
    ],
    cta: {
      text: "Schedule a Call",
      href: "#",
      className:
        "bg-[#AA3733] text-white hover:bg-red-700 group-hover:shadow-lg group-hover:shadow-red-500/50",
    },
  },
  {
    id: "addons",
    title: "Add-ons",
    price: "From",
    period: "€49/mo",
    deliveryLabel: "Type",
    delivery: "Optional",
    features: [
      "Maintenance Pro €149/mo",
      "Domain & Setup €75",
      "Maintenance Basic €49/mo",
      "Customizable packages",
    ],
    cta: {
      text: "Add to Plan",
      href: "/intake",
      className:
        "border border-[#0033ff] text-[#0033ff] hover:bg-[#0033ff] hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/50",
    },
  },
];

const toggleFAQ = (idx) => {
  expandedFAQ.value = expandedFAQ.value === idx ? null : idx;
};

const faqItems = [
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, absolutely. You can upgrade or downgrade your plan at any time. If you upgrade, we'll prorate the costs. If you downgrade, the change takes effect at the end of your billing cycle.",
  },
  {
    question: "What if I need more pages?",
    answer:
      "Each additional page beyond your plan limit costs €100. You can add pages anytime, and we'll adjust your timeline accordingly. For bulk additions, contact us for custom pricing.",
  },
  {
    question: "Is hosting included?",
    answer:
      "Hosting is not included in the base plans. We recommend Vercel (which we integrate with) or another host. Maintenance plans include hosting options starting from €49/month.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day satisfaction guarantee. If you're not happy with our work, we'll refund your payment minus any third-party costs incurred.",
  },
  {
    question: "What's your support policy?",
    answer:
      "Starter and Growth plans include email support. Enterprise plans include priority support with a dedicated contact. Response times vary by plan.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "You can cancel your plan anytime. For ongoing maintenance plans, you can cancel with 30 days notice. No long-term contracts required.",
  },
];

// SEO
const siteUrl = useRuntimeConfig().public?.siteUrl;

useSeoMeta({
  title: "Pricing | SiteSynth",
  description:
    "Simple and transparent pricing for web design and development services. Choose from Starter, Growth, or Enterprise plans.",
  ogTitle: "Pricing | SiteSynth",
  ogDescription:
    "Simple and transparent pricing for web design and development services.",
  ogImage: `${siteUrl}/assets/shareimage.png`,
  twitterTitle: "Pricing | SiteSynth",
  twitterDescription: "Simple and transparent pricing for web services.",
});
</script>

<style scoped>
.tag-pill-inner {
  @apply transition-all duration-300;
}

.group:hover .tag-pill-inner {
  @apply bg-[#0033ff]/10;
}
</style>
