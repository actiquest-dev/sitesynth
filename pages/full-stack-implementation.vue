<template>
  <HeaderSection :darkBackground="true" />
  <HeroFullstack
    id="hero-fullstack"
    backgroundImage="/assets/full-stack-bg.svg"
    title="Design without development is just a suggestion."
    description="We stay in — writing real code, collaborating in Git, and making sure everything works in production."
    buttonText="Let’s Build Together"
    backgroundColor="bg-[#DDDDDD]"
    buttonLink="#"
    :cards="[
      {
        icon: '⚛️',
        title: 'Front-End Engineering',
        description:
          'Beautiful, accessible, and fast interfaces built for real users.',
        link: '#banner-front-end',
      },
      {
        icon: '🌐',
        title: 'Back-End Engineering',
        description: 'Scalable, secure, and API-ready architecture.',
        link: '#banner-back-end',
      },
      {
        icon: '🤝',
        title: 'Integrated Dev Collaboration',
        description: 'We plug into your workflow, toolset, and priorities.',
        link: '#banner-integrated-dev-collaboration',
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
    imageSrc="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/front-end-engineering.png"
  />
  <TestimonialWhite
    id="testimonial-marco"
    imageSrc="/assets/marco.png"
    personName="Marco Maffei"
    personTitle="Full-Stack Engineer"
    quoteTitle="Ideas are cheap. Shipping is rare. We focus on the rare."
    quoteText="Anyone can brainstorm. We’re here to build — and get it live."
    ctaText="Get in touch"
    ctaLink="#"
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
    imageSrc="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/back-end-engineering.png"
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
    imageSrc="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/integrated-dev-collaboration.png"
  />

  <BannerSection
    id="banner-what-you-get"
    text="What You Get"
    sectionClass="py-20 text-center bg-[#DDDDDD]"
    contentClass="text-[#161616] max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <Column
    id="column-what-you-get"
    headerTextColor="text-[#161616]"
    backgroundColor="bg-[#DDDDDD]"
    :columns="[
      {
        icon: '🧬',
        imageAlt: 'Brand Icon',
        title: 'Clear Brand Architecture',
        headerTag: 'h3',
        description:
          'Atomic, flexible, and organized — built for scaling without clutter.',
      },
      {
        icon: '🗺️',
        title: 'User Journey Maps',
        headerTag: 'h3',
        description:
          'Clear maps of how users move through your product — across all key journeys.',
      },
      {
        icon: '⚡',
        title: '🎯 Pattern Usage Guidelines',
        headerTag: 'h3',
        description:
          'Know exactly when and how to use each pattern — no guessing, no inconsistency.',
      },
    ]"
  />
  <Column
    id="column-design-system-documentation"
    headerTextColor="text-[#161616]"
    backgroundColor="bg-[#DDDDDD]"
    :columns="[
      {
        icon: '📘 ',
        title: 'Design System Documentation',
        headerTag: 'h3',
        description:
          'Everything documented and ready in Figma’s Dev Mode, Zeroheight, or your preferred platform.',
      },
      {
        icon: '🛠️',
        title: 'Practical, Living Docs',
        headerTag: 'h3',
        description:
          'Practical, living docs that support day-to-day work — not just sit in a folder.',
      },
    ]"
  />
  <WhiteSection
    id="white-section-get-started"
    bgImage="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/below-pattern.svg"
    class="pt-[8rem] pb-[8rem]"
    bgColor="bg-[#DDDDDD]"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project"
    primaryLink="#"
    secondaryText="Book a Call"
    secondaryLink="#"
  />
  <FooterSection />
</template>
