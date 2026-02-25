<template>
  <HeaderSection :darkBackground="true" />
<HeroFullstack
  id="hero-fullstack"
  backgroundImage="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/HeroPatternFullStuck-trim2x-white-slow.svg"
  title="Design without development is just a suggestion."
  description="We stay in — writing real code, collaborating in Git, and making sure everything works in production."
  buttonText="Let’s Build Together"
  backgroundColor="bg-[#DDDDDD]"
  buttonLink="#"
  :cards="[
    {
      title: 'Front-End Engineering',
      description: 'Beautiful, accessible, and fast interfaces built for real users.',
      link: '#banner-front-end',
      image:
        '/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/cards/card-front-end.svg',
    },
    {
      title: 'Back-End Engineering',
      description: 'Scalable, secure, and API-ready architecture.',
      link: '#banner-back-end',
      image:
        '/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/cards/card-back-end.svg',
    },
    {
      title: 'Integrated Dev Collaboration',
      description: 'We plug into your workflow, toolset, and priorities.',
      link: '#banner-integrated-dev-collaboration',
      image:
        '/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/cards/card-dev-collab.svg',
    },
  ]"
/>

  <BannerSection
    id="banner-front-end"
    text="Front-End Engineering"
    sectionClass="py-20 text-left bg-[#161616]"
    contentClass="text-white max-w-[1248px] px-6 mx-auto text-4xl"
  />
  <UnderstandBrandSection
    id="understand-front-end"
    imagePosition="h-full object-cover"
    bgColor="bg-[#DDDDDD]"
    contentBgColor="bg-[#161616]"
    textColor="text-white"
    leftTitle="⚙️ Production-Ready Engineering"
    leftDescription="From the very start, we write code that ships — scalable, modular, and built for long-term growth. We don’t hand off mockups. We deliver real product foundations."
    :tags="[
      'React',
      'Vue',
      'Git Collaboration',
      'Javascript/TypeScript Frameworks',
    ]"
    toolsTitle="🛠️ Tools we use:"
    :toolsList="[
      'Figma Dev Mode for visual–code alignment',
      'React, Vue, Next.js, Nuxt for frontend development',
      'GitHub / GitLab for version control & code reviews',
    ]"
    imageSrc="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/front-end.svg"
  />
  <TestimonialWhite
    id="testimonial-marco"
    imageSrc="/assets/new-assets/people-for-CTA/oval-marco.png"
    personName="Marco Maffei"
    personTitle="Full-Stack Engineer"
    quoteTitle="Ideas are cheap. Shipping is rare. We focus on the rare."
    quoteText="Anyone can brainstorm. We’re here to build — and get it live."
    ctaText="Get in touch"
    ctaLink="/contact-us"
    class="pb-[8rem] pt-[8rem]"
  />
  <BannerSection
    id="banner-back-end"
    text="Back-End Engineering"
    sectionClass="py-20 text-right bg-[#161616]"
    contentClass="text-white max-w-[1248px] px-6 mx-auto text-4xl"
  />
  <TranslateSection
    id="translate-back-end"
    imagePosition="object-cover"
    imageSrc="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/back-end-engineering-two.svg"
    imageAlt="Github code"
    bgColor="bg-[#DDDDDD]"
    textColor="text-white"
    contentBgColor="bg-[#161616]"
    mainTitle="🧩 Back-End Infrastructure You Can Trust"
    mainDescription="We build solid, secure, and flexible backends — tailored to your product’s logic. APIs, CMS, authentication, databases — all under control and ready to scale."
    toolsTitle="🛠️ Tools we use:"
    :links="[
      { text: 'Custom APIs', url: '#' },
      { text: 'Headless CMS', url: '#' },
      { text: 'Data Modeling', url: '#' },
      { text: 'Authentication & Roles', url: '#' },
    ]"
    :tools="[
      'Laravel, Symfony, Node.js, or Django',
      'MySQL, PostgreSQL, MongoDB for database architecture',
      'Whimsical or FigJam for early UX sketches and tone sliders',
      'REST & GraphQL API integrations',
    ]"
  />

  <BannerSection
    id="banner-integrated-dev-collaboration"
    text="Integrated Dev Collaboration"
    sectionClass="py-20 text-left bg-[#DDDDDD]"
    contentClass="text-[#161616] max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <UnderstandBrandSection
    id="understand-integrated-dev-collaboration"
    imagePosition="h-full object-cover"
    title="Integrated Dev Collaboration"
    bgColor="bg-[#DDDDDD]"
    leftTitle="🚀 Flexible Dev Partnership"
    leftDescription="We adapt to your team setup. Whether we lead the build or join your engineers, our focus stays the same: momentum, clean handoff, and smooth launches."
    :tags="[
      'Dev Handoff',
      'Embedded Support',
      'CI/CD Friendly',
      'Launch Assistance',
    ]"
    toolsTitle="🛠️ Tools we use:"
    :toolsList="[
      'Slack & Notion for async alignment',
      'GitHub Projects or Jira for sprints & tasks',
      'Stripe, Auth0, and 3rd-party APIs for integration work',
    ]"
    imageSrc="/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/align-across-teams.svg"
  />

  <BannerSection
    id="banner-what-you-get"
    text="What You Get"
    sectionClass="py-20 text-center bg-[#161616]"
    contentClass="text-[#DDDDDD] max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <WhatYouGetSection
  id="what-you-get"
  sectionClass="bg-[#161616] py-0"
  :blur="true"
  :cards="[
    {
      iconSrc: '/assets/icons/monitor-mobbile.svg',
      title: 'Production Front-End',
      description: 'Shippable UI built in React/Vue with accessibility and performance baked in.',
    },
    {
      iconSrc: '/assets/icons/code.svg',
      title: 'Scalable Back-End',
      description: 'Scalable APIs and services built with clean architecture, validation, and versioning.',
    },
    {
      iconSrc: '/assets/icons/key-square.svg',
      title: 'Auth & Permissions',
      description: 'Secure auth, roles, and permissions that match real business workflows exactly.',
    },
    {
      iconSrc: '/assets/icons/driver-2.svg',
      title: 'Data Foundations',
      description: 'Databases, migrations, and data models designed for growth and change safely.',
    },
    {
      iconSrc: '/assets/icons/flash.svg',
      title: 'CI/CD & Deployments',
      description: 'CI/CD pipelines, environments, and deployments set up for predictable, repeatable releases.',
    },
    {
      iconSrc: '/assets/icons/setting-2.svg',
      title: 'Maintainable Delivery',
      description: 'Testing, monitoring, and handoff docs so your team can maintain confidently.',
    },
  ]"
/>

  <WhiteSection
    id="white-section-get-started"
    bgImage="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/below-pattern.svg"
    class="pt-[8rem] pb-[8rem]"
    bgColor="bg-[#161616]"
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

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.fullStack;
useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - Full-Stack Implementation",
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.fullStackPage(siteUrl)),
    },
  ],
});
</script>
