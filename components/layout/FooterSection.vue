<template>
  <footer class="bg-[#161616] border-t border-[#636363] py-20">
    <div
      class="max-w-[1248px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6"
    >
      <!-- Left: Logo, tagline, socials -->
      <div class="flex flex-col items-start justify-between md:col-span-1">
        <div class="mb-6">
          <NuxtLink to="/">
            <img :src="footerData.logoSrc" alt="logo" />
          </NuxtLink>
          <p class="text-white text-base mt-[2rem] mb-[3rem]">
            {{ footerData.tagline }}
          </p>
          <div class="flex space-x-6">
            <NuxtLink
              v-for="(social, index) in footerData.socialLinks"
              :key="index"
              :to="social.url"
              aria-label="Social Link"
              class="w-10 h-10 flex items-center justify-center rounded-full border-2 text-white transition duration-1000"
              :class="social.color"
            >
              <i :class="social.icon" class="text-xl"></i>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right: Menus -->
      <div class="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div v-for="(section, index) in footerData.menuSections" :key="index">
          <h4 class="text-[#636363] font-normal mb-6">{{ section.title }}</h4>
          <ul class="space-y-2">
            <li
              v-for="(link, i) in section.links"
              :key="i"
              class="text-sm text-white font-normal transition-colors duration-1000 hover:text-[#8CB0FF]"
            >
              <NuxtLink :href="link.url">{{ link.text }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Footer Bar -->
    <div
      class="max-w-[1248px] mx-auto pt-[8rem] grid grid-cols-1 md:grid-cols-2 gap-4 px-6"
    >
      <div
        class="text-white font-light text-left transition-colors duration-1000 hover:text-[#8CB0FF]"
      >
        <NuxtLink :href="footerData.footerLinks.privacy">
          Privacy & Terms of Use
        </NuxtLink>
      </div>
      <div class="text-white font-light text-left md:text-right">
        {{ footerData.footerLinks.copyright }}
      </div>
    </div>
  </footer>
</template>

<script setup>
const footerData = {
  logoSrc: "/assets/synt-logo.svg",
  tagline: "No silos. Just synthesis.",
  socialLinks: [
    {
      icon: "fab fa-linkedin",
      url: "#",
      color: "border-[#0A66C2] hover:bg-[#0A66C2]",
    },
    {
      icon: "fab fa-instagram",
      url: "#",
      color: "border-[#E4405F] hover:bg-[#E4405F]",
    },
    {
      icon: "fab fa-youtube",
      url: "#",
      color: "border-[#FF0000] hover:bg-[#FF0000]",
    },
  ],
  menuSections: [
    {
      title: "Solutions",
      links: [
        {
          text: "Brand-Driven Product Strategy",
          url: "/brand-driven-product-strategy/",
        },
        { text: "UX & Design Systems", url: "/ux-and-design-system/" },
        { text: "Development Support", url: "/full-stack-implementation/" },
        { text: "AI-Powered Workflows", url: "/ai-innovation/" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About us", url: "/about-us" },
        { text: "Contact us", url: "/contact-us" },
        { text: "Careers", url: "/careers" },
        { text: "ScoreSynth", url: "/scoresynth" },
      ],
    },
    {
      title: "Contact us",
      links: [
        { text: "+32 480 68 02 01", url: "tel:+32480680201" },
        { text: "hello@sitesynth.com", url: "mailto:hello@sitesynth.com" },
      ],
    },
  ],
  footerLinks: {
    privacy: "#",
    copyright: "© 2025 SiteSynth & Tech Paw | All rights reserved.",
  },
};
</script>
