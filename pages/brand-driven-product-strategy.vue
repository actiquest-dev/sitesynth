<template>
  <HeaderSection />
  <HeroBrand
    id="hero-brand"
    title="Build products that feel right — at AI speed."
    description="We use Claude, Figma AI, and lean async workflows to translate your brand into a product — without the overhead of expensive platforms."
    backgroundImage="/assets/new-assets/test/hero-pattern-animated-once.svg"
    readMore="Read more"
    buttonText="Do you know why?"
    buttonLink="#"
    :cards="heroCards"
  />

  <UnderstandBrandSection
    id="understand-the-brand"
    bgColor="bg-[#161616]"
    contentBgColor="bg-[#161616]"
    textColor="text-[#DDDDDD]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    leftTitle="Understand the Brand"
    leftDescription="We use Claude to run structured brand interviews, synthesize stakeholder inputs, and map your personality framework — cutting a 3-week discovery process down to a day. No expensive facilitation software needed."
    :tags="[
      'Brand Discovery',
      'AI-Synthesized Insights',
      'Stakeholder Interviews',
      'Personality Mapping',
    ]"
    toolsTitle="Tools we use"
    :toolsList="[
      { logo: '/assets/icons/tools/claude.svg', text: 'Claude — brand interviews, synthesis, personality mapping' },
      { logo: '/assets/icons/tools/figma.svg', text: 'Figma — visual tone mapping and brand workshops' },
      { logo: '/assets/icons/tools/github.svg', text: 'GitHub — docs, briefs, and version-controlled brand assets' },
    ]"
  >
    <template #image>
      <!-- Screen 1: Brand Discovery AI interface -->
      <div class="w-full h-full bg-[#161616] flex items-center justify-center p-4 md:p-6">
        <div class="w-full">
          <!-- Browser chrome -->
          <div class="flex items-center gap-1.5 px-4 py-3 bg-[#1e1e1e] rounded-t-none border border-[#2a2a2a] border-b-0">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-3 text-[11px] text-[#555] font-mono">Brand Discovery · Claude</span>
          </div>
          <!-- Content -->
          <div class="bg-[#1a1a1a] border border-[#2a2a2a] border-t-0 rounded-b-none p-5 space-y-4">
            <!-- Claude message -->
            <div class="flex gap-3 items-start screen-item" style="animation-delay:0.1s">
              <div class="w-7 h-7 rounded-full bg-[#CC785C] shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">C</div>
              <div class="bg-[#222] rounded-none px-4 py-2.5 text-[13px] text-[#ccc] leading-relaxed border border-[#2a2a2a]">
                What values define your brand at its core?
              </div>
            </div>
            <!-- User response -->
            <div class="flex gap-3 items-start flex-row-reverse screen-item" style="animation-delay:0.5s">
              <div class="w-7 h-7 rounded-full bg-[#8D35FF] shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">M</div>
              <div class="bg-[#8D35FF]/10 border border-[#8D35FF]/20 rounded-none px-4 py-2.5 text-[13px] text-[#ccc] leading-relaxed">
                Bold, minimal, human-first. Clarity over noise.
              </div>
            </div>
            <!-- AI synthesizing -->
            <div class="flex gap-3 items-start screen-item" style="animation-delay:0.9s">
              <div class="w-7 h-7 rounded-full bg-[#CC785C] shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5">C</div>
              <div class="bg-[#222] rounded-none px-4 py-2.5 text-[13px] text-[#888] border border-[#2a2a2a] flex items-center gap-3 flex-1">
                <span>Synthesizing brand personality</span>
                <span class="flex gap-1 ml-auto">
                  <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#CC785C]"></span>
                  <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#CC785C]" style="animation-delay:0.2s"></span>
                  <span class="typing-dot w-1.5 h-1.5 rounded-full bg-[#CC785C]" style="animation-delay:0.4s"></span>
                </span>
              </div>
            </div>
            <!-- Generated tags -->
            <div class="screen-item" style="animation-delay:1.3s">
              <p class="text-[10px] uppercase tracking-widest text-[#555] mb-2">Personality mapped</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="(t, i) in ['Bold','Minimal','Human-first','Calm','Trustworthy','Forward-thinking']" :key="t"
                  class="tag-anim text-[11px] px-3 py-1 rounded-full border border-[#8D35FF]/40 text-[#a78bfa] bg-[#8D35FF]/5"
                  :style="{ animationDelay: (1.5 + i * 0.08) + 's' }">{{ t }}</span>
              </div>
            </div>
            <!-- Status row -->
            <div class="flex gap-4 pt-1 border-t border-[#2a2a2a] screen-item" style="animation-delay:1.8s">
              <span class="text-[12px] text-[#28c840] flex items-center gap-1.5">✓ Tone defined</span>
              <span class="text-[12px] text-[#28c840] flex items-center gap-1.5">✓ Values mapped</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UnderstandBrandSection>

  <Testimonial
    id="testimonial-mayya"
    imageSrc="/assets/new-assets/people-for-CTA/oval-mayya.png"
    personName="Mayya Aprosina"
    personTitle="CEO & Business Designer"
    quoteTitle="A clear why shapes everything that follows."
    quoteText="Understanding why your brand exists — beyond products or features — gives every decision direction. It's the foundation for building digital experiences that feel aligned, intentional, and real."
    ctaText="Get in touch"
    ctaLink="/contact-us"
    class="pb-[8rem] pt-[8rem]"
  />

  <TranslateSection
    id="translate-into-product"
    mainTitle="Translate into Product Experience"
    bgColor="bg-[#161616]"
    contentBgColor="bg-[#161616]"
    textColor="text-[#DDDDDD]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    mainDescription="Figma AI and Claude work together to translate brand voice into interface decisions — tone, layout, microcopy. Design iterations that used to take days now happen in hours."
    toolsTitle="Tools we use"
    :links="[
      { text: 'UX Tone Principles', url: '#' },
      { text: 'Messaging Frameworks', url: '#' },
      { text: 'Brand Audit', url: '#' },
      { text: 'Personality Mapping', url: '#' },
    ]"
    :tools="[
      { logo: '/assets/icons/tools/figma.svg', text: 'Figma + Figma AI — layout, flows, AI-assisted design' },
      { logo: '/assets/icons/tools/claude.svg', text: 'Claude — microcopy, voice guides, messaging frameworks' },
      { logo: '/assets/icons/tools/whimsical.svg', text: 'Whimsical — early UX sketches and concept direction' },
    ]"
  >
    <template #image>
      <!-- Screen 2: Design Spec / Figma-like interface -->
      <div class="w-full h-full bg-[#161616] flex items-center justify-center p-4 md:p-6">
        <div class="w-full">
          <!-- Browser chrome -->
          <div class="flex items-center gap-1.5 px-4 py-3 bg-[#1e1e1e] rounded-t-none border border-[#2a2a2a] border-b-0">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-3 text-[11px] text-[#555] font-mono">Design Spec · Figma AI</span>
            <span class="ml-auto text-[10px] px-2.5 py-0.5 rounded-full bg-[#8D35FF]/20 text-[#a78bfa] ai-pulse">● AI generating</span>
          </div>
          <!-- Content -->
          <div class="bg-[#1a1a1a] border border-[#2a2a2a] border-t-0 rounded-b-none overflow-hidden">
            <div class="grid grid-cols-2 divide-x divide-[#2a2a2a]">
              <!-- Left: Typography -->
              <div class="p-4 space-y-3">
                <p class="text-[10px] uppercase tracking-widest text-[#555]">Typography</p>
                <div v-for="(t, i) in [['Heading','32px'],['Body','16px'],['Caption','12px']]" :key="i"
                  class="flex items-baseline justify-between screen-item"
                  :style="{ animationDelay: (0.1 + i * 0.15) + 's' }">
                  <span class="text-[13px] text-[#aaa]">{{ t[0] }}</span>
                  <span class="text-[11px] text-[#555]">{{ t[1] }}</span>
                </div>
              </div>
              <!-- Right: Colors -->
              <div class="p-4 space-y-3">
                <p class="text-[10px] uppercase tracking-widest text-[#555]">Color Tokens</p>
                <div v-for="(c, i) in [['#161616','Primary'],['#8D35FF','Accent'],['#BBBBBB','Muted']]" :key="i"
                  class="flex items-center gap-2.5 screen-item"
                  :style="{ animationDelay: (0.1 + i * 0.15) + 's' }">
                  <span class="w-4 h-4 rounded-none shrink-0 border border-[#333]" :style="{ background: c[0] }"></span>
                  <span class="text-[11px] text-[#888] font-mono">{{ c[0] }}</span>
                  <span class="text-[10px] text-[#555] ml-auto">{{ c[1] }}</span>
                </div>
              </div>
            </div>
            <!-- Components row -->
            <div class="border-t border-[#2a2a2a] p-4 space-y-3 screen-item" style="animation-delay:0.6s">
              <p class="text-[10px] uppercase tracking-widest text-[#555]">Components</p>
              <div class="flex gap-2.5 flex-wrap">
                <button class="text-[12px] px-4 py-2 rounded-none bg-white text-[#161616] font-medium">Primary</button>
                <button class="text-[12px] px-4 py-2 rounded-none border border-[#444] text-[#aaa]">Ghost</button>
                <button class="text-[12px] px-4 py-2 rounded-none border border-[#8D35FF]/40 text-[#a78bfa]">Accent</button>
              </div>
              <div class="border border-[#2a2a2a] rounded-none p-3 bg-[#222]">
                <div class="h-2 w-20 bg-[#333] mb-2"></div>
                <div class="h-2 w-32 bg-[#2a2a2a] mb-1.5"></div>
                <div class="h-2 w-24 bg-[#2a2a2a]"></div>
              </div>
            </div>
            <!-- Status -->
            <div class="border-t border-[#2a2a2a] px-4 py-2.5 screen-item" style="animation-delay:0.9s">
              <span class="text-[12px] text-[#28c840]">✓ Figma AI — 3 components generated</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </TranslateSection>

  <UnderstandBrandSection
    id="align-across-teams"
    bgColor="bg-[#161616]"
    contentBgColor="bg-[#161616]"
    h2Color="text-[#DDDDDD]"
    textColor="text-[#DDDDDD]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    leftTitle="Align Across Teams"
    leftDescription="We replace heavy PM platforms with smart async workflows. Claude writes summaries, tracks decisions, and documents outcomes — no Jira licenses, no Loom recordings, no tool fatigue."
    :tags="[
      'Async-First Workflow',
      'AI Meeting Notes',
      'Shared Documentation',
      'No-Tool Overhead',
    ]"
    toolsTitle="Tools we use"
    :toolsList="[
      { logo: '/assets/icons/tools/claude.svg', text: 'Claude — meeting notes, decisions, async documentation' },
      { logo: '/assets/icons/tools/notion.svg', text: 'Notion — shared strategy docs and team knowledge base' },
      { logo: '/assets/icons/tools/slack.svg', text: 'Slack — async team communication' },
      { logo: '/assets/icons/tools/figjam.svg', text: 'FigJam — workshops and visual alignment sessions' },
    ]"
  >
    <template #image>
      <!-- Screen 3: Async alignment / Claude meeting summary -->
      <div class="w-full h-full bg-[#161616] flex items-center justify-center p-4 md:p-6">
        <div class="w-full">
          <!-- Browser chrome -->
          <div class="flex items-center gap-1.5 px-4 py-3 bg-[#1e1e1e] rounded-t-none border border-[#2a2a2a] border-b-0">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-3 text-[11px] text-[#555] font-mono">Meeting Summary · Claude</span>
          </div>
          <!-- Content -->
          <div class="bg-[#1a1a1a] border border-[#2a2a2a] border-t-0 rounded-b-none p-5 space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between screen-item" style="animation-delay:0.1s">
              <div>
                <p class="text-[14px] font-semibold text-[#ddd]">Sprint Planning</p>
                <p class="text-[11px] text-[#555] mt-0.5">Today · summarized in 8 sec</p>
              </div>
              <span class="text-[11px] px-3 py-1 rounded-full bg-[#28c840]/10 text-[#28c840] border border-[#28c840]/20">Done</span>
            </div>
            <!-- Divider -->
            <div class="border-t border-[#2a2a2a]"></div>
            <!-- Decision items -->
            <div class="space-y-3">
              <div v-for="(item, i) in [
                { text: 'Navigation structure approved', done: true },
                { text: 'Color tokens finalized', done: true },
                { text: 'Onboarding flow — in review', done: false },
              ]" :key="i"
                class="flex items-center gap-3 screen-item"
                :style="{ animationDelay: (0.3 + i * 0.2) + 's' }">
                <span v-if="item.done" class="text-[#28c840] text-[14px] shrink-0">✓</span>
                <span v-else class="relative flex shrink-0 w-3 h-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#febc2e] opacity-50"></span>
                  <span class="relative inline-flex rounded-full w-3 h-3 bg-[#febc2e] opacity-80"></span>
                </span>
                <span :class="item.done ? 'text-[#bbb]' : 'text-[#aaa]'" class="text-[13px] leading-snug">{{ item.text }}</span>
              </div>
            </div>
            <!-- Team row -->
            <div class="border-t border-[#2a2a2a] pt-4 flex items-center justify-between screen-item" style="animation-delay:1s">
              <div class="flex items-center gap-1.5">
                <div v-for="(color, i) in ['#8D35FF','#CC785C','#28c840']" :key="i"
                  class="w-7 h-7 rounded-full border-2 border-[#1a1a1a] -ml-1.5 first:ml-0 flex items-center justify-center text-[10px] font-bold text-white"
                  :style="{ background: color }">{{ ['M','A','J'][i] }}</div>
                <span class="text-[12px] text-[#555] ml-1">3 reviewed</span>
              </div>
              <span class="text-[11px] text-[#444]">No Jira. No Loom.</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UnderstandBrandSection>
  <BannerSection text="What You Get" />
  <WhatYouGetSection
    id="what-you-get"
    :showTitle="false"
    sectionClass="bg-[#161616] pb-20 pt-0"
    :blur="true"
    :cardBgOpacity="10"
    :cards="whatYouGetCards"
  />

  <WhiteSection
    id="get-started-today"
    bgImage="/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/below-pattern.svg"
    class="pt-[8rem] pb-[8rem]"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you're becoming."
    primaryText="Start a Project"
    primaryLink="/pricing"
    secondaryText="Book a Call"
    secondaryLink="/pricing"
  />
  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo";

const heroCards = [
  {
    icon: '🧭',
    title: 'Understand the Brand',
    description: "We begin by distilling your brand's essence — tone, values, and purpose — into clear, strategic inputs.",
    link: '#understand-the-brand',
    image: '/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/cards/card-understand-brand.svg',
  },
  {
    icon: '🎨',
    title: 'Translate into Product Experience',
    description: 'We map your brand into UX flows — ensuring every screen feels consistent.',
    link: '#translate-into-product',
    image: '/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/cards/card-product-brand.svg',
  },
  {
    icon: '🤝',
    title: 'Align Across Teams',
    description: 'We work across product, design, and marketing — helping your teams speak the same language.',
    link: '#align-across-teams',
    image: '/assets/new-assets/solutions-page/solutions/brand-driven-product-strategy/cards/card-align-across-teams.svg',
  },
];

const whatYouGetCards = [
  {
    iconSrc: '/assets/icons/routing-2.svg',
    title: 'Strategic Foundation',
    description: "A clear product direction rooted in your brand's purpose, promise, and personality.",
  },
  {
    iconSrc: '/assets/icons/messages.svg',
    title: 'Messaging Frameworks',
    description: 'Positioning, voice, and messaging pillars across product, marketing, and sales.',
  },
  {
    iconSrc: '/assets/icons/people.svg',
    title: 'Cross-Team Alignment',
    description: 'Collaborative tools and rituals to keep design, product, and business stakeholders aligned.',
  },
  {
    iconSrc: '/assets/icons/judge.svg',
    title: 'Decision-Making Criteria',
    description: 'Shared principles that help your team move faster.',
  },
  {
    iconSrc: '/assets/icons/box.svg',
    title: 'Actionable Product Architecture',
    description: 'Feature roadmaps and IA built around real user needs and business priorities.',
  },
  {
    iconSrc: '/assets/icons/task-square.svg',
    title: 'Delivery Blueprint',
    description: 'A practical handoff package for build — specs, edge cases, acceptance criteria.',
  },
];

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.brandStrategy;
useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "Brand-Driven Product Strategy - SiteSynth",
  twitterTitle: "Brand-Driven Product Strategy - SiteSynth",
  twitterDescription:
    "Translate your brand into product experiences that are consistent, scalable, and ready to ship.",
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.brandStrategyPage(siteUrl)),
    },
  ],
});
</script>

<style scoped>
/* Typing dots */
.typing-dot {
  animation: typingPulse 1.2s ease-in-out infinite;
}
@keyframes typingPulse {
  0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

/* AI badge pulse */
.ai-pulse {
  animation: aiPulse 2s ease-in-out infinite;
}
@keyframes aiPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Screen item entrance — fade up */
.screen-item {
  opacity: 0;
  animation: screenItemIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes screenItemIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Tag pop-in */
.tag-anim {
  opacity: 0;
  animation: tagPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes tagPopIn {
  from { opacity: 0; transform: scale(0.8) translateY(4px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
