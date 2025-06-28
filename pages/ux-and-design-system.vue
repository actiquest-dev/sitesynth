<template>
    <HeaderSection />
    <HeroDesign title="Design that’s consistent, scalable, and ready to ship."
        description="We build design systems and UX architecture that grow with your product — enabling your teams to move faster, stay on-brand, and deliver with confidence." />
    <TwoColumnsDesign leftTitle="Design debt is real. So is handoff hell."
        rightParagraph="When teams move fast without systems, the result is chaos: duplicated components, messy UX, endless revisions, and frustrated developers. We fix that by putting structure where it matters — in the product’s foundation." />
    <FigmaSection title="Figma" h3="🧱 Design Systems That Scale"
        description="From tokens to components to documentation — we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use — with optional dev integration via Zeroheight or Storybook."
        imageSrc="/assets/figma.svg" imageAlt="Figma Logo" primaryText="Try Figma"
        primaryLink="https://www.figma.com/" secondaryText="Learn More"
        secondaryLink="https://www.figma.com/design-systems/" />
    <OneColumnImage centerImg="/assets/figma-screen.png" centerImgAlt="Figma Screen" />
    <TwoColumnsImagesOnly leftImgSrc="/assets/figma-jam.png" leftImgAlt="FigJam Screenshot"
        rightImgSrc="/assets/figma-dev.png" rightImgAlt="Figma Dev Mode Screenshot" />
    <TwoColumnsWithImages leftImgSrc="/assets/figma.svg" leftImgAlt="FigJam Logo" leftH2="FigJam"
        leftH3="🔀 UX Architecture That Makes Sense"
        leftP="From tokens to components to documentation — we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use — with optional dev integration via Zeroheight or Storybook."
        leftLearnMoreText="Learn more about FigJam" leftLearnMoreLink="#" rightImgSrc="/assets/figma.svg"
        rightImgAlt="FigJam Logo" rightH2="Figma Dev Mode" rightH3="🤝 Built for Real Teams, Not Just Slides"
        rightP="We design with engineers in mind — ensuring everything is structured, inspectable, and ready to build. 
      
      Using Figma’s Dev Mode, we bridge the gap between design and development with clear tokens, component logic, and handoff details — no extra tools, no ambiguity." rightLearnMoreText="Learn more about Dev Mode"
        rightLearnMoreLink="#" />
    <WhatYouGetDesign title="What You Get" :items="[
        { icon: '✅', title: 'Centralized Figma System', description: 'Atomic, flexible, and organized — built for scaling without clutter.' },
        { icon: '✅', title: 'UX Flow Diagrams & Interaction Logic', description: 'Clear maps of how users move through your product — across all key journeys.' },
        { icon: '✅', title: 'Component Behavior & Usage Guidelines', description: 'Know exactly when and how to use each pattern — no guessing, no inconsistency.' },
        { icon: '✅', title: 'Dev Handoff Specs or Tool Integration', description: 'Everything documented and ready in Figma’s Dev Mode, Zeroheight, or your preferred platform.' },
        { icon: '✅', title: 'Documentation Your Team Will Actually Use', description: 'Practical, living docs that support day-to-day work — not just sit in a folder.' }
    ]" />
    <StoriesSection storiesText="Check our successful stories" storiesLink="#"
        blogText="Read our blog to get more insights" blogLink="#" />
    <WhiteSection class="pb-[8rem]" title="Get Started Today"
        description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
        primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
    <FooterSection />
</template>
