<template>
  <div
    :class="[
      'fixed top-[112px] left-0 w-full h-[calc(100vh-5rem)] bg-[#161616] text-white flex flex-col items-center pt-10 px-6 space-y-6 transition-transform duration-300 z-40 overflow-y-scroll',
      menuOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- NAVIGATION -->
    <nav class="flex flex-col space-y-4 text-center w-full max-w-sm">
      <div
        v-for="(item, index) in navItems"
        :key="index"
        class="border-b border-gray-700 pb-4"
      >
        <template v-if="item.subItems">
          <div
            class="flex items-center justify-between cursor-pointer"
            @click="toggleSubmenu(index)"
          >
            <span class="font-medium text-lg">{{ item.label }}</span>
            <i
              class="fas fa-chevron-down transform transition-transform duration-300"
              :class="{ 'rotate-180': openSubmenus[index] }"
            ></i>
          </div>

          <!-- Submenu -->
          <transition name="fade">
            <div v-if="openSubmenus[index]">
              <div class="mt-3 flex flex-col space-y-2">
                <NuxtLink
                  v-for="(subItem, subIndex) in item.subItems"
                  :key="subIndex"
                  :to="subItem.link"
                  class="text-sm text-gray-300 hover:text-[#A620FF] transition-colors duration-300"
                >
                  {{ subItem.label }}
                </NuxtLink>
              </div>
            </div>
          </transition>
        </template>
        <template v-else>
          <NuxtLink
            :to="item.link"
            class="flex items-center justify-between font-medium text-lg cursor-pointer text-white py-2"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- CTA BUTTON -->
    <NuxtLink
      :to="cta.link"
      class="button btn-2 px-4 py-2 text-white font-semibold"
    >
      <span>{{ cta.text }}</span>
    </NuxtLink>

    <!-- SOCIALS -->
    <div class="flex space-x-6 mb-20">
      <a
        v-for="(social, index) in socials"
        :key="index"
        :href="social.url"
        :aria-label="social.name"
        class="w-10 h-10 flex items-center justify-center rounded-full transition duration-1000 hover:text-white"
        :class="social.hoverBg"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i :class="['text-xl', social.icon]"></i>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({ menuOpen: Boolean });

const openSubmenus = ref({});
function toggleSubmenu(index) {
  openSubmenus.value[index] = !openSubmenus.value[index];
}

// NAVIGATION
const navItems = [
  {
    label: "Product",
    link: "#",
    subItems: [
      {
        imageSrc: "/assets/score-synth.svg",
        label: "ScoreSynth",
        link: "/scoresynth/",
      },
      {
        imageSrc: "/assets/membria.svg",
        label: "Membria",
        link: "https://membria.xyz/",
        target: "_blank",
      },
      {
        imageSrc: "/assets/ai-live-pod.svg",
        label: "AI Live Pod",
        link: "https://ailivepod.framer.website/",
        target: "_blank",
      },
    ],
  },
  {
    label: "Solutions",
    link: "#",
    subItems: [
      {
        label: "Brand-Driven Product Strategy",
        link: "/brand-driven-product-strategy",
      },
      { label: "UX & Design Systems", link: "/ux-and-design-system" },
      {
        label: "Development Support & Execution",
        link: "/full-stack-implementation",
      },
      { label: "AI-Powered Workflows & Innovation", link: "/ai-innovation" },
    ],
  },
  {
    label: "Company",
    link: "#",
    subItems: [
      { label: "About Us", link: "/about-us" },
      { label: "Contact Us", link: "/contact-us" },
      { label: "Careers", link: "/careers" },
    ],
  },
  {
    label: "Opportunities",
    link: "#",
    subItems: [
      {
        label: "Full Stack Developer",
        link: "/careers/full-stack-developer",
      },
      {
        label: "UX/UI Designer",
        link: "/careers/ux-ui-designer",
      },
      {
        label: "Marketing Manager",
        link: "/careers/marketing-manager",
      },
    ],
  },
];

// CTA
const cta = { text: "Get started", link: "/contact-us" };

// SOCIAL ICONS
const socials = [
  {
    name: "LinkedIn",
    url: "#",
    icon: "fab fa-linkedin",
    hoverBg: "hover:bg-[#0A66C2]",
  },
  {
    name: "Instagram",
    url: "#",
    icon: "fab fa-instagram",
    hoverBg: "hover:bg-[#E4405F]",
  },
  {
    name: "YouTube",
    url: "#",
    icon: "fab fa-youtube",
    hoverBg: "hover:bg-[#FF0000]",
  },
];
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
