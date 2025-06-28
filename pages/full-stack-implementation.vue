<template>
    <HeaderSection />
    <HeroFullstack title="Design without development is just a suggestion."
        description="We stay in — writing real code, collaborating in Git, and making sure everything works in production."
        buttonText="Let’s Build Together" backgroundColor="bg-[#DDDDDD]" buttonLink="#" :cards="[
            { icon: '⚛️', title: 'Front-End Engineering', description: 'Beautiful, accessible, and fast interfaces built for real users.', link: '#' },
            { icon: '🌐', title: 'Back-End Engineering', description: 'Scalable, secure, and API-ready architecture.', link: '#' },
            { icon: '🤝', title: 'Integrated Dev Collaboration', description: 'We plug into your workflow, toolset, and priorities.', link: '#' }
        ]" />
    <ProcessSectionFull imageSrc="/assets/typescript.png" imageAlt="Synth" :sections="[
        { title: 'Plan', description: 'We define the scope, tech stack, timelines, and responsibilities — whether we’re integrating with your devs or bringing our own team.' },
        { title: 'Build', description: 'We write clean, scalable front-end and back-end code. You’ll get regular check-ins, working versions, and full transparency.' },
        { title: ' QA & Handoff', description: 'We test thoroughly and deliver code that’s documented, Git-integrated, and production-ready — no handoff headaches.' },
        { title: 'Support', description: 'Need to launch, iterate, or scale after delivery? We stay available for rollouts, fixes, or continued collaboration.' }
    ]" />
    <UnderstandBrandSection title="Front-End Engineering" bgColor="bg-[#DDDDDD]" contentBgColor="bg-[#161616]"
        textColor="text-white" leftTitle="⚙️ Production-Ready Engineering"
        leftDescription="From the very start, we write code that ships — scalable, modular, and built for long-term growth. We don’t hand off mockups. We deliver real product foundations."
        :tags="[
            'React',
            'Vue',
            'Git Collaboration',
            'Javascript/TypeScript Frameworks'
        ]" toolsTitle="🛠️ Tools we use:"
        :toolsList="[
        'Figma Dev Mode for visual–code alignment',
        'React, Vue, Next.js, Nuxt for frontend development',
        'GitHub / GitLab for version control & code reviews'
    ]" imageSrc="/assets/git-1.png" />
    <TestimonialWhite imageSrc="/assets/marco.png" personName="Marco Maffei" personTitle="Full-Stack Engineer"
        quoteTitle="Ideas are cheap. Shipping is rare. We focus on the rare."
        quoteText="Anyone can brainstorm. We’re here to build — and get it live." ctaText="Get in touch" ctaLink="#"
        class="pb-[8rem] pt-[8rem]" />
    <TranslateSection sectionTitle="Back-End Engineering" imageSrc="/assets/git-2.png" imageAlt="Github code" bgColor="bg-[#DDDDDD]" textColor="text-white" contentBgColor="bg-[#161616]"
        mainTitle="🧩 Back-End Infrastructure You Can Trust"
        mainDescription="We build solid, secure, and flexible backends — tailored to your product’s logic. APIs, CMS, authentication, databases — all under control and ready to scale."
        toolsTitle="🛠️ Tools we use:" :links="[
            { text: 'Custom APIs', url: '#' },
            { text: 'Headless CMS', url: '#' },
            { text: 'Data Modeling', url: '#' },
            { text: 'Authentication & Roles', url: '#' }
        ]" :tools="[
            'Laravel, Symfony, Node.js, or Django',
            'MySQL, PostgreSQL, MongoDB for database architecture',
            'Whimsical or FigJam for early UX sketches and tone sliders',
            'REST & GraphQL API integrations'
        ]" />
    <UnderstandBrandSection title="Integrated Dev Collaboration" bgColor="bg-[#DDDDDD]"
        leftTitle="🚀 Flexible Dev Partnership"
        leftDescription="We adapt to your team setup. Whether we lead the build or join your engineers, our focus stays the same: momentum, clean handoff, and smooth launches."
        :tags="[
            'Dev Handoff',
            'Embedded Support',
            'CI/CD Friendly',
            'Launch Assistance'
        ]" imageSrc="/assets/git-1.png" />

    <WhatYouGetDesign title="What You Get" bgColor="bg-[#DDDDDD]" bgDivider="bg-[#161616]"
    :items="[
        { icon: '✅', title: 'Full-Stack Product Implementation', description: 'Front-end and back-end development — aligned with your design, ready for production.' },
        { icon: '✅', title: 'Reusable Components + Clean Codebase', description: 'Modular, scalable code that’s easy to maintain and build on — not a mess of one-off hacks.' },
        { icon: '✅', title: 'Figma → Dev Mode → Git Alignment', description: 'We bridge the gap between design and code with smooth handoff, shared language, and no surprises.' },
        { icon: '✅', title: 'QA-Tested and Documented Delivery', description: 'Tested for performance, accessibility, and reliability — with clean documentation and commit history.' },
        { icon: '✅', title: 'Optional Post-Launch Support', description: 'Need iteration, rollout support, or fixes? We’re ready to stay involved after handoff.' }
    ]" />
    <StoriesSection bgColor="bg-[#dddddd]" textColor="text-[#2D68E8]" storiesText="Check our successful stories" storiesLink="#"
        blogText="Read our blog to get more insights" blogLink="#" />
    <WhiteSection class="pb-[8rem]" bgColor="bg-[#DDDDDD]" title="Get Started Today"
        description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
        primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
    <FooterSection />
</template>
