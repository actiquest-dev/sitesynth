<template>
  <HeaderSection />

  <HeroDesign
    id="hero-design"
    backgroundImage="/assets/new-assets/test/hero-pattern-flow-multi-clean.svg"
    title="Let’s start the design conversation in Figma."
    description="We’ll review structure, components, and UX flows, then suggest what to fix first to make it consistent and scalable."
  />

  <TwoColumnsDesign
    glowEffect="GlowEffect"
    id="why-figma"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-white"
    textColorRight="text-white"
  >
<template #left>
  <div class="relative overflow-hidden py-24 md:border-r border-[#636363] bg-[#161616]">
    <!-- gradient только в нижнем правом углу левой колонки -->
    <div
      class="absolute pointer-events-none z-0 opacity-100"
      style="
        right: -40px;
        bottom: -60px;
        width: clamp(320px, 38vw, 560px);
        height: clamp(320px, 38vw, 560px);
        background-image: url('/assets/gradients/gradient_right_corner.svg');
        background-repeat: no-repeat;
        background-position: bottom right;
        background-size: contain;
      "
    ></div>

    <!-- контент поверх фона -->
    <div class="relative z-10 max-w-[600px] ml-auto pr-12">
      <h2 class="text-white text-3xl sm:text-4xl mb-6 font-bold">
        Talk to our team.
      </h2>

      <h3 class="text-white text-xl font-semibold mb-3 mt-8">
        🧩 Start a custom project
      </h3>
      <p class="text-[#999999] text-sm leading-relaxed mb-6">
        Let's discuss how SiteSynth can help your company design scalable
        systems, ship faster, and elevate user experience.
      </p>

      <h3 class="text-white text-xl font-semibold mb-3 mt-8">
        🤝 Explore a partnership
      </h3>
      <p class="text-[#999999] text-sm leading-relaxed mb-12">
        Let's discuss how SiteSynth can help your company design scalable
        systems, ship faster, and elevate user experience.
      </p>

      <p class="text-[#999999] text-sm leading-relaxed mb-2">
        We're based in Belgium and work globally.
      </p>
      <p class="text-[#999999] text-sm leading-relaxed">
        Prefer email? Reach us at
        <a class="text-[#8CB0FF] hover:text-white transition" href="mailto:hello@sitesynth.com">
          hello@sitesynth.com
        </a>
      </p>
    </div>
  </div>
</template>

  </TwoColumnsDesign>

  <FigmaSection
    id="figma"
    title="Figma"
    h3="Design Systems That Scale"
    description="From tokens to components to documentation - we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use - with optional dev integration via Zeroheight or Storybook."
    imageSrc="/assets/figma.svg"
    imageAlt="Figma Logo"
    primaryText="Try Figma"
    primaryLink="https://www.figma.com/"
    secondaryText="Learn More"
    secondaryLink="https://www.figma.com/design-systems/"
  />

  <OneColumnImage
    id="figma-screen"
    centerImg="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-main-ui.svg"
    centerImgAlt="Figma Screen"
  />

   <TwoColumnsWithImages
    id="figma-ux-architecture"
    leftImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-logo-1.png"
    leftImgAlt="FigJam Logo"
    leftH2="FigJam"
    leftH3="UX Architecture That Makes Sense"
    leftP="From tokens to components to documentation - we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use - with optional dev integration via Zeroheight or Storybook."
    leftLearnMoreText="Learn more about FigJam"
    leftLearnMoreLink="https://www.figma.com/figjam/"
    rightImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-logo-2.png"
    rightImgAlt="Figma Dev Mode Logo"
    rightH2="Figma Dev Mode"
    rightH3="Built for Real Teams, Not Just Slides"
    rightP="We design with engineers in mind - ensuring everything is structured, inspectable, and ready to build. Using Figma’s Dev Mode, we bridge the gap between design and development with clear tokens, component logic, and handoff details - no extra tools, no ambiguity."
    rightLearnMoreText="Learn more about Dev Mode"
    rightLearnMoreLink="https://www.figma.com/dev-mode/"
  />

   <TwoColumnsImagesOnly
    id="figma-screenshots"
    leftImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-jam.svg"
    leftImgAlt="FigJam Screenshot"
    rightImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-dev-mode.svg"
    rightImgAlt="Figma Dev Mode Screenshot"
  />


  <BannerSection id="what-you-get" text="What You Get" />

  <WhatYouGetSection
  id="what-you-get"
  sectionClass="bg-[#161616] py-0"
  :blur="true"
  :cards="[
    {
      iconSrc: '/assets/icons/figma.svg',
      title: 'Figma System',
      description: 'Single source of truth for UI, tokens, and variants.',
    },
    {
      iconSrc: '/assets/icons/routing-2.svg',
      title: 'UX Flows',
      description: 'Journeys, states, and edge cases mapped clearly.',
    },
    {
      iconSrc: '/assets/icons/hierarchy-square-2.svg',
      title: 'Usage Rules',
      description: 'When to use patterns — with do/don’t examples.',
    },
    {
      iconSrc: '/assets/icons/document-code.svg',
      title: 'Dev Specs',
      description: 'Specs for spacing, states, and behavior — ready to build.',
    },
    {
      iconSrc: '/assets/icons/book.svg',
      title: 'System Docs',
      description: 'Naming, structure, and usage in Dev Mode or your tool.',
    },
    {
      iconSrc: '/assets/icons/messages.svg',
      title: 'Living Docs',
      description: 'Docs that stay updated: checklists, notes, decisions.',
    },
  ]"
/>

  <WhiteSection
    id="get-started-today"
    bgImage="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/below-pattern.svg"
    class="pt-[8rem] pb-[8rem]"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are - and scale with who you’re becoming."
    primaryText="Start a Project"
    primaryLink="/contact-us"
    secondaryText="Book a Call"
    secondaryLink="/contact-us"
  />

  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo";

const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.uxDesign;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - UX & Design Systems",
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.uxDesignPage(siteUrl)),
    },
  ],
});
</script>
