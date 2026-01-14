<template>
  <HeaderSection />
  <HeroBrand
    id="hero-brand"
    title="Build products that feel as good as they function."
    description="We begin by distilling your brand’s essence — tone, values, and purpose — into clear, strategic inputs."
    backgroundImage="/assets/new-assets/test/hero-pattern-animated-once.svg"
    readMore="Read more"
    buttonText="Do you know why?"
    buttonLink="#"
    :cards="[
      {
        icon: '🧭',
        title: 'Understand the Brand',
        description:
          'We begin by distilling your brand’s essence — tone, values, and purpose — into clear, strategic inputs.',
        link: '#understand-the-brand',
        image:
          '/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/cards/card-understand-brand.svg',
      },
      {
        icon: '🎨',
        title: 'Translate into Product Experience',
        description:
          'We map your brand into UX flows — ensuring every screen feels consistent.',
        link: '#translate-into-product',
        image:
          '/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/cards/card-product-brand.svg',
      },
      {
        icon: '🤝',
        title: 'Align Across Teams',
        description:
          'We work across product, design, and marketing — helping your teams speak the same language.',
        link: '#align-across-teams',
        image:
          '/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/cards/card-align-across-teams.svg',
      },
    ]"
  />

  <BannerSection
    id="understand-the-brand"
    text="Understand the Brand"
    sectionClass="py-20 text-left bg-[#DDDDDD]"
    contentClass="text-[#161616] max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <UnderstandBrandSection
    id="business"
    imagePosition="h-full object-cover"
    bgColor="bg-[#DDDDDD]"
    leftTitle="🧭 The compass of your business"
    leftDescription="We begin by distilling your brand’s essence — tone, values, and purpose — into clear, strategic inputs. Through focused workshops and stakeholder alignment, we translate abstract brand traits into usable creative and product direction."
    :tags="[
      'Brand Discovery Sessions',
      'Stakeholder Interviews',
      'Brand Audit',
      'Personality Mapping',
    ]"
    toolsTitle="🛠️ Tools we use:"
    :toolsList="[
      'Miro or FigJam for live collaboration',
      'Whimsical for brand attributes and tone sliders',
      'Optional pre-workshop surveys via Typeform or Google Forms',
    ]"
    imageSrc="/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/understand-brand.svg"
  />

  <Testimonial
    id="testimonial-mayya"
    imageSrc="/assets/new-assets/people-for-CTA/oval-mayya.png"
    personName="Mayya Aprosina"
    personTitle="CEO & Business Designer"
    quoteTitle="A clear why shapes everything that follows."
    quoteText="Understanding why your brand exists — beyond products or features — gives every decision direction. It’s the foundation for building digital experiences that feel aligned, intentional, and real."
    ctaText="Get in touch"
    ctaLink="/contact-us"
    class="pb-[8rem] pt-[8rem]"
  />

  <BannerSection
    id="translate-into-product"
    text="Translate into Product Experience"
    sectionClass="py-20 text-right bg-[#DDDDDD]"
    contentClass="text-[#161616] max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <TranslateSection
    imagePosition="h-full object-cover"
    imageSrc="/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/translate-into-product-experience.svg"
    imageAlt="Github code"
    mainTitle="🎨 Make your product speak, look, and feel like your brand."
    bgColor="bg-[#DDDDDD]"
    textColor="text-[#161616]"
    mainDescription="Here, we bring the brand to life inside the product — not just through visuals, but through behavior, interaction, and language."
    toolsTitle="🛠️ Tools we use:"
    :links="[
      { text: 'UX Tone Principles', url: '#' },
      { text: 'Messaging Frameworks', url: '#' },
      { text: 'Brand Audit', url: '#' },
      { text: 'Personality Mapping', url: '#' },
    ]"
    :tools="[
      'Figma for interface layout, flow mapping, and tone-infused design',
      'Google Docs for writing voice guides, microcopy, and messaging frameworks',
      'Whimsical or FigJam for early UX sketches and tone sliders',
      'Loom for sharing walkthroughs of concept direction and rationale',
    ]"
  />

  <BannerSection
    id="align-across-teams"
    text="Align Across Teams"
    sectionClass="py-20 text-left bg-[#161616]"
    contentClass="text-white max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <UnderstandBrandSection
    imagePosition="bottom-0 right-[-150px]"
    bgColor="bg-[#161616]"
    contentBgColor="bg-[#161616]"
    h2Color="text-[#DDDDDD]"
    textColor="text-[#DDDDDD]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    leftTitle="🤝 Turn strategy into shared understanding."
    leftDescription="Even the best strategy fails without alignment. We bring teams together — literally and strategically — so they move in sync."
    :tags="[
      'Cross-Functional Sessions',
      'Shared Documentation',
      'Brand Audit',
      'Project Management',
    ]"
    toolsTitle="🛠️ Tools we use:"
    :toolsList="[
      'Miro or FigJam for alignment workshops',
      'Notion for shared strategy docs',
      'Slack or Loom for async feedback',
      'Monday.com or Jira for team tracking',
    ]"
    imageSrc="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/dev-collaboration.svg"
  />
  <BannerSection text="What You Get" />
  <WhatYouGetSection
  id="what-you-get"
  :showTitle="false"
  sectionClass="bg-[#161616] pb-20 pt-0"
  :cards="[
    {
      icon: '/assets/icons/routing-2.svg',
      title: 'Strategic Foundation',
      description:
        'A clear product direction rooted in your brand’s purpose, promise, and personality — not just market trends or feature requests.',
    },
    {
      icon: '/assets/icons/messages.svg',
      title: 'Messaging Frameworks',
      description:
        'Positioning, voice, and messaging pillars your whole team can rally around — consistent across product, marketing, and sales.',
    },
    {
      icon: '/assets/icons/people.svg',
      title: 'Cross-Team Alignment',
      description:
        'Collaborative tools and rituals to keep design, product, and business stakeholders aligned — from kickoff to launch.',
    },
    {
      icon: '/assets/icons/judge.svg',
      title: 'Decision-Making Criteria',
      description:
        'Shared principles that help your team move faster — and know why they’re making the choices they are.',
    },
    {
      icon: '/assets/icons/box.svg',
      title: 'Actionable Product Architecture',
      description:
        'Feature roadmaps and IA built around real user needs and business priorities — not guesswork.',
    },
    {
      icon: '/assets/icons/task-square.svg',
      title: 'Delivery Blueprint',
      description:
        'A practical handoff package for build — specs, edge cases, acceptance criteria, and next steps your team can execute.',
    },
  ]"
/>

  <WhiteSection
    id="get-started-today"
    bgImage="/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/below-pattern.svg"
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
import { seoConfig, structuredData } from "~/config/seo";

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.brandStrategy;
useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "Brand-Driven Product Strategy - SiteSynth",
  twitterTitle: "Brand-Driven Product Strategy - SiteSynth",
  twitterDescription:
    "Translate your brand into product experiences that are consistent, scalable, and ready to ship.",
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.brandStrategyPage(siteUrl)),
    },
  ],
});
</script>
