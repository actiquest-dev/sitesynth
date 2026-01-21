<template>
  <section :id="id || undefined" :class="['relative text-white overflow-hidden', sectionClass]">
    <GlowEffect class="absolute inset-0 z-0 pointer-events-none" />

    <div class="relative z-10 max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 border-t border-b border-[#636363]">
        <!-- LEFT -->
        <div class="py-20 md:pr-16 md:border-r border-[#636363]">
          <h2 class="text-white text-5xl font-extrabold leading-tight">
            {{ title }}
          </h2>

          <p v-if="description && !leftTextElements?.length" class="mt-10 text-[#999999] leading-relaxed max-w-[420px]">
            {{ description }}
          </p>

          <div v-if="leftTextElements?.length" class="mt-10 max-w-[420px]">
            <div v-for="(textItem, index) in leftTextElements" :key="index" class="mb-4">
              <component :is="textItem.tag" :class="getTextClasses(textItem.tag)">
                {{ textItem.content }}
              </component>
            </div>
          </div>

          <!-- LINK (animated like your example) -->
          <a
            v-if="leftLink?.href"
            :href="leftLink.href"
            :target="leftLink.target || '_self'"
            class="text-[#8CB0FF] mt-6 w-auto max-w-max py-2 font-semibold inline-flex items-center gap-2 group/link relative"
          >
            <span>{{ leftLink.text }}</span>

            <svg
              class="w-3 h-3 relative top-[1px] transition-transform duration-300 group-hover/link:translate-x-1"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M7.5 4.5L12.5 10L7.5 15.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <div
              class="absolute bottom-0 left-0 h-[2px] bg-[#8CB0FF] w-0 group-hover/link:w-full transition-all duration-300"
            ></div>
          </a>
        </div>

        <!-- RIGHT -->
        <div class="py-20 md:pl-16">
          <!-- Toggle -->
          <div class="inline-flex rounded-full border border-[#636363] overflow-hidden">
            <button
              class="px-6 py-3 text-sm font-semibold transition-colors duration-200"
              :class="activeTab === 'typical' ? 'bg-white text-[#161616]' : 'bg-transparent text-white'"
              @click="activeTab = 'typical'"
            >
              {{ typicalLabel }}
            </button>
            <button
              class="px-6 py-3 text-sm font-semibold transition-colors duration-200"
              :class="activeTab === 'sitesynth' ? 'bg-white text-[#161616]' : 'bg-transparent text-white'"
              @click="activeTab = 'sitesynth'"
            >
              {{ siteSynthLabel }}
            </button>
          </div>

          <div class="mt-10 grid gap-6">
            <div
              v-for="(card, index) in currentCards"
              :key="index"
              class="border border-[#636363] bg-[#ffffff14] backdrop-blur p-6 rounded-2xl"
            >
              <div class="flex items-start gap-4">
                <img :src="card.iconSrc" alt="" class="w-6 h-6 mt-1 opacity-90" />
                <div>
                  <h3 class="text-white text-lg font-semibold">
                    {{ card.title }}
                  </h3>
                  <p class="text-[#999999] mt-2 leading-relaxed">
                    {{ card.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Optional: right-side bleed (if you use it in your layout) -->
          <div class="right-bleed-overlay" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  sectionClass: { type: String, default: "bg-[#161616] py-0" },

  title: { type: String, default: "" },
  description: { type: String, default: "" },

  // ✅ instead of leftContent
  leftTextElements: { type: Array, default: () => [] },

  // ✅ new prop for the animated link
  leftLink: {
    type: Object,
    default: null, // { href: string, text: string, target?: string }
  },

  typicalLabel: { type: String, default: "Typical Consultancy" },
  siteSynthLabel: { type: String, default: "SiteSynth" },
  defaultTab: { type: String, default: "typical" },

  typicalCards: { type: Array, default: () => [] },
  siteSynthCards: { type: Array, default: () => [] },
});

const activeTab = ref(props.defaultTab);

const currentCards = computed(() => {
  return activeTab.value === "typical" ? props.typicalCards : props.siteSynthCards;
});

function getTextClasses(tag) {
  switch (tag) {
    case "h1":
      return "text-white text-4xl font-bold mb-4";
    case "h2":
      return "text-white text-3xl font-bold mb-3";
    case "h3":
      return "text-white text-2xl font-bold mb-3";
    case "h4":
      return "text-white text-xl font-semibold mb-2";
    case "h5":
      return "text-white text-lg font-semibold mb-2";
    case "h6":
      return "text-white text-base font-semibold mb-2";
    case "p":
      return "text-[#999999] leading-relaxed";
    default:
      return "text-[#999999]";
  }
}
</script>

<style scoped>
.right-bleed-overlay {
  position: absolute;
  right: 0;
  top: 0;
  width: 40vw;
  height: 100%;
  pointer-events: none;
  opacity: 0;
}
</style>
