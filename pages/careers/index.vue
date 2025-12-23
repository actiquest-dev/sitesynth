<template>
  <HeaderSection />
  <AboutHero
    glowEffect="GlowBlue"
    :content="[
      {
        tag: 'h1',
        text: 'Join an elite team of people <br> who love what they do.',
        margin: 'mb-8',
        html: true,
      },
      {
        tag: 'p',
        text: 'Join an elite team of people <br> who love what they do.',
        margin: 'mb-0',
      },
    ]"
  />
  <TwoColumnsDesign
    glowEffect="GlowBlue"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #right>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <h2 class="text-white text-3xl sm:text-4xl mb-6">
            Build what matters. From the inside out.
          </h2>
          <p class="text-[#999999] text-normal font-light mb-4">
            We’re a small, senior team building thoughtful digital products —
            for clients and for ourselves. We care about clarity, craft, and
            making things that last.
          </p>
          <p class="text-[#999999] text-normal font-light mb-4">
            We're not just consultants. We're makers, designers, and engineers
            building our own tools too. That means every project we take on is
            intentional — and every teammate is trusted from day one.
          </p>
          <h3 class="text-white text-2xl mt-[3rem] mb-[3rem]">
            Build what matters. From the inside out.
          </h3>
          <p class="text-[#999999] text-normal font-light">
            It’s not just software — it’s a bridge. A way to unify creativity
            and accessibility. Whether you're a professional composer or a
            hobbyist with a melody in your head, SynthScore helps turn that
            spark into something performable — fast.
          </p>
        </div>
      </div>
    </template>

    <template #left>
      <div>
        <img
          src="/assets/new-assets/company-page/carreers/mayya_prototyping.webp"
          alt="ScoreSynth Image"
          class="h-full w-full object-cover"
        />
      </div>
    </template>
  </TwoColumnsDesign>

  <BannerSection text="Our Positions" />

  <JobOpportunity
    :jobs="[
      {
        title: 'Full Stack Developer',
        description:
          'Join our team to build amazing user interfaces with Javascript, React, Vue, Nuxt, Next, Node.js and PHP',
        link: '/careers/full-stack-developer',
        image: '/assets/new-assets/company-page/carreers/logo-for-position.svg',
        titleTag: 'h3',
        descriptionTag: 'p',
        titleClass: 'text-white text-2xl font-semibold mb-4',
        descriptionClass: 'text-[#CCCCCC] text-base',
      },
      {
        title: 'UX/UI Designer',
        description: 'Work on user interfaces and user experiences',
        link: '/careers/ux-ui-designer',
        image: '/assets/new-assets/company-page/carreers/logo-for-position.svg',
        titleClass: 'text-white text-2xl font-semibold mb-4',
        descriptionClass: 'text-[#CCCCCC] text-base',
      },
      {
        title: 'Marketing Manager',
        description: 'Drive our marketing strategy and execution',
        link: '/careers/marketing-manager',
        image: '/assets/new-assets/company-page/carreers/logo-for-position.svg',
        titleClass: 'text-white text-2xl font-semibold mb-4',
        descriptionClass: 'text-[#CCCCCC] text-base',
      },
      {
        title: 'Don\'t see a role that\'s right for you? ',
        description: 'Apply anyways!',
        link: 'mailto:hello@synthscore.com',
        image: '/assets/new-assets/company-page/carreers/element-for-cta.svg',
        bgColor: 'bg-[#dddddd]',
        titleClass: 'text-[#161616] text-2xl font-semibold mb-4',
        descriptionClass: 'text-[#161616] text-base',
      },
    ]"
  />

  <BannerSection text="Our Culture, Your Benefits" />
  <Column
    id="what-you-get"
    class="pb-20"
    :columns="[
      {
        icon: '🌍',
        title: 'Work From Anywhere',
        headerTag: 'h3',
        description:
          'Remote-first with real flexibility. We collaborate across time zones — no commuting required.',
      },
      {
        icon: '🧠',
        title: 'Do Meaningful Work',
        headerTag: 'h3',
        description:
          'We work on things we believe in — from AI tools to design systems. No filler projects, no meaningless features.',
      },
      {
        icon: '🎯',
        title: 'Small Team, Big Ownership',
        headerTag: 'h3',
        description:
          'You’ll own your work, shape decisions, and see your impact. No middle layers, no silos.',
      },
    ]"
  />
  <Column
    id="design-system"
    class="pb-20"
    :columns="[
      {
        icon: '🤝',
        title: 'Trusted Partnerships',
        headerTag: 'h3',
        description:
          'No outsourcing loops. We work closely and directly — with teammates and with clients.',
      },
      {
        icon: '🎵',
        title: 'Side Projects Welcome',
        headerTag: 'h3',
        description:
          'Building your own thing? We get it — we’re doing the same. We support makers, not just employees.',
      },
    ]"
  />
  <FooterSection />
</template>

<script setup>
import { seoConfig, structuredData } from "~/config/seo";

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.careers;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "Careers at SiteSynth",
  ogUrl: `${siteUrl}/careers`,
  twitterTitle: seo.ogTitle,
  twitterDescription: seo.ogDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});
</script>
