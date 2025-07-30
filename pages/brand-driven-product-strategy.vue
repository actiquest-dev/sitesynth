<template>
  <HeaderSection />
  <HeroBrand title="Build products that feel as good as they function."
    description="Your brand - is your language. we embed your brand’s voice, values, and character into your digital product from day one. We make sure every interaction feels intentional — not just usable, but unmistakably you."
    backgroundImage="/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/hero-pattern.svg"
    readMore="Read more"
    buttonText="Do you know why?" buttonLink="#" :cards="[
      { icon: '🧭', title: 'Understand the Brand', description: 'We begin by distilling your brand’s essence — tone, values, and purpose — into clear, strategic inputs. Through focused sessions and rapid discovery, we align on what your brand really stands for.', link: '#' },
      { icon: '🎨', title: 'Translate into Product Experience', description: 'We map your brand into UX flows, content, and behaviors — ensuring every screen, message, and interaction feels consistent, intentional, and unmistakably you.', link: '#' },
      { icon: '🤝', title: 'Align Across Teams', description: 'We work across product, design, and marketing — helping your teams speak the same language and move together. No silos. Just shared clarity.', link: '#' }
    ]" />

  <BannerSection sectionTitle="Understand the Brand" backgroundColor="bg-[#DDDDDD]" textColor="text-[#161616]" textAlign="text-left" />

  <UnderstandBrandSection imagePosition="bottom-0 right-[-200px] max-w-[120%]" bgColor="bg-[#DDDDDD]"
    leftTitle="🧭 The compass of your business"
    leftDescription="We begin by distilling your brand’s essence — tone, values, and purpose — into clear, strategic inputs. Through focused workshops and stakeholder alignment, we translate abstract brand traits into usable creative and product direction."
    :tags="[
      'Brand Discovery Sessions',
      'Stakeholder Interviews',
      'Brand Audit',
      'Personality Mapping'
    ]" toolsTitle="🛠️ Tools we use:" :toolsList="[
      'Miro or FigJam for live collaboration',
      'Whimsical for brand attributes and tone sliders',
      'Optional pre-workshop surveys via Typeform or Google Forms'
    ]" imageSrc="/assets/understand-brand.png" />

  <Testimonial imageSrc="/assets/mayya.png" personName="Mayya Aprosina" personTitle="CEO & Business Designer"
    quoteTitle="A clear why shapes everything that follows."
    quoteText="Understanding why your brand exists — beyond products or features — gives every decision direction. It’s the foundation for building digital experiences that feel aligned, intentional, and real."
    ctaText="Get in touch" ctaLink="#" class="pb-[8rem] pt-[8rem]" />

  <BannerSection sectionTitle="Translate into Product Experience" backgroundColor="bg-[#DDDDDD]" textColor="text-[#161616]" textAlign="text-right" />

  <TranslateSection imagePosition="bottom-0" imageSrc="/assets/translate-into.png" imageAlt="Github code" mainTitle="🎨 Make your product speak, look, and feel like your brand." bgColor="bg-[#DDDDDD]" textColor="text-[#161616]"
    mainDescription="Here, we bring the brand to life inside the product — not just through visuals, but through behavior, interaction, and language."
    toolsTitle="🛠️ Tools we use:" :links="[
      { text: 'UX Tone Principles', url: '#' },
      { text: 'Messaging Frameworks', url: '#' },
      { text: 'Brand Audit', url: '#' },
      { text: 'Personality Mapping', url: '#' }
    ]" :tools="[
    'Figma for interface layout, flow mapping, and tone-infused design',
    'Google Docs for writing voice guides, microcopy, and messaging frameworks',
    'Whimsical or FigJam for early UX sketches and tone sliders',
    'Loom for sharing walkthroughs of concept direction and rationale'
  ]" />

  <BannerSection sectionTitle="Align Across Teams" backgroundColor="bg-[#161616]" textColor="text-white" textAlign="text-left" />

  <UnderstandBrandSection imagePosition="bottom-0 right-[-150px]" bgColor="bg-[#161616]" contentBgColor="bg-[#161616]" h2Color="text-[#DDDDDD]" textColor="text-[#DDDDDD]" tagBgColor="bg-[#222222]" tagTextColor="text-white" leftTitle="🤝 Turn strategy into shared understanding."
    leftDescription="Even the best strategy fails without alignment. We bring teams together — literally and strategically — so they move in sync."
    :tags="[
      'Cross-Functional Sessions',
      'Shared Documentation',
      'Brand Audit',
      'Project Management'
    ]" toolsTitle="🛠️ Tools we use:" :toolsList="[
      'Miro or FigJam for alignment workshops',
      'Notion for shared strategy docs',
      'Slack or Loom for async feedback',
      'Monday.com or Jira for team tracking'
    ]" imageSrc="/assets/brand-driven.png" />
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
  <WhiteSection bgImage="/assets/brand-driven-bg.svg" class="pt-[4rem] pb-[8rem]" title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
  <FooterSection />
</template>
