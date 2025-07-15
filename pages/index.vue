<template>
  <HeaderSection />
  <HeroIndex title="No silos. Just synthesis." subtitle="Where product, brand, and tech finally align" />
  <Carousel :images="[
    { src: '/assets/figma.png', alt: 'Figma Logo', link: 'https://www.figma.com/' },
    { src: '/assets/infosys.png', alt: 'Infosys Logo', link: 'https://www.infosys.com/' },
    { src: '/assets/mercedes.png', alt: 'Mercedes Logo', link: 'https://www.mercedes-benz.com/' },
    { src: '/assets/sap.png', alt: 'SAP Logo', link: 'https://www.sap.com/' },
    { src: '/assets/societe-generale.png', alt: 'Societe Generale Logo', link: 'https://www.societegenerale.com/' },
    { src: '/assets/spotify.png', alt: 'Spotify Logo', link: 'https://www.spotify.com/' },
    { src: '/assets/sap.png', alt: 'SAP Logo', link: 'https://www.sap.com/' },
    { src: '/assets/societe-generale.png', alt: 'Societe Generale Logo', link: 'https://www.societegenerale.com/' },
    { src: '/assets/spotify.png', alt: 'Spotify Logo', link: 'https://www.spotify.com/' }
  ]" />
  <BannerSection sectionTitle="What We Offer" />
  <WhatWeOfferSection :offers="[
    { imageSrc: '/assets/frame-1.svg', imageAlt: 'Brand Thinking', title: 'Brand-Led Product Thinking', description: 'We help you build digital products aligned with your brand voice and vision.', link: '#' },
    { imageSrc: '/assets/frame-2.svg', imageAlt: 'Design Systems', title: 'Design Systems & UX Architecture', description: 'We craft scalable design systems and UX flows that bridge user needs and developer logic.', link: '#' },
    { imageSrc: '/assets/frame-3.svg', imageAlt: 'Implementation Support', title: 'Full-Stack Implementation Support', description: 'From prototypes to production, we collaborate closely with your dev team — or bring our own.', link: '#' },
    { imageSrc: '/assets/frame-4.svg', imageAlt: 'AI Innovation', title: 'AI-Infused Innovation & R&D', description: 'We bring forward-thinking, AI-powered tooling into the design and development process.', link: '#' }
  ]" />
  <ProcessSection imageSrc="/assets/why-1.png" imageClass="px-10 py-10" imageAlt="Synth" :images="[
    { src: '/assets/why-1.png', alt: 'Discover - Business Goals Analysis' },
    { src: '/assets/2-what.png', alt: 'Define - Challenge Clarification' },
    { src: '/assets/how-3.png', alt: 'Design - Systems and Flows' },
    { src: '/assets/4-when.png', alt: 'Deliver - Design Implementation' }
  ]" :sections="[
      { title: 'Discover', description: 'We dive into your business goals, users, and context.', link: '#', linkText: 'Tell us your story first' },
      { title: 'Define', description: 'We clarify the challenge and craft a shared direction.', link: '#', linkText: 'How connect brand and product' },
      { title: 'Design', description: 'Systems, visuals, and flows — always aligned.', link: '#', linkText: 'How we build design systems' },
      { title: 'Deliver', description: 'Bringing designs to life with clarity and collaboration.', link: '#', linkText: 'How we bring designs to life' }
    ]" />

  <BannerSection sectionTitle="New AI product we are working on" />

  <TwoColumnSection class="pb-20" leftPadding="pl-[4rem] pt-[2rem] md:pt-[0rem]" rightPadding="" :leftContent="{
    image: { src: '/assets/ScoreSynth.svg', alt: 'Innovation Icon' },
    imageText: { tag: 'h3', content: 'ScoreSynth' },
    textElements: [
      { tag: 'h4', content: 'From sound to score — in just a few steps.' },
      { tag: 'p', content: 'We integrate cutting-edge AI tools to streamline your design and development process, reducing time-to-market while maintaining quality.' },
    ],
    link: { href: '#', text: 'Discover more about our product' }
  }" :rightContent="{
      image: { src: '/assets/music.png', alt: 'AI Development Process', class: 'w-full h-auto rounded-lg' }
    }" />

  <ConsultancySection leftTitle="Typical Consultancy" :leftItems="[
    { icon: '🚫', title: 'One-Size-Fits-All', description: 'Rigid, prepackaged solutions applied to everyone.' },
    { icon: '🚫', title: 'Siloed & Fragmented', description: 'Tech, design, and marketing handled in isolation.' },
    { icon: '🚫', title: 'Slow & Overcomplicated', description: 'Manual workflows, outdated tools, and complexity that wastes time — and your budget.' }
  ]" rightTitle="SiteSynth" :rightItems="[
    { icon: '✅', title: 'Custom by Design', description: 'Tailored strategies designed for your unique context.' },
    { icon: '✅', title: 'Seamless Collaboration', description: 'We unify strategy, development, and branding — no silos, no handoff gaps.' },
    { icon: '✅', title: 'Agile & AI-Powered', description: 'We use AI-powered tools to accelerate delivery, reduce cost, and stay ahead.' }
  ]" />
  <StoriesSection storiesText="Explore our latest case studies" storiesLink="#"
    blogText="Dive deeper into industry insights" blogLink="#" />
  <Testimonial imageSrc="assets/koen.png" personName="Koen Vergauwen" personTitle="Head of Growth"
    quoteTitle="Simplicity takes effort"
    quoteText="It takes real effort to cut through the noise and get to what matters. But that’s where momentum begins. At SiteSynth, we believe clarity is a competitive advantage. That’s why we work to make the complex simple — and the simple successful."
    ctaText="Get in touch" ctaLink="#" class="pb-[8rem]" />
  <FooterSection />
</template>