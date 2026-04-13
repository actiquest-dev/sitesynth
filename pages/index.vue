<template>
  <HeaderSection />

  <HeroIndex
    id="hero-index"
    title="AI-Curated. <span class='glow-text'>Tech Synthesis.</span>"
    subtitle="The first AI-curated dev studio in BeNeLux."
    backgroundImage="/assets/new-assets/test/sitesynth-animated-gradient-v2.svg"
    ctaText="Make Your Site"
    ctaHref="/pricing#pay-once-forever"
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
      {
        src: '/assets/Haesaers logo.svg',
        alt: 'Haesaers Logo',
        link: '',
        style: 'opacity: 0.6; height: 34px;',
      },
    ]"
  />

  <ClientOnly>
    <CountdownSection />
  </ClientOnly>

  <BannerSection id="banner-what-we-offer" tag="h2" text="Our Expertise" />

  <WhatWeOfferSection
    id="what-we-offer"
    :offers="[
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/brand-driven-product-strategy.svg',
        imageAlt: 'Brand Thinking',
        title: 'Brand-Led Product Thinking',
        description:
          'AI-curated product direction aligned with your brand voice, market context, and business goals.',
        link: '/brand-driven-product-strategy',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/ux-and-design-systems.svg',
        imageAlt: 'Design Systems',
        title: 'Design Systems & UX Architecture',
        description:
          'Curated UX flows and scalable design systems shaped by real usage data and team workflows.',
        link: '/ux-and-design-system',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/development-support.svg',
        imageAlt: 'Implementation Support',
        title: 'Full-Stack Implementation Support',
        description:
          'From prototype to production, we integrate the best-fit stack and build with clear technical ownership.',
        link: '/full-stack-implementation',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/ai-powered-workflows.svg',
        imageAlt: 'AI Innovation',
        title: 'AI-Infused Innovation & R&D',
        description:
          'We curate and operationalize AI tools that create measurable speed, quality, and product leverage.',
        link: '/ai-innovation',
      },
    ]"
  />

  <ProcessSection
    id="process-what-we-offer"
    imageClass=""
    imageAlt="Synth"
    :images="[
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Discover.webp',
        alt: 'Discover - Business Goals Analysis',
      },
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Define.webp',
        alt: 'Define - Challenge Clarification',
      },
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Design.webp',
        alt: 'Design - Systems and Flows',
      },
      {
        src: '/assets/new-assets/home-page/home/what-we-offer/Deliver.webp',
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
        link: '/brand-driven-product-strategy',
        linkText: 'How connect brand and product',
      },
      {
        title: '3. Design',
        description: 'Systems, visuals, and flows — always aligned.',
        link: '/ux-and-design-system',
        linkText: 'How we build design systems',
      },
      {
        title: '4. Deliver',
        description: 'Bringing designs to life with clarity and collaboration.',
        link: '/full-stack-implementation',
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
    glowEffect="GlowRed"
    leftPadding="pl-[4rem] pt-[2rem] md:pt-[0rem]"
    rightPadding=""
    gradientImage="/assets/gradients/gradient-for-banner-section-red.svg"
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
        src: '/assets/new-assets/home-page/home/cta/score-synth-feature-image.webp',
        alt: 'AI Development Process',
        class: 'w-full h-auto rounded-0',
      },
    }"
  />

<ConsultancySection
  id="why-sitesynth"
  sectionClass="bg-[#161616] py-0"
  title="Why SiteSynth?"
  description="Most consultancies resell the same tools at enterprise prices. We don't. We curate the right stack for your stage, integrate it cleanly, and stay accountable for outcomes — not slide decks."
  :leftTextElements="[
    { tag: 'h4', content: 'Curated, not repackaged' },
    {
      tag: 'p',
      content:
        'We combine proven technologies, custom logic, and clear ownership. You get a system that fits your product, your team, and your budget — without vendor theater.',
    },
  ]"
  :leftLink="{ href: '/about-us', text: 'Meet the team' }"
  typicalLabel="Typical Consultancy"
  siteSynthLabel="SiteSynth"
  defaultTab="typical"
  :typicalCards="[
    {
      iconSrc: '/assets/icons/other/info-circle.svg',
      title: 'One-Size-Fits-All',
      description: 'Same playbook, same stack, regardless of context.',
    },
    {
      iconSrc: '/assets/icons/other/info-circle.svg',
      title: 'Markup Over Value',
      description: 'Expensive tooling wrapped in process-heavy delivery.',
    },
    {
      iconSrc: '/assets/icons/other/info-circle.svg',
      title: 'Handoff Gaps',
      description: 'Strategy, design, and engineering disconnected across teams.',
    },
  ]"
  :siteSynthCards="[
    {
      iconSrc: '/assets/icons/other/tick-circle.svg',
      title: 'Curated Stack',
      description: 'Best-fit tools selected for your exact use case and growth stage.',
    },
    {
      iconSrc: '/assets/icons/other/tick-circle.svg',
      title: 'Value-First Delivery',
      description: 'Spend goes into execution and outcomes, not overhead.',
    },
    {
      iconSrc: '/assets/icons/other/tick-circle.svg',
      title: 'One Loop Ownership',
      description: 'Strategy, design, and build stay aligned from day one.',
    },
  ]"
/>

  <Testimonial
    id="testimonial-koen"
    imageSrc="/assets/new-assets/people-for-CTA/oval-koen.webp"
    personName="Koen Vergauwen"
    personTitle="Head of Growth"
    quoteTitle="Simplicity takes effort"
    quoteText="It takes real effort to cut through the noise and get to what matters. But that’s where momentum begins. At SiteSynth, we believe clarity is a competitive advantage. That’s why we work to make the complex simple — and the simple successful."
    ctaText="Get in touch"
    ctaLink="/contact-us"
    class="pb-32 pt-32"
  />

  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo"

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.home;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - Strategic Design & Development Company",
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.homePage(siteUrl)),
    },
  ],
});
</script>
