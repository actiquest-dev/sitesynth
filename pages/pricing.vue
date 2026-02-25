<template>
  <HeaderSection />

  <!-- HERO SECTION WITH EFFECTS -->
  <section class="relative bg-[#161616] text-white overflow-hidden pb-16 md:pb-24 border-b border-[#636363]">
    <!-- Glow Effects -->
    <GlowBlue />
    <ParticleEffect />

    <div class="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32">
      <div class="text-center mb-12">
        <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight mb-8">
          Simple, Transparent<br />
          <span
            class="bg-gradient-to-r from-[#0033ff] via-[#8D35FF] to-[#AA3733] bg-clip-text text-transparent"
          >
            Pricing
          </span>
        </h1>
        <p class="text-base sm:text-lg text-[#d4d4d4] max-w-2xl mx-auto leading-relaxed">
          Choose the plan that fits your project. Scale up anytime as your
          needs grow.
        </p>
      </div>

      <!-- Tag Pills -->
      <div class="mt-10 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4 max-w-3xl mx-auto">
        <div
          v-for="(tag, index) in pricingTags"
          :key="tag.label"
          :style="{ '--i': index }"
          :class="[
            'group tag-pill cursor-default rounded-full border-[2px] p-[3px]',
            tag.strokeClass,
          ]"
        >
          <div
            class="tag-pill-inner rounded-full bg-[#161616] px-6 py-[6px] text-[15px] sm:px-12 sm:py-2 sm:text-lg font-medium text-white/90 transition-all duration-300 group-hover:bg-[#181818]"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>
    </div>
  </section>

  <BannerSection id="banner-pricing-plans" tag="h2" text="Choose Your Plan" />

  <!-- PRICING CARDS SECTION -->
  <section class="relative bg-[#161616] border-t border-b border-[#636363]">
    <div class="relative max-w-[1248px] mx-auto px-6">
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <!-- Card Component -->
        <div
          v-for="(card, index) in pricingCards"
          :key="card.id"
          class="group relative overflow-hidden z-0 bg-[#161616] hover:bg-white/5 transition-colors duration-300
                 border-l border-r border-[#636363]
                 px-8 py-8 md:px-6 md:py-9
                 border-b border-[#636363] first:border-t
                 md:border-b-0 md:first:border-t-0"
        >
          <GlowBlue />

          <!-- Gradient Background -->
          <div
            class="absolute inset-0 opacity-100 transition-opacity duration-300 pointer-events-none"
            :style="getPricingGradientStyle(index)"
          ></div>

          <!-- Content -->
          <div class="relative z-10 flex flex-col h-full">
            <!-- Title & Price -->
            <div class="mb-6">
              <div class="mb-3 h-7 flex items-start">
                <span
                  v-if="card.badge"
                  :class="[
                    'inline-flex items-center rounded-full px-2.5 py-1 text-white text-[11px] leading-none font-semibold whitespace-nowrap',
                    card.badgeClass || 'bg-[#AA3733]',
                  ]"
                >
                  {{ card.badge }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] leading-none font-semibold whitespace-nowrap opacity-0 select-none"
                >
                  Badge
                </span>
              </div>
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
            <div class="space-y-3 mb-7 flex-grow">
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
            <div class="border-t border-[#333] py-3 mb-5">
              <p class="text-[#999999] text-sm">
                <span class="font-semibold text-white">{{ card.deliveryLabel }}:</span>
                {{ card.delivery }}
              </p>
            </div>

            <!-- CTA Button -->
            <NuxtLink
              :to="card.cta.href"
              :class="[
                'w-full px-6 py-3 text-center rounded-none font-semibold transition-all duration-300 transform group-hover:scale-105 cta-hover',
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

  <BannerSection id="banner-pricing-faq" tag="h2" text="Frequently Asked Questions" />

  <!-- FAQ SECTION -->
  <section class="relative bg-[#161616] py-16 md:py-24 border-t border-b border-[#636363]">
    <!-- Glow Effect -->
    <GlowRed />

    <div class="relative max-w-4xl mx-auto px-6 md:px-12">
      <div class="space-y-4">
        <div
          v-for="(item, idx) in faqItems"
          :key="idx"
          class="group border border-[#333] overflow-hidden hover:border-[#8D35FF] transition-colors duration-300"
        >
          <button
            @click="toggleFAQ(idx)"
            class="w-full px-6 py-4 flex items-center justify-between bg-[#1a1a1a] hover:bg-[#202020] transition-colors text-left"
          >
            <span class="text-lg font-semibold text-white">{{ item.question }}</span>
            <svg
              :class="{
                'rotate-180': expandedFAQ === idx,
              }"
              class="w-5 h-5 text-[#8D35FF] transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
            :class="[
              'grid transition-all duration-300 ease-out',
              expandedFAQ === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
            ]"
          >
            <div class="overflow-hidden">
              <div class="px-6 py-4 bg-[#161616] border-t border-[#333]">
                <p class="text-[#999999] text-base leading-relaxed">
                  {{ item.answer }}
                </p>
              </div>
            </div>
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
  { label: "No Setup Fees", strokeClass: "stroke-blue" },
  { label: "Flexible Scope", strokeClass: "stroke-white" },
  { label: "Pay Once", strokeClass: "stroke-magenta" },
  { label: "Quick Turnaround", strokeClass: "stroke-purple" },
];

const pricingCards = [
  {
    id: "starter",
    title: "Starter",
    badge: "Best for your first launch",
    badgeClass: "bg-[#8D35FF]",
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
        "bg-[#8D35FF] text-white hover:bg-[#7B2EF0] group-hover:shadow-lg group-hover:shadow-[#8D35FF]/50",
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
        "bg-[#8D35FF] text-white hover:bg-[#7B2EF0] group-hover:shadow-lg group-hover:shadow-[#8D35FF]/50",
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
        "border border-[#8D35FF] text-[#8D35FF] hover:bg-[#8D35FF] hover:text-white group-hover:shadow-lg group-hover:shadow-[#8D35FF]/50",
    },
  },
];

const getPricingGradientStyle = (index) => {
  const gradients = [
    "url(/assets/gradients/gradient-bottom-left.svg)",
    "url(/assets/gradients/gradient-top-left.svg)",
    "url(/assets/gradients/gradient-bottom-right.svg)",
    "url(/assets/gradients/gradient-top-right.svg)",
  ];

  return {
    backgroundImage: gradients[index % 4],
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
};

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
.stroke-blue { border-color: #0900ff; border-style: solid; }
.stroke-purple { border-color: #7b38fc; border-style: solid; }
.stroke-magenta { border-color: #a620ff; border-style: solid; }
.stroke-white { border-color: #ffffff; border-style: solid; }

.tag-pill {
  border-radius: 9999px;
  transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

.tag-pill-inner {
  border-radius: 9999px;
  opacity: 0;
  transform: translateY(10px);
  transition: background-color 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
  animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards,
    softPulse 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 90ms);
}

.tag-pill:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 18px rgba(144, 144, 255, 0.32);
}

.tag-pill:hover .tag-pill-inner {
  background-color: #181818;
  box-shadow: 0 0 18px rgba(144, 144, 255, 0.32);
  transform: translateY(0);
}

@keyframes fadeUp {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes softPulse {
  0% { box-shadow: 0 0 0 rgba(144, 144, 255, 0); }
  50% { box-shadow: 0 0 14px rgba(144, 144, 255, 0.22); }
  100% { box-shadow: 0 0 0 rgba(144, 144, 255, 0); }
}
</style>
