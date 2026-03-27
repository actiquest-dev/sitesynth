<template>
  <HeaderSection :darkBackground="true" />
  <HeroFullstack
    id="hero-fullstack"
    backgroundImage="/assets/new-assets/test/hero-pattern-animated-once.svg"
    title="Design without development is just a suggestion."
    description="We stay in — writing real code, collaborating in Git, and making sure everything works in production."
    buttonText="Let's Build Together"
    buttonLink="#"
    :cards="heroCards"
  />

  <UnderstandBrandSection
    id="banner-front-end"
    bgColor="bg-[#161616]"
    contentBgColor="bg-[#161616]"
    textColor="text-[#DDDDDD]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    leftTitle="Front-End Engineering"
    leftDescription="From the very start, we write code that ships — scalable, modular, and built for long-term growth. We don't hand off mockups. We deliver real product foundations."
    :tags="frontEndTags"
    toolsTitle="Tools we use"
    :toolsList="frontEndTools"
  >
    <template #image>
      <!-- Screen 1: Code editor — Vue component -->
      <div class="w-full h-full bg-[#161616] flex items-center justify-center p-4 md:p-6">
        <div class="w-full">
          <!-- Chrome bar -->
          <div class="flex items-center gap-1.5 px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] border-b-0">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-3 text-[11px] text-[#555] font-mono">HeroSection.vue</span>
            <span class="ml-auto text-[10px] text-[#555] font-mono">Vue 3 · TypeScript</span>
          </div>
          <!-- Editor -->
          <div class="bg-[#111] border border-[#2a2a2a] border-t-0 font-mono text-[12px] leading-6 overflow-hidden">
            <!-- Tabs -->
            <div class="flex border-b border-[#2a2a2a] screen-item" style="animation-delay:0.05s">
              <span class="px-4 py-2 text-[11px] text-[#aaa] border-r border-[#2a2a2a] border-b-2 border-b-[#8D35FF]">HeroSection.vue</span>
              <span class="px-4 py-2 text-[11px] text-[#555] border-r border-[#2a2a2a]">CTAButton.vue</span>
            </div>
            <div class="flex gap-4 p-4">
              <!-- Line numbers -->
              <div class="text-[#555] select-none text-right" style="min-width:1.2rem">
                <div v-for="n in 10" :key="n" class="screen-item" :style="{ animationDelay: (n * 0.06) + 's' }">{{ n }}</div>
              </div>
              <!-- Code lines -->
              <div class="flex-1">
                <div class="screen-item text-[#888]" style="animation-delay:0.06s">&lt;<span class="text-[#e06c75]">template</span>&gt;</div>
                <div class="screen-item pl-4 text-[#888]" style="animation-delay:0.12s">&lt;<span class="text-[#e06c75]">section</span> <span class="text-[#d19a66]">class</span>=<span class="text-[#98c379]">"hero"</span>&gt;</div>
                <div class="screen-item pl-8 text-[#888]" style="animation-delay:0.18s">&lt;<span class="text-[#e06c75]">h1</span>&gt;<span class="text-[#abb2bf]">{{ '{' + '{ title }' + '}' }}</span>&lt;/<span class="text-[#e06c75]">h1</span>&gt;</div>
                <div class="screen-item pl-8 line-highlight" style="animation-delay:0.24s">&lt;<span class="text-[#61afef]">CTAButton</span> <span class="text-[#d19a66]">:label</span>=<span class="text-[#98c379]">"cta"</span> /&gt;</div>
                <div class="screen-item pl-4 text-[#888]" style="animation-delay:0.30s">&lt;/<span class="text-[#e06c75]">section</span>&gt;</div>
                <div class="screen-item text-[#888]" style="animation-delay:0.36s">&lt;/<span class="text-[#e06c75]">template</span>&gt;</div>
                <div class="screen-item" style="animation-delay:0.42s">&nbsp;</div>
                <div class="screen-item text-[#888]" style="animation-delay:0.48s">&lt;<span class="text-[#e06c75]">script</span> <span class="text-[#d19a66]">setup</span> <span class="text-[#d19a66]">lang</span>=<span class="text-[#98c379]">"ts"</span>&gt;</div>
                <div class="screen-item pl-4" style="animation-delay:0.54s"><span class="text-[#c678dd]">const</span> <span class="text-[#abb2bf]"> props</span> = <span class="text-[#c678dd]">defineProps</span><span class="text-[#abb2bf]">&lt;</span><span class="text-[#e5c07b]">Props</span><span class="text-[#abb2bf]">&gt;()</span><span class="cursor-blink text-[#8D35FF] ml-0.5">▌</span></div>
                <div class="screen-item text-[#888]" style="animation-delay:0.60s">&lt;/<span class="text-[#e06c75]">script</span>&gt;</div>
              </div>
            </div>
            <!-- Status bar -->
            <div class="border-t border-[#2a2a2a] px-4 py-2 flex items-center gap-4 screen-item" style="animation-delay:0.7s">
              <span class="relative flex w-2 h-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28c840] opacity-40"></span><span class="relative inline-flex rounded-full w-2 h-2 bg-[#28c840]"></span></span>
              <span class="text-[10px] text-[#28c840]">No errors</span>
              <span class="text-[10px] text-[#555]">Ln 9, Col 42</span>
              <span class="text-[10px] text-[#555] ml-auto">UTF-8 · Vue</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UnderstandBrandSection>

  <Testimonial
    id="testimonial-marco"
    imageSrc="/assets/new-assets/people-for-CTA/oval-marco.png"
    personName="Marco Maffei"
    personTitle="Full-Stack Engineer"
    quoteTitle="Ideas are cheap. Shipping is rare. We focus on the rare."
    quoteText="Anyone can brainstorm. We're here to build — and get it live."
    ctaText="Get in touch"
    ctaLink="/contact-us"
    class="pb-[8rem] pt-[8rem]"
  />

  <TranslateSection
    id="banner-back-end"
    bgColor="bg-[#161616]"
    textColor="text-[#DDDDDD]"
    contentBgColor="bg-[#161616]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    mainTitle="Back-End Engineering"
    mainDescription="We build solid, secure, and flexible backends — tailored to your product's logic. APIs, CMS, authentication, databases — all under control and ready to scale."
    toolsTitle="Tools we use"
    :links="backEndLinks"
    :tools="backEndTools"
  >
    <template #image>
      <!-- Screen 2: API response viewer -->
      <div class="w-full h-full bg-[#161616] flex items-center justify-center p-4 md:p-6">
        <div class="w-full">
          <!-- Chrome bar -->
          <div class="flex items-center gap-1.5 px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] border-b-0">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-3 text-[11px] text-[#555] font-mono">API · REST</span>
            <span class="ml-auto text-[10px] px-2 py-0.5 bg-[#28c840]/10 text-[#28c840] border border-[#28c840]/20">200 OK</span>
          </div>
          <!-- Content -->
          <div class="bg-[#111] border border-[#2a2a2a] border-t-0">
            <!-- Request bar -->
            <div class="flex items-center gap-2 px-4 py-2.5 border-b border-[#2a2a2a] screen-item" style="animation-delay:0.1s">
              <span class="text-[11px] px-2 py-0.5 bg-[#8D35FF]/20 text-[#a78bfa] font-mono">GET</span>
              <span class="text-[12px] text-[#888] font-mono">/api/v1/users<span class="cursor-blink text-[#8D35FF] ml-0.5">▌</span></span>
              <span class="ml-auto text-[10px] text-[#28c840] counter-anim" style="animation-delay:0.9s">142ms</span>
            </div>
            <!-- Loading bar -->
            <div class="h-[2px] bg-[#2a2a2a] overflow-hidden">
              <div class="h-full bg-[#8D35FF] api-progress-bar"></div>
            </div>
            <!-- JSON response -->
            <div class="p-4 font-mono text-[12px] leading-6 space-y-0.5">
              <div class="screen-item text-[#888]" style="animation-delay:0.35s">&#123;</div>
              <div class="screen-item pl-4" style="animation-delay:0.45s"><span class="text-[#e06c75]">"status"</span><span class="text-[#888]">: </span><span class="text-[#98c379]">"success"</span><span class="text-[#888]">,</span></div>
              <div class="screen-item pl-4" style="animation-delay:0.55s"><span class="text-[#e06c75]">"data"</span><span class="text-[#888]">: [</span></div>
              <div class="screen-item pl-8" style="animation-delay:0.65s">&#123; <span class="text-[#e06c75]">"id"</span><span class="text-[#888]">: </span><span class="text-[#d19a66]">1</span><span class="text-[#888]">, </span><span class="text-[#e06c75]">"role"</span><span class="text-[#888]">: </span><span class="text-[#98c379]">"admin"</span> &#125;<span class="text-[#888]">,</span></div>
              <div class="screen-item pl-8" style="animation-delay:0.75s">&#123; <span class="text-[#e06c75]">"id"</span><span class="text-[#888]">: </span><span class="text-[#d19a66]">2</span><span class="text-[#888]">, </span><span class="text-[#e06c75]">"role"</span><span class="text-[#888]">: </span><span class="text-[#98c379]">"viewer"</span> &#125;</div>
              <div class="screen-item pl-4 text-[#888]" style="animation-delay:0.85s">]<span class="text-[#888]">,</span></div>
              <div class="screen-item pl-4" style="animation-delay:0.95s"><span class="text-[#e06c75]">"total"</span><span class="text-[#888]">: </span><span class="text-[#d19a66]">2</span></div>
              <div class="screen-item text-[#888]" style="animation-delay:1.05s">&#125;</div>
            </div>
            <!-- Footer -->
            <div class="border-t border-[#2a2a2a] px-4 py-2.5 flex gap-4 screen-item" style="animation-delay:1.15s">
              <span class="text-[10px] text-[#28c840]">✓ Auth validated</span>
              <span class="text-[10px] text-[#555]">PostgreSQL · 2 rows</span>
              <span class="text-[10px] text-[#555] ml-auto">REST · JSON</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </TranslateSection>

  <UnderstandBrandSection
    id="banner-integrated-dev-collaboration"
    bgColor="bg-[#161616]"
    contentBgColor="bg-[#161616]"
    textColor="text-[#DDDDDD]"
    tagBgColor="bg-[#222222]"
    tagTextColor="text-white"
    leftTitle="Integrated Dev Collaboration"
    leftDescription="We adapt to your team setup. Whether we lead the build or join your engineers, our focus stays the same: momentum, clean handoff, and smooth launches."
    :tags="devCollabTags"
    toolsTitle="Tools we use"
    :toolsList="devCollabTools"
  >
    <template #image>
      <!-- Screen 3: GitHub PR / merge -->
      <div class="w-full h-full bg-[#161616] flex items-center justify-center p-4 md:p-6">
        <div class="w-full">
          <!-- Chrome bar -->
          <div class="flex items-center gap-1.5 px-4 py-3 bg-[#1e1e1e] border border-[#2a2a2a] border-b-0">
            <span class="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
            <span class="w-3 h-3 rounded-full bg-[#febc2e]"></span>
            <span class="w-3 h-3 rounded-full bg-[#28c840]"></span>
            <span class="ml-3 text-[11px] text-[#555] font-mono">Pull Request #47</span>
            <span class="ml-auto text-[10px] px-2 py-0.5 bg-[#8D35FF]/20 text-[#a78bfa] border border-[#8D35FF]/20">Open</span>
          </div>
          <!-- Content -->
          <div class="bg-[#1a1a1a] border border-[#2a2a2a] border-t-0 p-5 space-y-4">
            <!-- PR title -->
            <div class="screen-item" style="animation-delay:0.1s">
              <p class="text-[14px] font-semibold text-[#ddd]">feat: add user authentication flow</p>
              <p class="text-[11px] text-[#555] mt-0.5">main ← feature/auth · 3 commits</p>
            </div>
            <div class="border-t border-[#2a2a2a]"></div>
            <!-- Checks -->
            <div class="space-y-2.5">
              <p class="text-[10px] uppercase tracking-widest text-[#555] screen-item" style="animation-delay:0.2s">Checks</p>
              <div v-for="(check, i) in [
                { name: 'CI · Build', status: true },
                { name: 'Tests · 42 passed', status: true },
                { name: 'Review · 1 approved', status: true },
              ]" :key="i"
                class="flex items-center gap-3 screen-item"
                :style="{ animationDelay: (0.35 + i * 0.18) + 's' }">
                <span class="check-bounce text-[#28c840] text-[14px] font-bold leading-none" :style="{ animationDelay: (0.5 + i * 0.18) + 's' }">✓</span>
                <span class="text-[13px] text-[#aaa]">{{ check.name }}</span>
                <span class="ml-auto relative flex w-1.5 h-1.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28c840] opacity-40"></span><span class="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#28c840]"></span></span>
              </div>
            </div>
            <!-- Merge button row -->
            <div class="border-t border-[#2a2a2a] pt-4 flex items-center gap-3 screen-item" style="animation-delay:1.0s">
              <div class="flex items-center">
                <div v-for="(color, i) in ['#8D35FF','#CC785C','#4a9eff']" :key="i"
                  class="w-6 h-6 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[9px] font-bold text-white"
                  :style="{ background: color, marginLeft: i === 0 ? '0' : '-6px' }">{{ ['M','J','K'][i] }}</div>
              </div>
              <div class="ml-auto relative">
                <div class="absolute inset-0 bg-[#28c840] blur-md opacity-30 merge-glow"></div>
                <button class="relative text-[12px] px-5 py-1.5 bg-[#28c840] text-[#111] font-bold merge-pulse tracking-wide">↑ Merge PR</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UnderstandBrandSection>

  <BannerSection
    id="banner-what-you-get"
    text="What You Get"
    sectionClass="py-20 text-center bg-[#161616]"
    contentClass="text-[#DDDDDD] max-w-[1248px] px-6 mx-auto text-4xl"
  />

  <WhatYouGetSection
    id="what-you-get"
    sectionClass="bg-[#161616] py-0"
    :blur="true"
    :cards="whatYouGetCards"
  />

  <WhiteSection
    id="white-section-get-started"
    bgImage="/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/below-pattern.svg"
    class="pt-[8rem] pb-[8rem]"
    bgColor="bg-[#161616]"
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
    title: 'Front-End Engineering',
    description: 'Beautiful, accessible, and fast interfaces built for real users.',
    link: '#banner-front-end',
    image: '/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/cards/card-front-end.svg',
  },
  {
    title: 'Back-End Engineering',
    description: 'Scalable, secure, and API-ready architecture.',
    link: '#banner-back-end',
    image: '/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/cards/card-back-end.svg',
  },
  {
    title: 'Integrated Dev Collaboration',
    description: 'We plug into your workflow, toolset, and priorities.',
    link: '#banner-integrated-dev-collaboration',
    image: '/assets/new-assets/solutions-page/solutions/full-stack-implementation-support/cards/card-dev-collab.svg',
  },
];

const frontEndTags = ['React', 'Vue', 'Git Collaboration', 'Javascript/TypeScript Frameworks'];

const frontEndTools = [
  { logo: '/assets/icons/tools/figma.svg', text: 'Figma Dev Mode — visual to code alignment' },
  { logo: '/assets/icons/tools/react.svg', text: 'React, Vue, Next.js, Nuxt — frontend frameworks' },
  { logo: '/assets/icons/tools/github.svg', text: 'GitHub / GitLab — version control & code reviews' },
];

const backEndLinks = [
  { text: 'Custom APIs', url: '#' },
  { text: 'Headless CMS', url: '#' },
  { text: 'Data Modeling', url: '#' },
  { text: 'Authentication & Roles', url: '#' },
];

const backEndTools = [
  { logo: '/assets/icons/tools/laravel.svg', text: 'Laravel, Symfony, Node.js — backend frameworks' },
  { logo: '/assets/icons/tools/postgresql.svg', text: 'MySQL, PostgreSQL, MongoDB — database architecture' },
  { logo: '/assets/icons/tools/graphql.svg', text: 'REST & GraphQL — API integrations' },
];

const devCollabTags = ['Dev Handoff', 'Embedded Support', 'CI/CD Friendly', 'Launch Assistance'];

const devCollabTools = [
  { logo: '/assets/icons/tools/slack.svg', text: 'Slack & Notion — async alignment' },
  { logo: '/assets/icons/tools/github.svg', text: 'GitHub Projects or Jira — sprints & tasks' },
  { logo: '/assets/icons/tools/stripe.svg', text: 'Stripe, Auth0 — 3rd-party integrations' },
];

const whatYouGetCards = [
  {
    iconSrc: '/assets/icons/monitor-mobbile.svg',
    title: 'Production Front-End',
    description: 'Shippable UI built in React/Vue with accessibility and performance baked in.',
  },
  {
    iconSrc: '/assets/icons/code.svg',
    title: 'Scalable Back-End',
    description: 'Scalable APIs and services built with clean architecture, validation, and versioning.',
  },
  {
    iconSrc: '/assets/icons/key-square.svg',
    title: 'Auth & Permissions',
    description: 'Secure auth, roles, and permissions that match real business workflows exactly.',
  },
  {
    iconSrc: '/assets/icons/driver-2.svg',
    title: 'Data Foundations',
    description: 'Databases, migrations, and data models designed for growth and change safely.',
  },
  {
    iconSrc: '/assets/icons/flash.svg',
    title: 'CI/CD & Deployments',
    description: 'CI/CD pipelines, environments, and deployments set up for predictable, repeatable releases.',
  },
  {
    iconSrc: '/assets/icons/setting-2.svg',
    title: 'Maintainable Delivery',
    description: 'Testing, monitoring, and handoff docs so your team can maintain confidently.',
  },
];

// SEO Configuration
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.fullStack;
useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - Full-Stack Implementation",
  twitterTitle: seo.twitterTitle,
  twitterDescription: seo.twitterDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.fullStackPage(siteUrl)),
    },
  ],
});
</script>

<style scoped>
.screen-item {
  opacity: 0;
  animation: screenItemIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes screenItemIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Screen 1 — active line highlight */
.line-highlight {
  background: rgba(141, 53, 255, 0.08);
  border-left: 2px solid #8D35FF;
  padding-left: 6px;
  margin-left: -8px;
}

/* Screen 1 & 2 — blinking cursor */
.cursor-blink {
  animation: cursorBlink 1s step-end infinite;
}
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Screen 2 — progress bar sweeping left→right */
.api-progress-bar {
  width: 0%;
  animation: apiProgressSweep 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
}
@keyframes apiProgressSweep {
  0%   { width: 0%; opacity: 1; }
  70%  { width: 100%; opacity: 1; }
  100% { width: 100%; opacity: 0; }
}

/* Screen 2 — response time counter fade-in */
.counter-anim {
  opacity: 0;
  animation: screenItemIn 0.4s ease forwards;
}

/* Screen 3 — check bounce pop-in */
.check-bounce {
  display: inline-block;
  opacity: 0;
  animation: checkBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes checkBounce {
  0%   { opacity: 0; transform: scale(0) rotate(-15deg); }
  60%  { opacity: 1; transform: scale(1.3) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

/* Screen 3 — merge button pulse */
.merge-pulse {
  animation: mergePulse 2s ease-in-out infinite;
}
@keyframes mergePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}

/* Screen 3 — glow behind merge button */
.merge-glow {
  animation: mergeGlow 2s ease-in-out infinite;
}
@keyframes mergeGlow {
  0%, 100% { opacity: 0.2; transform: scale(0.9); }
  50% { opacity: 0.45; transform: scale(1.1); }
}
</style>
