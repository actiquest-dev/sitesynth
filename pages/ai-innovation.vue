<template>
    <HeaderSection />
    <HeroAi title="Everyone talks about AI.
We build with it."
        description="AI is transforming how teams design, build, and operate — but most companies don’t know where to start. We help you find the right use cases, test fast, and integrate AI meaningfully into your product or process."
        buttonText="Let’s Build Together" buttonLink="#" />
    <TwoColumnsDesign sectionBgColor="bg-[#DDDDDD]" leftColumnBgColor="bg-[#DDDDDD]" rightColumnBgColor="bg-[#161616]" textColorleft="text-[#161616]" textColorRight="text-white">
        <template #left>
            <h3 class="text-lg mb-2">WHY AI NOW?</h3>
            <h2 class="text-4xl font-bold mb-4">You don’t need an AI lab. You need traction.</h2>
        </template>

        <template #right>
            <p class="text-white font-bold mb-4">AI is transforming how teams design, build, and operate — but most companies don’t know where to start. We help you find the right use cases, test fast, and integrate AI meaningfully into your product or process.</p>
        </template>
    </TwoColumnsDesign>
    <TwoColumnsDesign sectionBgColor="" leftColumnBgColor="bg-[#191919]" rightColumnBgColor="bg-[#161616]" textColorleft="text-[#161616]" textColorRight="text-white">
        <template #left>
            <h2 class="text-4xl mb-2 text-white">84% 🪄</h2>
            <h2 class="text-4xl mb-2 text-white">of executives</h2>
            <p class="text-lg font-bold mb-4 text-white">say AI will give them a competitive advantage — but only 19% have adopted it at scale.</p>
            <p class="text-[#999999]"> — McKinsey Global AI Survey</p>
        </template>

        <template #right>
            <h2 class="text-4xl mb-2 text-white">5x 🚀</h2>
            <h2 class="text-4xl mb-2 text-white">faster</h2>
            <p class="text-lg font-bold mb-4 text-white">Companies that adopt AI early grow 50% faster in productivity and customer retention.</p>
            <p class="text-[#999999]">—  BCG AI at Scale Report</p>
        </template>
    </TwoColumnsDesign>
    <Testimonial imageSrc="/assets/miguel.png" personName="Miguel Aprossine " personTitle="AI & Web3 Visionary Partner"
        quoteTitle="AI isn’t here to replace your team"
        quoteText="We use AI to cut the noise, speed up workflows, and reveal smarter ways to build. It’s not about hype — it’s about helping real teams move faster with less friction."
        ctaText="Get in touch" ctaLink="#" class="pb-[8rem] pt-[8rem]" />
    <BannerSection sectionTitle="What We Offer" />
    <WhatWeOfferAi :cards="[
        { title: '🧭 AI Strategy & Use-Case Mapping', description: 'We identify where AI can add real value — across product, operations, or internal tooling. → Discovery workshops, automation audits, risk/benefit framing', link: '#' },
        { title: '🛠️ Rapid Prototyping with AI', description: 'We build proof-of-concepts using modern AI APIs and open-source tools. → GPT-4, Claude, local LLMs, RAG, LangChain, Whisper, vector search', link: '#' },
        { title: '🧪 Integrated AI in Product & Design', description: 'We embed AI into design workflows and product experiences — responsibly and at speed. → UX copy generation, AI-powered assistants, personalized content flows', link: '#' }
    ]" />
    <BannerSection sectionTitle="New AI product we are working on" />
    <TwoColumnSection class="pb-20" leftPadding="pl-[4rem]" rightPadding="" :leftContent="{
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
    <BannerSection sectionTitle="What You Get" />
    <Column class="pb-20" :columns="[
        {
            icon: '🧬',
            imageAlt: 'Brand Icon',
            title: 'Clear Brand Architecture',
            headerTag: 'h3',
            description: 'Atomic, flexible, and organized — built for scaling without clutter.'
        },
        {
            icon: '🗺️',
            title: 'User Journey Maps',
            headerTag: 'h3',
            description: 'Clear maps of how users move through your product — across all key journeys.'
        },
        {
            icon: '⚡',
            title: '🎯 Pattern Usage Guidelines',
            headerTag: 'h3',
            description: 'Know exactly when and how to use each pattern — no guessing, no inconsistency.'
        }
    ]" />
    <Column class="pb-20" :columns="[
        {
            icon: '📘 ',
            title: 'Design System Documentation',
            headerTag: 'h3',
            description: 'Everything documented and ready in Figma’s Dev Mode, Zeroheight, or your preferred platform.'
        },
        {
            icon: '🛠️',
            title: 'Practical, Living Docs',
            headerTag: 'h3',
            description: 'Practical, living docs that support day-to-day work — not just sit in a folder.'
        },
    ]" />
    
    <WhiteSection class="pb-[8rem]" title="Get Started Today"
        description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
        primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
    <FooterSection />
</template>
