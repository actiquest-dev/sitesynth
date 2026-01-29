<template>
  <div
    :class="[
      'fixed top-[112px] left-0 w-full h-[calc(100vh-5rem)] bg-[#161616] text-white z-40 transition-transform duration-300',
      menuOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- SCROLL AREA (only nav scrolls) -->
    <div class="flex flex-col h-full overflow-hidden">
      <div class="flex-1 overflow-y-auto">
        <div class="w-full flex flex-col items-center pt-10 px-6">
          <!-- NAVIGATION -->
          <nav class="flex flex-col w-full max-w-sm">
            <div
              v-for="(item, index) in navItems"
              :key="index"
              class="border-b border-[#333] pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
            >
              <!-- Parent (with submenu) -->
              <template v-if="item.subItems">
                <button
                  type="button"
                  class="w-full flex items-center justify-between cursor-pointer bg-transparent"
                  @click="toggleSubmenu(index)"
                  :aria-expanded="!!openSubmenus[index]"
                >
                  <span
                    class="font-medium text-lg"
                    :class="isCurrentParent(item) ? 'text-white' : 'text-white/90'"
                  >
                    {{ item.label }}
                  </span>

                  <font-awesome
                    :icon="['fas', 'chevron-down']"
                    class="transform transition-transform duration-300"
                    :class="{ 'rotate-180': openSubmenus[index] }"
                  />
                </button>

                <!-- Submenu -->
                <transition name="fade">
                  <div v-if="openSubmenus[index]" class="mt-4">
                    <div class="flex flex-col space-y-3">
                      <component
                        v-for="(subItem, subIndex) in item.subItems"
                        :key="subIndex"
                        :is="linkTag(subItem.link)"
                        v-bind="linkAttrs(subItem)"
                        class="group/item flex items-center gap-4 p-4
                               bg-[#161616] border border-[#333]
                               hover:bg-[#1E1E1E] transition-colors duration-300"
                        :class="isCurrentPage(subItem.link) ? 'border-white/40' : ''"
                      >
                        <!-- Icon (no frame, bigger) -->
                        <img
                          v-if="subItem.imageSrc"
                          :src="subItem.imageSrc"
                          :alt="subItem.label"
                          class="w-14 h-14 object-contain flex-shrink-0 transition-all duration-300"
                          :class="
                            isCurrentPage(subItem.link)
                              ? 'brightness-0 invert'
                              : 'opacity-80 group-hover/item:opacity-100 group-hover/item:brightness-0 group-hover/item:invert'
                          "
                        />

                        <!-- Text (vertically centered) -->
                        <div class="flex-1 flex flex-col justify-center">
                          <div class="text-white text-base font-semibold leading-snug">
                            {{ subItem.label }}
                          </div>

                          <div
                            v-if="subItem.description"
                            class="text-[#999999] text-sm mt-1 leading-snug"
                          >
                            {{ subItem.description }}
                          </div>
                        </div>
                      </component>
                    </div>
                  </div>
                </transition>
              </template>

              <!-- Single Link -->
              <template v-else>
                <component
                  :is="linkTag(item.link)"
                  v-bind="linkAttrs(item)"
                  class="flex items-center justify-between font-medium text-lg cursor-pointer text-white py-2"
                  :class="isCurrentPage(item.link) ? 'text-white' : 'text-white/90'"
                >
                  {{ item.label }}
                </component>
              </template>
            </div>
          </nav>
        </div>
      </div>

      <!-- FIXED FOOTER (CTA + socials never move) -->
      <div class="shrink-0 w-full bg-[#161616] border-t border-[#333] px-6 py-6">
        <div class="w-full max-w-sm mx-auto space-y-6">
          <!-- CTA BUTTON (stays fixed) -->
          <NuxtLink
            :to="cta.link"
            class="inline-flex items-center justify-center font-semibold transition-colors duration-[1000ms]
                   w-full h-11 px-6
                   bg-white text-[#161616] border border-[#161616]
                   hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white"
          >
            <span>{{ cta.text }}</span>
          </NuxtLink>

<!-- SOCIALS (round again) -->
<div class="flex space-x-6 justify-center">
  <a
    v-for="(social, index) in socials"
    :key="index"
    :href="social.url"
    :aria-label="social.name"
    class="w-10 h-10 flex items-center justify-center rounded-full transition duration-1000 hover:text-white"
    :class="social.hoverBg"
    :target="social.target || null"
    :rel="social.target === '_blank' ? 'noopener noreferrer' : null"
  >
    <font-awesome :icon="social.icon" class="text-xl" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

defineProps({ menuOpen: Boolean })

const route = useRoute()

const openSubmenus = ref({})
function toggleSubmenu(index) {
  openSubmenus.value[index] = !openSubmenus.value[index]
}

const isCurrentPage = (link) => {
  if (!link || link === "#") return false
  if (link.startsWith("http")) return false

  const currentPath = route.path
  const linkPath = link.endsWith("/") ? link.slice(0, -1) : link
  const normalizedCurrent = currentPath.endsWith("/") ? currentPath.slice(0, -1) : currentPath

  return normalizedCurrent === linkPath || currentPath.startsWith(linkPath + "/")
}

const isCurrentParent = (item) => {
  if (!item.subItems) return false
  return item.subItems.some((subItem) => isCurrentPage(subItem.link))
}

const isExternal = (url = "") =>
  url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("tel:")

const linkTag = (url) => (isExternal(url) ? "a" : "NuxtLink")

const linkAttrs = (obj) => {
  const url = obj.link
  if (isExternal(url)) {
    return {
      href: url,
      target: obj.target || (url.startsWith("http") ? "_blank" : null),
      rel: (obj.target || url.startsWith("http")) ? "noopener noreferrer" : null,
    }
  }
  return { to: url }
}

const navItems = [
  {
    label: "Product",
    link: "#",
    subItems: [
      { imageSrc: "/assets/new-assets/Menu/Product/gray/ScoreSynth.svg", label: "ScoreSynth", link: "/scoresynth" },
      { imageSrc: "/assets/new-assets/Menu/Product/gray/Membria.svg", label: "Membria", link: "https://membria.ai/", target: "_blank" },
      { imageSrc: "/assets/new-assets/Menu/Product/gray/AILivePod.svg", label: "AI Live Pod", link: "https://ailivepod.framer.website/product", target: "_blank" },
    ],
  },
  {
    label: "Solutions",
    link: "#",
    subItems: [
      {
        imageSrc: "/assets/new-assets/Menu/Solutions/gray/Brand-Driven Product Strategy.svg",
        label: "Brand-Driven Product Strategy",
        description: "Align product design with your brand’s identity and goals.",
        link: "/brand-driven-product-strategy",
      },
      {
        imageSrc: "/assets/new-assets/Menu/Solutions/gray/UX & Design Systems.svg",
        label: "UX & Design Systems",
        description: "Build consistent, scalable, and user-friendly interfaces.",
        link: "/ux-and-design-system",
      },
      {
        imageSrc: "/assets/new-assets/Menu/Solutions/gray/Development Support & Execution.svg",
        label: "Development Support & Execution",
        description: "Turn designs into real, high-quality digital products.",
        link: "/full-stack-implementation",
      },
      {
        imageSrc: "/assets/new-assets/Menu/Solutions/gray/AI-Powered Workflows & Innovation.svg",
        label: "AI-Powered Workflows & Innovation",
        description: "Use smart tools to move faster and reduce cost.",
        link: "/ai-innovation",
      },
    ],
  },
  {
    label: "Company",
    link: "#",
    subItems: [
      { label: "About us", link: "/about-us" },
      { label: "Contact us", link: "/contact-us" },
    ],
  },
  { label: "Careers", link: "/careers" },
]

const cta = { text: "Get started", link: "/contact-us" }

const socials = [
  { name: "LinkedIn", url: "https://www.linkedin.com/company/sitesynth/", icon: ["fab", "linkedin"], hoverBg: "hover:bg-[#0A66C2]", target: "_blank" },
  { name: "X", url: "https://x.com/sitesynth/", icon: ["fab", "twitter"], hoverBg: "hover:bg-[#26a7de]", target: "_blank" },
  { name: "Mail", url: "mailto:hello@sitesynth.com", icon: ["fas", "envelope"], hoverBg: "hover:bg-[#CB1620]", target: "_blank" },
]
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
