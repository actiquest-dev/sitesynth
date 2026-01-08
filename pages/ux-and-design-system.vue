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
      <div class="py-24 md:border-r border-[#636363] bg-[#161616] relative">
        <!-- градиент в нижнем левом углу -->
        <div
          class="absolute inset-0 pointer-events-none opacity-100 z-0"
          style="
            background-image: url('/assets/gradients/gradient_right_corner.svg');
            background-size: cover;
            background-position: bottom left;
            background-repeat: no-repeat;
          "
        ></div>

        <!-- контент поверх градиента -->
        <div class="relative z-10 max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h3 class="text-white text-lg mb-2">WHY YOU NEED FIGMA?</h3>
          <h2 class="text-white text-4xl font-bold mb-4">
            — design debt is real. So is handoff hell.
          </h2>
        </div>
      </div>
    </template>

    <template #right>
      <div class="py-24 bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <p class="text-white font-bold mb-4">
            When teams move fast without systems, the result is chaos:
            duplicated components, messy UX, endless revisions, and frustrated
            developers.
            <br />
            We fix that by putting structure where it matters - in the product’s
            foundation.
          </p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>

  <FigmaSection
    id="figma"
    title="Figma"
    h3="🧱 Design Systems That Scale"
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

  <TwoColumnsImagesOnly
    id="figma-screenshots"
    leftImgSrc="public/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-jam.svg"
    leftImgAlt="FigJam Screenshot"
    rightImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-dev-mode.svg"
    rightImgAlt="Figma Dev Mode Screenshot"
  />

  <TwoColumnsWithImages
    id="figma-ux-architecture"
    leftImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-logo-1.png"
    leftImgAlt="FigJam Logo"
    leftH2="FigJam"
    leftH3="🔀 UX Architecture That Makes Sense"
    leftP="From tokens to components to documentation - we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use - with optional dev integration via Zeroheight or Storybook."
    leftLearnMoreText="Learn more about FigJam"
    leftLearnMoreLink="https://www.figma.com/figjam/"
    rightImgSrc="/assets/new-assets/solutions-page/solutions/design-systems-and-ux-architecture/figma-logo-2.png"
    rightImgAlt="Figma Dev Mode Logo"
    rightH2="Figma Dev Mode"
    rightH3="🤝 Built for Real Teams, Not Just Slides"
    rightP="We design with engineers in mind - ensuring everything is structured, inspectable, and ready to build. Using Figma’s Dev Mode, we bridge the gap between design and development with clear tokens, component logic, and handoff details - no extra tools, no ambiguity."
    rightLearnMoreText="Learn more about Dev Mode"
    rightLearnMoreLink="https://www.figma.com/dev-mode/"
  />

  <BannerSection id="what-you-get" text="What You Get" />

  <Column
    id="what-you-get-columns"
    :columns="[
      {
        icon: '🧩',
        imageAlt: 'Brand Icon',
        title: 'Centralized Figma System',
        headerTag: 'h3',
        description:
          'Atomic, flexible, and organized - built for scaling without clutter.',
      },
      {
        icon: '🧭',
        title: 'UX Flow Diagrams & Interaction Logic',
        headerTag: 'h3',
        description:
          'Clear maps of how users move through your product - across all key journeys.',
      },
      {
        icon: '📐',
        title: 'Pattern Usage Guidelines',
        headerTag: 'h3',
        description:
          'Know exactly when and how to use each pattern - no guessing, no inconsistency.',
      },
    ]"
  />

  <Column
    id="what-you-get-docs"
    :columns="[
      {
        icon: '📚',
        title: 'Design System Documentation',
        headerTag: 'h3',
        description:
          'Everything documented and ready in Figma’s Dev Mode, Zeroheight, or your preferred platform.',
      },
      {
        icon: '🔄',
        title: 'Practical, Living Docs',
        headerTag: 'h3',
        description:
          'Practical, living docs that support day-to-day work - not just sit in a folder.',
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
