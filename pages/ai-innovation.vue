<template>
  <HeaderSection />

  <HeroAi
    id="hero-ai"
    backgroundImage="/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/AIHeroPattern-flow-soft.svg"
    title="Everyone talks about AI. We build with it."
    description="AI is transforming how teams design, build, and operate — but most companies don’t know where to start. We help you find the right use cases, test fast, and integrate AI meaningfully into your product or process."
    buttonText="Let’s Build Together"
    buttonLink="#"
  />

  <!-- INFO -->
  <TwoColumnsDesign
    id="info-ai"
    sectionBgColor="bg-[#DDDDDD]"
    leftColumnBgColor="bg-[#DDDDDD]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#DDDDDD] relative">
        <div
          class="absolute inset-0 pointer-events-none opacity-100 z-0"
          style="
            background-image: url('/assets/gradients/gradient_right_corner.svg');
            background-size: cover;
            background-position: bottom left;
            background-repeat: no-repeat;
          "
        ></div>

        <div class="relative z-10 max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h3 class="text-sm font-semibold tracking-wider mb-2">WHY AI NOW?</h3>
          <h2 class="text-4xl font-bold mb-4">
            You don’t need an AI lab. You need traction.
          </h2>
        </div>
      </div>
    </template>

    <template #right>
      <div class="py-24 bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <p class="mb-4" style="color: #bbbbbb !important; font-weight: 400;">
            AI is transforming how teams design, build, and operate — but most
            companies don’t know where to start. We help you find the right use
            cases, test fast, and integrate AI meaningfully into your product or
            process.
          </p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>

  <!-- STATS (CountUp) -->
  <TwoColumnsDesign
    id="stats-ai"
    sectionBgColor=""
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h2 class="mb-2 text-white leading-none">
            <span class="text-6xl sm:text-7xl font-extrabold">
              <CountUp :end="84" suffix="%" :duration="900" />
            </span>
            <span class="text-3xl sm:text-4xl ml-3 align-middle">🪄</span>
          </h2>

          <h2 class="text-4xl font-bold mb-2 text-white">of executives</h2>

          <p class="text-base sm:text-lg font-normal mb-4 text-white leading-relaxed">
            say AI will give them a competitive advantage — but only 19% have
            adopted it at scale.
          </p>

          <p class="text-sm text-[#999999]">— McKinsey Global AI Survey</p>
        </div>
      </div>
    </template>

    <template #right>
      <div class="py-24 bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <h2 class="mb-2 text-white leading-none">
            <span class="text-6xl sm:text-7xl font-extrabold">
              <CountUp :end="5" suffix="x" :duration="900" />
            </span>
            <span class="text-3xl sm:text-4xl ml-3 align-middle">🚀</span>
          </h2>

          <h2 class="text-4xl font-bold mb-2 text-white">faster</h2>

          <p class="text-base sm:text-lg font-normal mb-4 text-white leading-relaxed">
            Companies that adopt AI early grow 50% faster in productivity and
            customer retention.
          </p>

          <p class="text-sm text-[#999999]">— BCG AI at Scale Report</p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>

  <Testimonial
    id="testimonial-miguel"
    imageSrc="/assets/new-assets/people-for-CTA/oval-miguel.png"
    personName="Miguel Aprossine "
    personTitle="AI & Web3 Visionary Partner"
    quoteTitle="AI isn’t here to replace your team"
    quoteText="We use AI to cut the noise, speed up workflows, and reveal smarter ways to build. It’s not about hype — it’s about helping real teams move faster with less friction."
    ctaText="Get in touch"
    ctaLink="#"
    class="pt-[8rem]"
  />

  <BannerSection text="What We Offer" />

   <!-- ✅ ЗАМЕНА Column -> FeatureCards (черные, без кнопки, с картинками) -->
  <FeatureCards
    id="what-you-get"
    sectionClass="bg-[#161616] pb-20"
    :showArrow="false"
    :cards="[
      {
        title: 'Clear Brand Architecture',
        description:
          'Atomic, flexible, and organized — built for scaling without clutter.',
        image:
          '/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/cards/card-ai-roadmap.svg',
        imageClass:
          'w-[420px] md:w-[460px] lg:w-[520px] translate-x-[18px] translate-y-[18px]',
      },
      {
           title: 'User Journey Maps',
        description:
          'Clear maps of how users move through your product — across all key journeys.',
        image:
          '/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/cards/card-team.svg',
        imageClass:
          'w-[420px] md:w-[460px] lg:w-[520px] translate-x-[18px] translate-y-[18px]',
      },
      {
        title: 'Pattern Usage Guidelines',
        description:
          'Know exactly when and how to use each pattern — no guessing, no inconsistency.',
        image:
          '/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/cards/card-prototyping.svg',
        imageClass:
          'w-[420px] md:w-[460px] lg:w-[520px] translate-x-[18px] translate-y-[18px]',
      },
    ]"
  />

  <BannerSection text="New AI product we are working on" />

  <TwoColumnSection
    id="membria"
    class="pb-20"
    sectionClass="bg-[#161616] py-0"
    leftPadding="pl-[4rem] pt-[2rem] md:pt-[0rem]"
    rightPadding=""
    :leftContent="{
      image: { src: '/assets/membria-logo.svg', alt: 'Membria Logo' },
      imageText: { tag: 'h3', content: 'Membria' },
      textElements: [
        { tag: 'h4', content: 'Knowledge Memory Layer' },
        {
          tag: 'p',
          content:
            'Membria builds a decentralized memory and reasoning layer for Tiny Language Models, enabling AI to learn, adapt, and grow smarter over time.',
        },
      ],
      link: {
        href: 'https://membria.ai/',
        target: '_blank',
        text: 'Discover more about our product',
      },
    }"
    :rightContent="{
      image: {
        src: '/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/cta/membria-image.webp',
        alt: 'Membria Screenshot',
        class: 'w-full h-auto rounded-0',
      },
    }"
  />

  <BannerSection text="What You Get" />
  
<WhatYouGetSection
  id="what-you-get"
  title="What You Get"
  :showTitle="true"
  sectionClass="bg-[#161616] py-0"
  :useBlur="true"
  :useVignette="true"
  :cards="[
    {
      iconSrc: '/assets/icons/task-square.svg',
      title: 'Use-Case Shortlist',
      description:
        'Shortlist high-impact AI opportunities with ROI, feasibility, and risks assessed.',
    },
    {
      iconSrc: '/assets/icons/eye.svg',
      title: 'Data Readiness Plan',
      description:
        'Audit data sources, access, quality, and governance before building anything.',
    },
    {
      iconSrc: '/assets/icons/code.svg',
      title: 'Prototype in Weeks',
      description:
        'Build a working prototype fast using your docs, tools, systems.',
    },
    {
      iconSrc: '/assets/icons/chart.svg',
      title: 'Evaluations & Benchmarks',
      description:
        'Define evals, test sets, and metrics to measure quality reliably.',
    },
    {
      iconSrc: '/assets/icons/shield-tick.svg',
      title: 'Guardrails & Compliance',
      description:
        'Add safety, privacy, and compliance guardrails for real-world deployment.',
    },
    {
      iconSrc: '/assets/icons/book.svg',
      title: 'Handoff & Enablement',
      description:
        'Ship with docs, training, and ownership so your team scales.',
    },
  ]"
/>


  <WhiteSection
    id="get-started-today"
    bgImage="/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/below-pattern.svg"
    class="pt-[8rem] pb-[8rem]"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project"
    primaryLink="/pricing"
    secondaryText="Book a Call"
    secondaryLink="/pricing"
  />

  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo";

// если Nuxt auto-import у тебя выключен, раскомментируй:
// import FeatureCards from "~/components/ui/FeatureCards.vue";

const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.aiInnovation;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - AI Innovation",
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.aiInnovationPage(siteUrl)),
    },
  ],
});
</script>

