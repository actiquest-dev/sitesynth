<template>
  <HeaderSection />
  <HeroGeneric
    backgroundImage=""
    backgroundPosition="bg-right-bottom"
    paddingClasses="pt-[16rem] h-[100vh]"
    glowEffect="GlowBlue"
    :content="[
      {
        tag: 'h1',
        text: 'Marketing Manager',
        margin: 'mb-8',
        html: false,
      },
      {
        tag: 'p',
        text: 'SiteSynth is a strategy-led consultancy and product studio at the intersection of design, development, and AI. We help ambitious companies build scalable systems, human-centered products, and adaptive brands. We’re also crafting our own tools — including AI-driven solutions for creative and operational workflows. We’re growing, and we’re looking for a Marketing Manager to help shape and amplify our story.',
        margin: 'mb-0',
      },
    ]"
  />
  <ThoughPost
    id="marketing-manager-details"
    glowEffect="GlowBlue"
    sectionBgColor="bg-[#DDDDDD]"
  >
    <template #content>
      <div class="text-[#161616]">
        <!-- What you'll do section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">What you'll do</h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Develop and execute marketing strategies to grow brand visibility
              and generate qualified leads.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Manage and grow SiteSynth’s digital presence (website, blog,
              LinkedIn, newsletter, etc.).
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Work with founders to shape messaging and positioning for both
              service and product lines.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Plan and run content campaigns, case study launches, and product
              announcements.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Oversee content production (copywriters, designers, contractors)
              and ensure brand consistency.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Analyze performance metrics and continuously optimize campaigns.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Support partnership and community initiatives to expand reach and
              credibility.
            </li>
          </ul>
        </div>

        <!-- What we're looking for section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">
            What we're looking for
          </h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              3+ years of experience in marketing, preferably in tech, SaaS, or
              creative industries.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Proven ability to drive both awareness and conversions through
              content and campaigns.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Excellent written English and a sharp eye for tone, voice, and
              storytelling.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Experience with content strategy, social media, SEO, and
              performance analytics.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Strategic thinker with hands-on ability to execute.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Comfortable working independently and cross-functionally in a
              small, remote team.
            </li>
          </ul>
        </div>

        <!-- Nice to have section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">Nice to have</h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Background in branding, design, or product marketing.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Experience launching new services, digital tools, or platforms.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Familiarity with HubSpot, Notion, Webflow, or similar tools.
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Understanding of AI trends, creative workflows, or digital
              innovation.
            </li>
          </ul>
        </div>

        <!-- What we offer section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">What we offer</h2>
          <ul class="space-y-4 text-lg leading-relaxed text-[#161616]">
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Competitive salary (commensurate with experience and location)
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Remote-friendly and flexible schedule
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Learning & tools budget
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Paid holidays and wellness leave
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              Opportunity to shape the voice of a growing company
            </li>
            <li class="flex items-start">
              <span class="text-blue-400 mr-3 mt-1">•</span>
              A supportive, ambitious, design-driven culture
            </li>
          </ul>
        </div>

        <!-- Ready to apply section -->
        <div class="mb-12">
          <h2 class="text-3xl font-bold mb-8 text-[#161616]">
            Ready to apply?
          </h2>
          <p class="mb-4">
            Send us your CV, a short cover note, and a few examples of your work
            — campaigns, writing samples, landing pages, or case studies.
          </p>
          <p class="mb-4 font-semibold">
            Email:
            <a href="mailto:hello@sitesynth.com" class="underline">
              hello@sitesynth.com
            </a>
          </p>
        </div>
      </div>
    </template>
  </ThoughPost>
  <FooterSection />
</template>

<script setup>
import HeaderSection from "~/components/layout/HeaderSection.vue";
import FooterSection from "~/components/layout/FooterSection.vue";
import HeroGeneric from "~/components/hero/HeroGeneric.vue";
import ThoughPost from "~/components/sections/ThoughPost.vue";

// SEO Meta
useHead({
  title: "Marketing Manager - Join SiteSynth",
  meta: [
    {
      name: "description",
      content:
        "Join SiteSynth as a Marketing Manager and help shape and amplify our story. Develop and execute marketing strategies to grow brand visibility and generate qualified leads.",
    },
  ],
});
</script>
