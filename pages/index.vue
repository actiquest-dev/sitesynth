<template>
  <HeaderSection />
  <HeroIndex
    id="hero-index"
    title="No silos. <span class='glow-text'>Just synthesis.</span>"
    subtitle="Where product, brand, and tech finally align"
    backgroundImage="/assets/new-assets/home-page/home/hero-section/BGGradient.svg"
  />

  <Carousel
    id="carousel-logos"
    :images="[
      {
        src: '/assets/new-assets/home-page/home/clients-logo/BMIL.png',
        alt: 'BMI logo',
        link: 'https://www.bmileisure.com/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/CB.png',
        alt: 'CB logo',
        link: 'https://conceptbooth.com/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/baakn.png',
        alt: 'Baakn Logo',
        link: 'https://baakn.be/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/helan.png',
        alt: 'Helan Logo',
        link: 'https://www.helan.be/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/idalko.png',
        alt: 'idalko Logo',
        link: 'https://idalko.com/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/actiq.png',
        alt: 'Actiq Logo',
        link: 'https://www.actiq.xyz/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/cherchi.svg',
        alt: 'Cherchi Logo',
        link: 'https://www.cherchilaw.com/',
      },
      {
        src: '/assets/new-assets/home-page/home/clients-logo/tech-paw.svg',
        alt: 'Tech Paw Logo',
        link: 'https://www.tech-paw.com/',
      },
    ]"
  />
  <BannerSection id="banner-what-we-offer" tag="h2" text="What We Offer" />
  <WhatWeOfferSection
    id="what-we-offer"
    :offers="[
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/brand-driven-product-strategy.svg',
        imageAlt: 'Brand Thinking',
        title: 'Brand-Led Product Thinking',
        description:
          'We help you build digital products aligned with your brand voice and vision.',
        link: '/brand-driven-product-strategy/',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/ux-and-design-systems.svg',
        imageAlt: 'Design Systems',
        title: 'Design Systems & UX Architecture',
        description:
          'We craft scalable design systems and UX flows that bridge user needs and developer logic.',
        link: '/ux-and-design-system/',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/development-support.svg',
        imageAlt: 'Implementation Support',
        title: 'Full-Stack Implementation Support',
        description:
          'From prototypes to production, we collaborate closely with your dev team — or bring our own.',
        link: '/full-stack-implementation/',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/ai-powered-workflows.svg',
        imageAlt: 'AI Innovation',
        title: 'AI-Infused Innovation & R&D',
        description:
          'We bring forward-thinking, AI-powered tooling into the design and development process.',
        link: '/ai-innovation/',
      },
    ]"
  />
  <ProcessSection
    id="process-what-we-offer"
    imageClass=""
    imageAlt="Synth"
    :images="[
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Discover.png',
        alt: 'Discover - Business Goals Analysis',
      },
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Define.png',
        alt: 'Define - Challenge Clarification',
      },
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Design.png',
        alt: 'Design - Systems and Flows',
      },
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Deliver.png',
        alt: 'Deliver - Design Implementation',
      },
    ]"
    :sections="[
      {
        title: '1. Discover',
        description: 'We dive into your business goals, users, and context.',
        link: '/',
        linkText: 'Tell us your story first',
      },
      {
        title: '2. Define',
        description: 'We clarify the challenge and craft a shared direction.',
        link: '/brand-driven-product-strategy/',
        linkText: 'How connect brand and product',
      },
      {
        title: '3. Design',
        description: 'Systems, visuals, and flows — always aligned.',
        link: '/ux-and-design-system/',
        linkText: 'How we build design systems',
      },
      {
        title: '4. Deliver',
        description: 'Bringing designs to life with clarity and collaboration.',
        link: '/full-stack-implementation/',
        linkText: 'How we bring designs to life',
      },
    ]"
  />

  <BannerSection
    id="banner-new-ai-product"
    tag="h2"
    text="New AI product we are working on"
  />

  <TwoColumnSection
    id="two-column-score-synth"
    class="pb-20"
    leftPadding="pl-[4rem] pt-[2rem] md:pt-[0rem]"
    rightPadding=""
    :leftContent="{
      image: { src: '/assets/ScoreSynth.svg', alt: 'Innovation Icon' },
      imageText: { tag: 'h3', content: 'ScoreSynth' },
      textElements: [
        { tag: 'h4', content: 'From sound to score — in just a few steps.' },
        {
          tag: 'p',
          content:
            'We integrate cutting-edge AI tools to streamline your design and development process, reducing time-to-market while maintaining quality.',
        },
      ],
      link: { href: '/scoresynth', text: 'Discover more about our product' },
    }"
    :rightContent="{
      image: {
        src: 'assets/new-assets/home-page/home/cta/score-synth-feature-image.png',
        alt: 'AI Development Process',
        class: 'w-full h-auto rounded-lg',
      },
    }"
  />

  <ConsultancySection
    id="consultancy-typical"
    leftTitle="Typical Consultancy"
    :leftItems="[
      {
        icon: '🚫',
        title: 'One-Size-Fits-All',
        description: 'Rigid, prepackaged solutions applied to everyone.',
      },
      {
        icon: '🚫',
        title: 'Siloed & Fragmented',
        description: 'Tech, design, and marketing handled in isolation.',
      },
      {
        icon: '🚫',
        title: 'Slow & Overcomplicated',
        description:
          'Manual workflows, outdated tools, and complexity that wastes time — and your budget.',
      },
    ]"
    rightTitle="SiteSynth"
    :rightItems="[
      {
        icon: '✅',
        title: 'Custom by Design',
        description: 'Tailored strategies designed for your unique context.',
      },
      {
        icon: '✅',
        title: 'Seamless Collaboration',
        description:
          'We unify strategy, development, and branding — no silos, no handoff gaps.',
      },
      {
        icon: '✅',
        title: 'Agile & AI-Powered',
        description:
          'We use AI-powered tools to accelerate delivery, reduce cost, and stay ahead.',
      },
    ]"
  />
  <Testimonial
    id="testimonial-koen"
    imageSrc="/assets/new-assets/people-for-CTA/oval-koen.png"
    personName="Koen Vergauwen"
    personTitle="Head of Growth"
    quoteTitle="Simplicity takes effort"
    quoteText="It takes real effort to cut through the noise and get to what matters. But that’s where momentum begins. At SiteSynth, we believe clarity is a competitive advantage. That’s why we work to make the complex simple — and the simple successful."
    ctaText="Get in touch"
    ctaLink="contact-us"
    class="pb-32 pt-32"
  />
  <FooterSection />
</template>

<script setup>
import { seoConfig } from "~/config/seo";

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.home;
// Use siteUrl from runtime config for images and canonical links
useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - Strategic Design & Development Company",
  ogUrl: siteUrl,

  // Twitter Card - Only the unique values
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
  twitterImageAlt: "SiteSynth - Strategic Design & Development",

  // Page-specific canonical
  canonical: siteUrl,
});

// No need for structured data here - it's now global in app.vue
</script>
