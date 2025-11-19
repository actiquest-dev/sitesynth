<template>
  <div class="hidden md:flex items-center w-full space-x-8 text-white relative">
    <div v-for="(item, index) in navItems" :key="index" class="relative group">
      <template v-if="item.subItems">
        <!-- Dropdown Trigger -->
<NuxtLink
  :href="item.link"
  :target="item.target"
  :class="[
    'font-medium flex items-center space-x-3 transition-colors duration-200 hover:text-[rgb(217,217,217)]',
    isCurrentParent(item) ? 'current' : ''
  ]"
>
  <span :class="isCurrentParent(item) ? 'underline' : ''">
    {{ item.label }}
  </span>
  <i
    class="fas fa-chevron-down transform transition-transform duration-300 group-hover:rotate-180"
  ></i>
</NuxtLink>

        <!-- Dropdown Panel with Dynamic Width -->
        <div
          :class="[
            'absolute top-full left-0 mt-4 bg-[#1E1E1E] border border-[#333] shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50',
            item.dropdownWidth,
          ]"
        >
          <ul class="p-4 space-y-2">
            <li
              v-for="(subItem, subIndex) in item.subItems"
              :key="subIndex"
              class="list-none"
            >
              <NuxtLink
                :href="subItem.link"
                :target="subItem.target"
                :class="[
                  'flex items-center space-x-4 hover:bg-[#2A2A2A] p-4 rounded-lg transition-colors duration-300 group/item',
                  isCurrentPage(subItem.link) ? 'current' : '',
                ]"
              >
                <img
                  v-if="subItem.imageSrc"
                  :src="subItem.imageSrc"
                  alt="Icon"
                  :class="[
                    'w-14 h-14 rounded object-cover transition-all duration-300',
                    isCurrentPage(subItem.link)
                      ? 'brightness-0 invert'
                      : 'group-hover/item:brightness-0 group-hover/item:invert',
                  ]"
                />
                <div>
                  <h3 class="text-white text-base font-semibold mb-1">
                    {{ subItem.label }}
                  </h3>
                  <p v-if="subItem.description" class="text-[#999999] text-sm">
                    {{ subItem.description }}
                  </p>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </template>

      <!-- Single Link -->
      <template v-else>
        <NuxtLink
          :href="item.link"
          :target="item.target"
          :class="[
            'hover:text-[#8CB0FF] font-medium transition-colors duration-1000',
            isCurrentPage(item.link) ? 'current' : '',
          ]"
        >
          {{ item.label }}
        </NuxtLink>
      </template>
    </div>

    <!-- CTA Button -->
    <div class="flex-1 text-right">
      <NuxtLink
        :href="cta.link"
        :target="cta.target"
        :class="`border-[1px] border-white ${hoverbg} hover:text-white ${hoverborder} bg-[#161616] text-white px-4 py-2 font-semibold transition-colors duration-[1000ms]`"
      >
        <span>{{ cta.text }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hoverbg: {
    type: String,
    default: "hover:bg-[#8D35FF]",
  },
  hoverborder: {
    type: String,
    default: "hover:border-[#8D35FF]",
  },
});

// Get current route
const route = useRoute();

// Function to check if current page matches the link
const isCurrentPage = (link) => {
  if (!link || link === "#") return false;

  // Handle external links
  if (link.startsWith("http")) return false;

  // Normalize paths for comparison
  const currentPath = route.path;
  const linkPath = link.endsWith("/") ? link.slice(0, -1) : link;
  const normalizedCurrent = currentPath.endsWith("/")
    ? currentPath.slice(0, -1)
    : currentPath;

  return (
    normalizedCurrent === linkPath || currentPath.startsWith(linkPath + "/")
  );
};

// Function to check if any sub-item is current (for parent highlighting)
const isCurrentParent = (item) => {
  if (!item.subItems) return false;
  return item.subItems.some((subItem) => isCurrentPage(subItem.link));
};

const navItems = [
  {
    label: "Product",
    link: "#",
    dropdownWidth: "w-[500px]",
    subItems: [
      {
        imageSrc: "/assets/new-assets/Menu/Product/gray/ScoreSynth.svg",
        label: "ScoreSynth",
        link: "/scoresynth/",
      },
      {
        imageSrc: "/assets/new-assets/Menu/Product/gray/Membria.svg",
        label: "Membria",
        link: "https://membria.xyz/",
        target: "_blank",
      },
      {
        imageSrc: "/assets/new-assets/Menu/Product/gray/AILivePod.svg",
        label: "AI Live Pod",
        link: "https://ailivepod.framer.website/",
        target: "_blank",
      },
    ],
  },

  {
    label: "Solutions",
    link: "#",
    dropdownWidth: "w-[500px]",
    subItems: [
      {
        imageSrc:
          "/assets/new-assets/Menu/Solutions/gray/Brand-Driven Product Strategy.svg",
        label: "Brand-Driven Product Strategy",
        description: "Align product design with your brand’s identity and goals.",
        link: "/brand-driven-product-strategy",
      },
      {
        imageSrc:
          "/assets/new-assets/Menu/Solutions/gray/UX & Design Systems.svg",
        label: "UX & Design Systems",
        description: "Build consistent, scalable, and user-friendly interfaces.",
        link: "/ux-and-design-system",
      },
      {
        imageSrc:
          "/assets/new-assets/Menu/Solutions/gray/Development Support & Execution.svg",
        label: "Development Support & Execution",
        description: "Turn designs into real, high-quality digital products.",
        link: "/full-stack-implementation",
      },
      {
        imageSrc:
          "/assets/new-assets/Menu/Solutions/gray/AI-Powered Workflows & Innovation.svg",
        label: "AI-Powered Workflows & Innovation",
        description: "Use smart tools to move faster and reduce cost.",
        link: "/ai-innovation",
      },
    ],
  },

  // ⬇️ Company / Info BEFORE Careers
  {
    label: "Info",
    link: "#",
    dropdownWidth: "w-[300px]",
    subItems: [
      { label: "About us", link: "/about-us" },
      { label: "Contact us", link: "/contact-us" }
    ],
  },

  // ⬇️ Careers — NO subItems
  {
    label: "Careers",
    link: "/careers"
  },
];

const cta = { text: "Get started", link: "/contact-us" };
</script>
