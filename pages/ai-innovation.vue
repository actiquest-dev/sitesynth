<template>
    <HeaderSection />
    <HeroAi title="Everyone talks about AI.
We build with it."
        description="AI is transforming how teams design, build, and operate — but most companies don’t know where to start. We help you find the right use cases, test fast, and integrate AI meaningfully into your product or process."
        buttonText="Let’s Build Together" buttonLink="#" />
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
    <AiToolSection />
    <WhatYouGetDesign title="What You Get" :items="[
        { icon: '✅', title: 'Strategy Brief', description: 'A clear overview of your AI opportunity areas, mapped to business and user goals.' },
        { icon: '✅', title: 'Working Prototype', description: 'A functional proof-of-concept — built fast with real tools, not just slides.' },
        { icon: '✅', title: 'UX Concept with AI in the Loop', description: 'Interactive flows or UI elements that show how AI enhances the experience.' },
        { icon: '✅', title: 'Technical Recommendations', description: 'Guidance on tooling, integration paths, and how to scale from prototype to product.' },
        { icon: '✅', title: 'Optional Scale Support', description: 'Need help shipping or evolving the idea? We stay involved if you want us.' }
    ]" />
    <StoriesSection storiesText="Check our successful stories" storiesLink="#"
        blogText="Read our blog to get more insights" blogLink="#" />
    <WhiteSection class="pb-[8rem]" title="Get Started Today"
        description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
        primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
    <FooterSection />
</template>
