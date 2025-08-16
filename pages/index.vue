<template>
  <HeaderSection />
  <HeroIndex
    id="hero-index"
    title="No silos.<span class='glow-text'> Just synthesis.</span>"
    subtitle="Where product, brand, and tech finally align"
    backgroundImage="/assets/new-assets/home-page/home/hero-section/BGGradient.svg"
  />

  <Carousel
    id="carousel-logos"
    :images="[
      {
        src: '/assets/figma.png',
        alt: 'Figma Logo',
        link: 'https://www.figma.com/',
      },
      {
        src: '/assets/infosys.png',
        alt: 'Infosys Logo',
        link: 'https://www.infosys.com/',
      },
      {
        src: '/assets/mercedes.png',
        alt: 'Mercedes Logo',
        link: 'https://www.mercedes-benz.com/',
      },
      { src: '/assets/sap.png', alt: 'SAP Logo', link: 'https://www.sap.com/' },
      {
        src: '/assets/societe-generale.png',
        alt: 'Societe Generale Logo',
        link: 'https://www.societegenerale.com/',
      },
      {
        src: '/assets/spotify.png',
        alt: 'Spotify Logo',
        link: 'https://www.spotify.com/',
      },
      { src: '/assets/sap.png', alt: 'SAP Logo', link: 'https://www.sap.com/' },
      {
        src: '/assets/societe-generale.png',
        alt: 'Societe Generale Logo',
        link: 'https://www.societegenerale.com/',
      },
      {
        src: '/assets/spotify.png',
        alt: 'Spotify Logo',
        link: 'https://www.spotify.com/',
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
        link: '/full-stack-implementation-support/',
      },
      {
        imageSrc:
          '/assets/new-assets/home-page/home/cards/ai-powered-workflows.svg',
        imageAlt: 'AI Innovation',
        title: 'AI-Infused Innovation & R&D',
        description:
          'We bring forward-thinking, AI-powered tooling into the design and development process.',
        link: '/ai-infused-innovation/',
      },
    ]"
  />
  <ProcessSection
    id="process-what-we-offer"
    imageSrc="/assets/new-assets/home-page/home/what-we-offer/Discover.png"
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
      link: { href: '/scoresynth/', text: 'Discover more about our product' },
    }"
    :rightContent="{
      image: {
        src: '/assets/new-assets/home-page/home/cta/score-synth-feature-image.png',
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
    imageSrc="assets/koen.png"
    personName="Koen Vergauwen"
    personTitle="Head of Growth"
    quoteTitle="Simplicity takes effort"
    quoteText="It takes real effort to cut through the noise and get to what matters. But that’s where momentum begins. At SiteSynth, we believe clarity is a competitive advantage. That’s why we work to make the complex simple — and the simple successful."
    ctaText="Get in touch"
    ctaLink="#"
    class="pb-[8rem] pt-[8rem]"
  />
  <FooterSection />
</template>

<script setup>
// SEO Configuration for Home Page - Only override what's unique
useSeoMeta({
  // Override the default title with homepage-specific version
  title:
    "SiteSynth - No silos. Just synthesis. | Where Product, Brand & Tech Align",

  // Homepage-specific description
  description:
    "Where product, brand, and tech finally align. We help companies bridge strategy, design, and engineering to create digital products that scale.",

  // Homepage-specific keywords (extends the defaults)
  keywords:
    "strategic design, product development, brand strategy, full-stack development, design systems, AI innovation, UX design, web development, no silos synthesis",

  // Open Graph - Only the unique values
  ogTitle: "SiteSynth - No silos. Just synthesis.",
  ogDescription:
    "Where product, brand, and tech finally align. We help companies bridge strategy, design, and engineering to create digital products that scale.",
  ogImage: "https://synth-phi.vercel.app/assets/og-image-home.jpg",
  ogImageAlt: "SiteSynth - Strategic Design & Development Company",
  ogUrl: "https://synth-phi.vercel.app",

  // Twitter Card - Only the unique values
  twitterTitle: "SiteSynth - No silos. Just synthesis.",
  twitterDescription:
    "Where product, brand, and tech finally align. Strategic design & development company.",
  twitterImage: "https://synth-phi.vercel.app/assets/twitter-card-home.jpg",
  twitterImageAlt: "SiteSynth - Strategic Design & Development",

  // Page-specific canonical
  canonical: "https://synth-phi.vercel.app",
});

// No need for structured data here - it's now global in app.vue
</script>
