<template>
  <HeaderSection />

  <AboutHero
    glowEffect="GlowBlue"
    :content="[
      {
        tag: 'h1',
        text: 'We started small — on <br/> purpose.',
        margin: 'mb-8',
        html: true,
      },
      {
        tag: 'p',
        text: 'Meet the people guiding our vision and driving our work forward.',
        margin: 'mb-0',
      },
    ]"
  />

  <!-- WHY WE EXIST -->
   <TwoColumnsDesign
    glowEffect="GlowBlue"
    id="info-ai"
    sectionBgColor="bg-[#DDDDDD]"
    leftColumnBgColor="bg-[#DDDDDD]"
    rightColumnBgColor="bg-[#161616]"
    textColorleft="text-[#161616]"
    textColorRight="text-white"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#DDDDDD] relative">
        <!-- градиент в нижнем левом углу -->
        <div
          class="absolute inset-0 pointer-events-none opacity-100 z-0"
          style="
            background-image: url('/assets/gradients/gradient_right_corner.svg');
            background-size: cover;
            background-position: bottom left;
            background-repeat: no-repeat;
          "
        ></div>

        <!-- контент поверх градиента -->
        <div class="relative z-10 max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h3 class="text-lg mb-2">WHY WE EXIST?</h3>
          <h2 class="text-4xl font-bold mb-4">
            — we’re a strategic bridge between brand, design, and engineering.
          </h2>
        </div>
      </div>
    </template>

    <template #right>
      <div class="py-24 bg-[#161616]">
        <div class="max-w-[600px] mr-auto px-6 md:px-0 md:pl-16">
          <p class="text-white font-bold mb-4">
            Rooted in effectiveness, openness, and craftsmanship. We're a small
            but dedicated team—designers, strategists, and full-stack
            developers—working in sync to deliver integrated solutions that
            break down silos and drive lasting impact.
          </p>
        </div>
      </div>
    </template>
  </TwoColumnsDesign>

  <!-- Блок About Us + фото офиса -->
  <TwoColumnsDesign
    glowEffect="GlowBlue"
    sectionBgColor="bg-[#161616]"
    leftColumnBgColor="bg-[#161616]"
    rightColumnBgColor="bg-[#161616]"
  >
    <template #left>
      <div class="py-24 md:border-r border-[#636363] bg-[#161616]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-16">
          <h2 class="text-white text-3xl sm:text-4xl mb-6">About Us</h2>
          <p class="text-[#999999] text-normal font-light mb-4">
            We’re based in Sint-Amands, Belgium, in a small office within a
            beautifully restored historical building by the Schelde river. It’s
            not flashy—but it's meaningful: rooted, quiet, and real.
          </p>
          <h3 class="text-white text-2xl mt-12 mb-12">
            Easy reach of partners, clients, and collaborators across Europe.
          </h3>
          <p class="text-[#999999] text-normal font-light">
            Strategically located between Antwerp, Brussels, and Ghent, we
            remain deeply connected to Europe’s major economic hubs—while
            keeping focus where it matters most. This little town gives us
            clarity and calm—and the flexibility to move quickly when clients
            need us.
          </p>
        </div>
      </div>
    </template>

    <template #right>
      <div>
        <img
          src="/assets/new-assets/company-page/about-us/team-about-us.webp"
          alt="SiteSynth office"
          class="h-full w-full object-cover"
        />
      </div>
    </template>
  </TwoColumnsDesign>

  <!-- Новый блок Our leaders -->
  <LeadersSection :leaders="leaders" :id="'our-leaders'" />

  <!-- Блок Our team (старый грид) убран-->

  <!-- Call to action -->
  <WhiteSection
    hover="#0033ff"
    glowEffect="GlowBlue"
    id="get-started-today"
    class="pt-32 pb-32"
    title="Get Started Today"
    description="We work with founders, product leads, and marketing teams to shape digital products that reflect who you are — and scale with who you’re becoming."
    primaryText="Start a Project"
    primaryLink="/contact-us"
    secondaryText="Book a Call"
    secondaryLink="/contact-us"
  />

  <FooterSection />
</template>

<script setup>
const leaders = [
  {
    name: "Mayya Aprosina",
    role: "Founder & CEO",
    image:
      "/assets/new-assets/company-page/about-us/our-team/Mayya Aprosina.png",
    description:
      "Leads SiteSynth’s strategic direction and product vision. Connects brand, design, and engineering into one coherent story for clients.",
  },
  {
    name: "Miguel Aprossine",
    role: "AI & Web3 Visionary Partner",
    image:
      "/assets/new-assets/company-page/about-us/our-team/Miguel Aprossine.png",
    description:
      "Focuses on AI, Web3, and new business models. Helps clients explore emerging technologies without losing focus on real outcomes.",
  },
  {
    name: "Koen Vergauwen",
    role: "Head of Growth",
    image:
      "/assets/new-assets/company-page/about-us/our-team/Koen Vergauwen.png",
    description:
      "Works at the intersection of sales, strategy, and partnerships. Turns complex needs into clear, realistic engagement models.",
  },
  {
    name: "Marco Maffei",
    role: "Technology & Engineering Partner",
    image: "/assets/new-assets/company-page/about-us/our-team/Marco Maffei.png",
    description:
      "Owns the technical backbone of our projects. Bridges design intent with robust, scalable implementation.",
  },
];

import { seoConfig, structuredData } from "~/config/seo";

// SEO Configuration - using centralized config
const siteUrl = useRuntimeConfig().public?.siteUrl;
const seo = seoConfig.about;

useSeoMeta({
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  ogTitle: seo.ogTitle,
  ogDescription: seo.ogDescription,
  ogImage: `${siteUrl}/assets/shareimage.png`,
  ogImageAlt: "SiteSynth - Strategic Design & Development",
  ogUrl: `${siteUrl}/about-us`,
  twitterTitle: seo.ogTitle,
  twitterDescription: seo.ogDescription,
  twitterImage: `${siteUrl}/assets/shareimage.png`,
});

// Structured data for About page
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About SiteSynth",
        description:
          "Learn about SiteSynth, our team, and our approach to strategic design and development.",
        url: `${siteUrl}/about-us`,
      }),
    },
  ],
});
</script>
