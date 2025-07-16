<template>
    <HeaderSection />
    <HeroDesign backgroundImage="/assets/design-bg.svg" title="Design that’s consistent, scalable, and ready to ship."
        description="We build design systems and UX architecture that grow with your product — enabling your teams to move faster, stay on-brand, and deliver with confidence." />
    <TwoColumnsDesign sectionBgColor="bg-[#161616]" leftColumnBgColor="bg-[#161616]" rightColumnBgColor="bg-[#161616]">
        <template #left>
            <div class="px-6 py-24 md:pl-[10rem] md:pr-6 md:border-r border-[#636363]">
                <h3 class="text-white text-lg mb-2">WHY YOU NEED FIGMA?</h3>
                <h2 class="text-white text-4xl font-bold">Design debt is real. So is handoff hell..</h2>
            </div>
        </template>

        <template #right>
            <div class="px-6 py-24 md:pr-[10rem] md:pl-6">
                <p class="text-white text-[24px]">When teams move fast without systems, the result is chaos: duplicated components, messy UX, endless revisions, and frustrated developers.<br>We fix that by putting structure where it matters — in the product’s foundation.</p>
            </div>
        </template>
    </TwoColumnsDesign>
    <FigmaSection title="Figma" h3="🧱 Design Systems That Scale"
        description="From tokens to components to documentation — we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use — with optional dev integration via Zeroheight or Storybook."
        imageSrc="/assets/figma.svg" imageAlt="Figma Logo" primaryText="Try Figma" primaryLink="https://www.figma.com/"
        secondaryText="Learn More" secondaryLink="https://www.figma.com/design-systems/" />
    <OneColumnImage centerImg="/assets/figma-3.png" centerImgAlt="Figma Screen" />
    <TwoColumnsImagesOnly leftImgSrc="/assets/figma-2.png" leftImgAlt="FigJam Screenshot"
        rightImgSrc="/assets/figma-1.png" rightImgAlt="Figma Dev Mode Screenshot" />
    <TwoColumnsWithImages leftImgSrc="/assets/figma.svg" leftImgAlt="FigJam Logo" leftH2="FigJam"
        leftH3="🔀 UX Architecture That Makes Sense"
        leftP="From tokens to components to documentation — we build reusable, flexible design foundations that support your team’s workflow, not slow it down. Using Figma as the single source of truth, we create shared libraries, usage rules, and naming standards your team can actually use — with optional dev integration via Zeroheight or Storybook."
        leftLearnMoreText="Learn more about FigJam" leftLearnMoreLink="#" rightImgSrc="/assets/figma.svg"
        rightImgAlt="FigJam Logo" rightH2="Figma Dev Mode" rightH3="🤝 Built for Real Teams, Not Just Slides"
        rightP="We design with engineers in mind — ensuring everything is structured, inspectable, and ready to build. 
      
      Using Figma’s Dev Mode, we bridge the gap between design and development with clear tokens, component logic, and handoff details — no extra tools, no ambiguity." rightLearnMoreText="Learn more about Dev Mode"
        rightLearnMoreLink="#" />
    <BannerSection sectionTitle="What You Get" />
    <Column :columns="[
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
    <Column backgroundImage="/assets/design-bg.svg" :columns="[
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
    <WhiteSection bgImage="/assets/design-bg.svg" class="pt-[4rem] pb-[8rem]" title="Get Started Today"
        description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
        primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
    <FooterSection />
</template>
