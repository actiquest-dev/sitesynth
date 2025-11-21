<template>
  <HeaderSection />
  <HeroAi
    id="hero-ai"
    backgroundImage="/assets/HeroAi.svg"
    title="Everyone talks about AI. We build with it."
    description="AI is transforming how teams design, build, and operate — but most companies don’t know where to start. We help you find the right use cases, test fast, and integrate AI meaningfully into your product or process."
    buttonText="Let’s Build Together"
    buttonLink="#"
  />
  <TwoColumnsDesign
    id="info-ai"
    sectionBgColor="bg-[#DDDDDD]"
    leftColumnBgColor="bg-[#DDDDDD]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#DDDDDD]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h3 class="text-lg mb-2">WHY AI NOW?</h3>
          <h2 class="text-4xl font-bold mb-4">
            You don’t need an AI lab. You need traction.
          </h2>
        </div>
      </div>
    </template>

    <template #right>
      <div class="py-24 bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <p class="text-white font-bold mb-4">
            AI is transforming how teams design, build, and operate — but most
            companies don’t know where to start. We help you find the right use
            cases, test fast, and integrate AI meaningfully into your product or
            process.
          </p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>
  <TwoColumnsDesign
    id="stats-ai"
    sectionBgColor=""
    leftColumnBgColor="bg-[#191919]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#191919]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h2 class="text-4xl mb-2 text-white">84% 🪄</h2>
          <h2 class="text-4xl mb-2 text-white">of executives</h2>
          <p class="text-lg font-bold mb-4 text-white">
            say AI will give them a competitive advantage — but only 19% have
            adopted it at scale.
          </p>
          <p class="text-[#999999]">— McKinsey Global AI Survey</p>
        </div>
      </div>
    </template>

    <template #right>
      <div class="py-24 bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <h2 class="text-4xl mb-2 text-white">5x 🚀</h2>
          <h2 class="text-4xl mb-2 text-white">faster</h2>
          <p class="text-lg font-bold mb-4 text-white">
            Companies that adopt AI early grow 50% faster in productivity and
            customer retention.
          </p>
          <p class="text-[#999999]">— BCG AI at Scale Report</p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>
  <Testimonial
    id="testimonial-miguel"
    imageSrc="/assets/new-assets/people-for-CTA/Miguel.png"
    personName="Miguel Aprossine "
    personTitle="AI & Web3 Visionary Partner"
    quoteTitle="AI isn’t here to replace your team"
    quoteText="We use AI to cut the noise, speed up workflows, and reveal smarter ways to build. It’s not about hype — it’s about helping real teams move faster with less friction."
    ctaText="Get in touch"
    ctaLink="#"
    class="pt-[8rem]"
  />
  <BannerSection text="What We Offer" />
  <WhatWeOfferAi
    id="what-we-offer-ai"
    :cards="[
      {
        title: '🧭 AI Strategy & Use-Case Mapping',
        description:
          'We identify where AI can add real value — across product, operations, or internal tooling. → Discovery workshops, automation audits, risk/benefit framing',
        link: '#',
      },
      {
        title: '🛠️ Rapid Prototyping with AI',
        description:
          'We build proof-of-concepts using modern AI APIs and open-source tools. → GPT-4, Claude, local LLMs, RAG, LangChain, Whisper, vector search',
        link: '#',
      },
      {
        title: '🧪 Integrated AI in Product & Design',
        description:
          'We embed AI into design workflows and product experiences — responsibly and at speed. → UX copy generation, AI-powered assistants, personalized content flows',
        link: '#',
      },
    ]"
  />
  <BannerSection text="New AI product we are working on" />
  <TwoColumnSection
    id="membria"
    class="pb-20"
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
        href: 'https://membria.xyz/',
        target: '_blank',
        text: 'Discover more about our product',
      },
    }"
    :rightContent="{
      image: {
        src: '/assets/new-assets/solutions-page/solutions/ai-infused-innovation-and-rd/cta/MembriaImage.png',
        alt: 'Membria Screenshot',
        class: 'w-full h-auto rounded-lg',
      },
    }"
  />
  <BannerSection text="What You Get" />
  <Column
    id="what-you-get"
    class="pb-20"
    :columns="[
      {
        icon: '🧬',
        imageAlt: 'Brand Icon',
        title: 'Clear Brand Architecture',
        headerTag: 'h3',
        description:
          'Atomic, flexible, and organized — built for scaling without clutter.',
      },
      {
        icon: '🗺️',
        title: 'User Journey Maps',
        headerTag: 'h3',
        description:
          'Clear maps of how users move through your product — across all key journeys.',
      },
      {
        icon: '⚡',
        title: 'Pattern Usage Guidelines',
        headerTag: 'h3',
        description:
          'Know exactly when and how to use each pattern — no guessing, no inconsistency.',
      },
    ]"
  />
  <Column
    id="design-system"
    class="pb-20"
    :columns="[
      {
        icon: '📘 ',
        title: 'Design System Documentation',
        headerTag: 'h3',
        description:
          'Everything documented and ready in Figma’s Dev Mode, Zeroheight, or your preferred platform.',
      },
      {
        icon: '🛠️',
        title: 'Practical, Living Docs',
        headerTag: 'h3',
        description:
          'Practical, living docs that support day-to-day work — not just sit in a folder.',
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
    primaryLink="/contact-us"
    secondaryText="Book a Call"
    secondaryLink="/contact-us"
  />
  <FooterSection />
</template>

<script setup>
// SEO Configuration for AI Innovation page
const siteUrl = useRuntimeConfig().public?.siteUrl;
useSeoMeta({
  title: "AI Innovation & R&D - SiteSynth | AI-Powered Product Strategy",
  description:
    "We help teams discover high-impact AI use cases, prototype quickly, and integrate AI responsibly into products and workflows.",
  keywords:
    "ai strategy, ai innovation, rapid prototyping, r&d, llms, vector search, rag, ai product",

  ogTitle: "AI Innovation & R&D - SiteSynth",
  ogDescription:
    "Find the right AI opportunities, prototype fast, and embed AI into your product or process with clear value and responsible practices.",
  ogImage: `${siteUrl}/assets/og-image-home.jpg`,
  ogImageAlt: "SiteSynth - AI Innovation",
  ogUrl: `${siteUrl}/ai-innovation`,

  twitterTitle: "AI Innovation & R&D - SiteSynth",
  twitterDescription:
    "We identify AI opportunities and build prototypes to deliver measurable product and operational value.",
  twitterImage: `${siteUrl}/assets/twitter-card-home.jpg`,

  canonical: `${siteUrl}/ai-innovation`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "AI Innovation & R&D - SiteSynth",
        description:
          "We help teams identify high-impact AI opportunities, prototype rapidly, and integrate AI into products and operations with responsibility and speed.",
        url: `${siteUrl}/ai-innovation`,
      }),
    },
  ],
});
</script>
