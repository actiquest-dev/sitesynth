<template>
  <HeaderSection />
  <HeroSolutionSection
  title="Build products that feel as good as they function."
  description="Your brand - is your language. we embed your brand’s voice, values, and character into your digital product from day one. We make sure every interaction feels intentional — not just usable, but unmistakably you."
  buttonText="Do you know why?"
  buttonLink="#"
  :cards="[
    { icon: '🧭', title: 'Understand the Brand', description: 'We begin by distilling your brand’s essence — tone, values, and purpose — into clear, strategic inputs. Through focused sessions and rapid discovery, we align on what your brand really stands for.', link: '#' },
    { icon: '🎨', title: 'Translate into Product Experience', description: 'We map your brand into UX flows, content, and behaviors — ensuring every screen, message, and interaction feels consistent, intentional, and unmistakably you.', link: '#' },
    { icon: '🤝', title: 'Align Across Teams', description: 'We work across product, design, and marketing — helping your teams speak the same language and move together. No silos. Just shared clarity.', link: '#' }
  ]"
/>

  <UnderstandBrand title="Understand the Brand" bgColor="bg-[#F0F0F0]" leftTitle="🧭 The compass of your business"
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
  ]" imageSrc="/Synth/assets/git-1.png" />

  <TestimonialSection imageSrc="/Synth/assets/mayya.png" personName="Mayya Aprosina"
    personTitle="CEO & Business Designer" quoteTitle="A clear why shapes everything that follows."
    quoteText="Understanding why your brand exists — beyond products or features — gives every decision direction. It’s the foundation for building digital experiences that feel aligned, intentional, and real."
    ctaText="Get in touch" ctaLink="#" class="pb-[8rem] pt-[8rem]" />
  <Translate
  sectionTitle="Translate into Product Experience"
  imageSrc="/Synth/assets/git-1.png"
  imageAlt="Github code"
  mainTitle="🎨 Make your product speak, look, and feel like your brand."
  mainDescription="Here, we bring the brand to life inside the product — not just through visuals, but through behavior, interaction, and language."
  toolsTitle="🛠️ Tools we use:"
  :links="[
    { text: 'Brand Discovery Sessions', url: '#' },
    { text: 'Stakeholder Interviews', url: '#' },
    { text: 'Brand Audit', url: '#' },
    { text: 'Personality Mapping', url: '#' }
  ]"
  :tools="[
    'Figma for interface layout, flow mapping, and tone-infused design',
    'Google Docs for writing voice guides, microcopy, and messaging frameworks',
    'Whimsical or FigJam for early UX sketches and tone sliders',
    'Loom for sharing walkthroughs of concept direction and rationale'
  ]"
/>
  <UnderstandBrand title="Align Across Teams"
    bgColor="bg-[#161616]"
    textColor="text-white"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    leftTitle="🤝 Turn strategy into shared understanding."
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
  ]" imageSrc="/Synth/assets/git-1.png" />
  <StoriesSection
  storiesText="Check our successful stories"
  storiesLink="#"
  blogText="Read our blog to get more insights"
  blogLink="#" />
  <WhiteSection title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project" primaryLink="#" secondaryText="Book a Call" secondaryLink="#" />
  <FooterSection />
</template>
