<template>
  <HeaderSection />

  <!-- HERO -->
  <section class="relative bg-[#161616] text-white overflow-hidden group border-b border-[#333]">
    <GlowEffect class="absolute inset-0 z-0 pointer-events-none" />
    <ParticleEffect />
    <div class="relative z-10 max-w-[1248px] mx-auto px-6 pt-40 pb-24 text-center">
      <!-- Label -->
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#555] mb-8">A first in Belgium · Puurs-Sint-Amands</p>
      <!-- Heading -->
      <h1 class="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-white max-w-3xl mx-auto">
        We don't just use AI.<br />
        <span class="purple-glow">We curate it.</span>
      </h1>
      <!-- Sub -->
      <p class="mt-6 text-[#666] text-base max-w-lg mx-auto leading-relaxed">
        Belgium's first AI curator — we select, test, and orchestrate the right tools for every stage of product development. Every output reviewed, shaped, and owned by us.
      </p>
    </div>
  </section>

  <!-- OUR STORY — editorial split, all dark -->
  <section class="bg-[#161616] border-b border-[#333] relative overflow-hidden group">
    <GlowEffect class="absolute inset-0 z-0 pointer-events-none" />
    <div class="relative z-10 max-w-[1248px] mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-0 items-start">
      <!-- Left: label + big statement -->
      <div class="md:col-span-5 md:pr-16">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#555] mb-8">Why We Exist</p>
        <h2 class="text-white text-3xl md:text-4xl font-bold leading-snug">
          — We're a strategic bridge between brand, design, and engineering.
        </h2>
      </div>
      <!-- Vertical divider -->
      <div class="hidden md:block md:col-span-1 border-l border-[#333] self-stretch"></div>
      <!-- Right: body text -->
      <div class="md:col-span-6 md:pl-16 md:pt-14">
        <p class="text-[#999] text-base leading-relaxed mb-6">
          Rooted in effectiveness, openness, and craftsmanship. We're a small
          but dedicated team — designers, strategists, and full-stack
          developers — working in sync to deliver integrated solutions that
          break down silos and drive lasting impact.
        </p>
        <p class="text-[#999] text-base leading-relaxed">
          As Belgium's first AI curator, we don't hand clients a list of tools — we build the system around them. The right AI for the right task, orchestrated by humans who own every decision.
        </p>
      </div>
    </div>
  </section>

  <!-- VALUES — email card stack -->
  <section class="bg-[#0d0d0d] border-b border-[#222] py-24 md:py-32">
    <div class="max-w-[760px] mx-auto px-6">
      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#444] mb-16">Our Values</p>

      <div class="space-y-3">
        <div
          v-for="(v, i) in values"
          :key="i"
          :ref="el => { if (el) cardRefs[i] = el }"
          class="bg-[#111] border border-[#1e1e1e] p-7 md:p-10 value-card"
          :style="{
            transform: cardsVisible[i]
              ? cardTransforms[i]
              : cardTransforms[i] + ' translateY(40px)',
            opacity: cardsVisible[i] ? 1 : 0,
            transitionDelay: cardsVisible[i] ? (i * 100) + 'ms' : '0ms',
          }"
        >
          <!-- Chrome dots + date -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#222]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#222]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#222]"></span>
            </div>
            <span class="text-[11px] text-[#3a3a3a] font-mono">{{ v.date }}</span>
          </div>
          <!-- Author -->
          <div class="flex items-center gap-3 mb-8">
            <img
              :src="v.avatar"
              :alt="v.author"
              class="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <span class="text-[13px] text-[#888]">
              {{ v.author }}
              <span class="text-[#3a3a3a]">&lt;{{ v.email }}&gt;</span>
            </span>
          </div>
          <!-- Title -->
          <h3 class="text-white text-xl md:text-2xl font-bold mb-4 leading-snug">{{ v.title }}</h3>
          <!-- Body -->
          <p class="text-[#555] text-sm md:text-base leading-relaxed" v-html="v.body"></p>
        </div>
      </div>
    </div>
  </section>

  <!-- ABOUT US + PHOTO -->
  <TwoColumnsDesign
    sectionBgColor="bg-[#161616]"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#333] bg-[#161616]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#555] mb-8">Where We Are</p>
          <h2 class="text-white text-3xl sm:text-4xl font-bold mb-6">Puurs-Sint-Amands,<br />Belgium.</h2>
          <p class="text-[#999] text-base leading-relaxed mb-6">
            We're based in a small office within a beautifully restored historical building by the Schelde river. It's not flashy — but it's meaningful: rooted, quiet, and real.
          </p>
          <p class="text-[#999] text-base leading-relaxed">
            Strategically located between Antwerp, Brussels, and Ghent — easy reach of clients and collaborators across Europe, while keeping the clarity and calm that comes from a smaller place.
          </p>
        </div>
      </div>
    </template>
    <template #right>
      <div class="min-h-[400px] md:min-h-0">
        <img
          src="/assets/new-assets/company-page/about-us/team-about-us.webp"
          alt="SiteSynth office"
          class="h-full w-full object-cover"
          style="min-height: 400px;"
        />
      </div>
    </template>
  </TwoColumnsDesign>

  <!-- OUR LEADERS -->
  <LeadersSection :leaders="leaders" :id="'our-leaders'" />

  <!-- CALL TO ACTION -->
  <WhiteSection
    hover="#8D35FF"
    glowEffect="GlowEffect"
    id="get-started-today"
    class="pt-32 pb-32"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you're becoming."
    primaryText="Start a Project"
    primaryLink="/contact-us"
    secondaryText="Book a Call"
    secondaryLink="/contact-us"
  />

  <FooterSection />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const cardRefs = ref([]);
const cardsVisible = ref([false, false, false, false]);
let cardObservers = [];

onMounted(() => {
  cardRefs.value.forEach((el, i) => {
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        cardsVisible.value[i] = true;
        obs.disconnect();
      }
    }, { threshold: 0.12 });
    obs.observe(el);
    cardObservers.push(obs);
  });
});

onBeforeUnmount(() => cardObservers.forEach(o => o.disconnect()));

const cardTransforms = [
  'rotate(-1.8deg) translateX(12px)',
  'rotate(2.3deg) translateX(-6px)',
  'rotate(-1.2deg) translateX(28px)',
  'rotate(1.7deg) translateX(-14px)',
];

const values = [
  {
    author: "Mayya Aprosina",
    email: "mayya@sitesynth.com",
    avatar: "/assets/new-assets/people-for-CTA/oval-mayya.png",
    date: "Oct 2023",
    title: "Do work that inspires.",
    body: "You cannot inspire clients by doing an &ldquo;okay&rdquo; job. Quality is not a plus — it is a <strong class=\"text-[#aaa]\">must-have</strong>. We push the limits because the sum of all the <strong class=\"text-[#aaa]\">small details</strong> is what makes something truly special.",
  },
  {
    author: "Koen Vergauwen",
    email: "koen@sitesynth.com",
    avatar: "/assets/new-assets/people-for-CTA/oval-koen.png",
    date: "Jan 2024",
    title: "No ego.",
    body: "Helping others is part of the job. It is okay to say you do not know something and <strong class=\"text-[#aaa]\">ask for clarity</strong>. We work together, assume positive intent, and communicate in a kind, direct, and transparent way.",
  },
  {
    author: "Miguel Aprossine",
    email: "miguel@sitesynth.com",
    avatar: "/assets/new-assets/people-for-CTA/oval-miguel.png",
    date: "Mar 2024",
    title: "Build with AI — own every decision.",
    body: "AI lets us move faster and think further. But every output is <strong class=\"text-[#aaa]\">reviewed, shaped, and owned</strong> by us. We use tools to amplify our thinking, not replace it.",
  },
  {
    author: "Marco Maffei",
    email: "marco@sitesynth.com",
    avatar: "/assets/new-assets/people-for-CTA/oval-marco.png",
    date: "Jun 2024",
    title: "Ship clean, always.",
    body: "We document as we go. We test before we push. We care about the <strong class=\"text-[#aaa]\">spacing, the API response time, the edge case</strong>. When a project ends, your team can pick up from day one.",
  },
];

const leaders = [
  {
    name: "Mayya Aprosina",
    role: "Founder & CEO",
    image: "/assets/new-assets/company-page/about-us/our-team/Mayya Aprosina.png",
    description: "Leads SiteSynth's strategic direction and product vision. Connects brand, design, and engineering into one coherent story for clients.",
  },
  {
    name: "Miguel Aprossine",
    role: "AI & Web3 Visionary Partner",
    image: "/assets/new-assets/company-page/about-us/our-team/Miguel Aprossine.png",
    description: "Focuses on AI, Web3, and new business models. Helps clients explore emerging technologies without losing focus on real outcomes.",
  },
  {
    name: "Koen Vergauwen",
    role: "Head of Growth",
    image: "/assets/new-assets/company-page/about-us/our-team/Koen Vergauwen.png",
    description: "Works at the intersection of sales, strategy, and partnerships. Turns complex needs into clear, realistic engagement models.",
  },
  {
    name: "Marco Maffei",
    role: "Technology & Engineering Partner",
    image: "/assets/new-assets/company-page/about-us/our-team/Marco Maffei.png",
    description: "Owns the technical backbone of our projects. Bridges design intent with robust, scalable implementation.",
  },
];

import { seoConfig, structuredData } from "~/config/seo";

const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.about;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - Strategic Design & Development",
  twitterTitle: seo.ogTitle,
  twitterDescription: seo.ogDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.aboutPage(siteUrl)),
    },
  ],
});
</script>

<style scoped>
.purple-glow {
  color: #fff;
  text-shadow:
    0 0 30px rgba(141, 53, 255, 0.6),
    0 0 60px rgba(141, 53, 255, 0.3),
    0 0 100px rgba(141, 53, 255, 0.15);
}
.value-card {
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
              opacity 0.6s ease,
              box-shadow 0.35s ease;
}
.value-card:hover {
  transform: rotate(0deg) translateX(0px) translateY(0px) !important;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
}
</style>
