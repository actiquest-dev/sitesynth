<template>
  <section
    :id="id || undefined"
    :class="[
      'relative overflow-hidden border-t border-b border-[#636363] bg-[#161616]',
      sectionClass,
    ]"
    ref="sectionRef"
  >
    <GlowEffect />

    <!-- FULL-BLEED right background -->
    <div
      class="right-bleed-bg"
      :class="activeTab === 'typical' ? 'right-bleed-bg--typical' : 'right-bleed-bg--sitesynth'"
      aria-hidden="true"
    ></div>

    <!-- Content wrapper -->
    <div class="relative z-10 max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- LEFT -->
        <div class="py-20 md:pr-16 md:border-r border-[#636363]">
          <h2 v-if="title" class="text-white text-3xl font-bold leading-tight">
            {{ title }}
          </h2>

          <!-- New: rich text elements like your other section -->
          <div v-if="hasLeftTextElements" class="mt-10 max-w-[420px]">
            <div
              v-for="(item, index) in leftTextElements"
              :key="index"
              class="mb-4 last:mb-0"
            >
              <component :is="item.tag" :class="getTextClasses(item.tag)">
                <!-- If item.parts exists -> render strong spans safely -->
                <template v-if="item.parts && item.parts.length">
                  <template v-for="(part, pIdx) in item.parts" :key="pIdx">
                    <strong v-if="part.strong" class="text-white font-semibold">
                      {{ part.text }}
                    </strong>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </template>

                <!-- Else -> plain content -->
                <template v-else>
                  {{ item.content }}
                </template>
              </component>
            </div>
          </div>

          <!-- Backward-compatible: old description string -->
          <p
            v-else-if="description"
            class="mt-10 text-[#999999] leading-relaxed max-w-[420px]"
          >
            {{ description }}
          </p>
        </div>

        <!-- RIGHT -->
        <div class="py-20 md:pl-16 relative">
          <!-- Tabs -->
          <div class="relative z-10 flex items-center gap-8 mb-12">
            <button
              type="button"
              class="text-lg font-semibold transition-opacity"
              :class="activeTab === 'typical'
                ? 'text-white opacity-100'
                : 'text-white/35 opacity-100 hover:text-white/60'"
              @click="setTab('typical')"
            >
              {{ typicalLabel }}
            </button>

            <button
              type="button"
              class="text-lg font-semibold transition-opacity"
              :class="activeTab === 'sitesynth'
                ? 'text-white opacity-100'
                : 'text-white/35 opacity-100 hover:text-white/60'"
              @click="setTab('sitesynth')"
            >
              {{ siteSynthLabel }}
            </button>
          </div>

          <!-- Cards -->
          <div class="relative z-10 grid grid-cols-1 gap-8">
            <div
              v-for="(card, idx) in currentCards"
              :key="`${activeTab}-${revealKey}-${idx}`"
              class="relative border border-[#636363] bg-[#161616]/85 backdrop-blur-[2px] overflow-hidden"
              :class="[
                'p-8 md:p-10',
                isRevealed ? 'card-in' : 'card-out',
                activeTab === 'typical' ? 'ring-1 ring-[#AA3733]/60' : 'ring-1 ring-[#2EBB67]/60',
              ]"
              :style="{ transitionDelay: `${idx * 140}ms` }"
            >
              <div class="flex items-start gap-4">
                <img
                  :src="card.iconSrc || (activeTab === 'typical' ? typicalIconFallback : siteSynthIconFallback)"
                  :alt="card.iconAlt || ''"
                  class="w-6 h-6 select-none pointer-events-none mt-[2px]"
                />

                <div>
                  <h3 class="text-white text-2xl font-semibold leading-tight">
                    {{ card.title }}
                  </h3>
                  <p class="mt-3 text-[#999999] leading-relaxed">
                    {{ card.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  sectionClass: { type: String, default: "" },

  // Left column
  title: { type: String, default: "Why SiteSynth?" },

  // Old simple description (kept for compatibility)
  description: { type: String, default: "" },

  // New: rich text elements like in your example
  // item: { tag: 'p'|'h3'..., content?: string, parts?: [{text, strong?}] }
  leftTextElements: { type: Array, default: () => [] },

  // Tabs labels
  typicalLabel: { type: String, default: "Typical Consultancy" },
  siteSynthLabel: { type: String, default: "SiteSynth" },

  // Cards
  typicalCards: { type: Array, default: () => [] },
  siteSynthCards: { type: Array, default: () => [] },

  // Icons fallback
  typicalIconFallback: { type: String, default: "/assets/icons/other/info-circle.svg" },
  siteSynthIconFallback: { type: String, default: "/assets/icons/other/tick-circle.svg" },

  // default tab
  defaultTab: { type: String, default: "typical" },
});

const activeTab = ref(props.defaultTab === "sitesynth" ? "sitesynth" : "typical");
const revealKey = ref(0);
const isRevealed = ref(false);

const sectionRef = ref(null);
let io;

const currentCards = computed(() =>
  activeTab.value === "typical" ? props.typicalCards : props.siteSynthCards
);

const hasLeftTextElements = computed(() => Array.isArray(props.leftTextElements) && props.leftTextElements.length > 0);

function setTab(tab) {
  if (activeTab.value === tab) return;

  activeTab.value = tab;
  revealKey.value += 1;
  isRevealed.value = false;

  nextTick(() => {
    requestAnimationFrame(() => {
      isRevealed.value = true;
    });
  });
}

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) isRevealed.value = true;
    },
    { threshold: 0.18 }
  );

  if (sectionRef.value) io.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  if (io && sectionRef.value) io.unobserve(sectionRef.value);
  if (io) io.disconnect();
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
.card-out {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 450ms ease, transform 450ms ease;
}

.card-in {
  opacity: 1;
  transform: translateY(0px);
  transition: opacity 450ms ease, transform 450ms ease;
}

/* Full-bleed background: mobile full width, md+ from center to right edge */
.right-bleed-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  pointer-events: none;
  z-index: 0;

  filter: blur(42px);
  opacity: 0.92;

  transform: translate3d(0, 0, 0);
  will-change: transform, opacity, filter;

  animation:
    rightGlowDrift 14s ease-in-out infinite alternate,
    rightGlowPulse 6.5s ease-in-out infinite;
}

@media (min-width: 768px) {
  .right-bleed-bg {
    left: 50%;
    right: 0;
  }
}

.right-bleed-bg--typical {
  background:
    radial-gradient(1400px 800px at 110% -10%, rgba(170, 55, 51, 0.62), rgba(170, 55, 51, 0) 65%),
    radial-gradient(1100px 700px at 85% 30%, rgba(170, 55, 51, 0.22), rgba(170, 55, 51, 0) 62%),
    radial-gradient(1200px 900px at 30% 120%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 60%);
}

.right-bleed-bg--sitesynth {
  background:
    radial-gradient(1400px 800px at 110% -10%, rgba(46, 187, 103, 0.55), rgba(46, 187, 103, 0) 65%),
    radial-gradient(1100px 700px at 85% 30%, rgba(46, 187, 103, 0.20), rgba(46, 187, 103, 0) 62%),
    radial-gradient(1200px 900px at 30% 120%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 60%);
}

@keyframes rightGlowDrift {
  0% {
    transform: translate3d(40px, -20px, 0) scale(1.00);
  }
  100% {
    transform: translate3d(-30px, 35px, 0) scale(1.06);
  }
}

@keyframes rightGlowPulse {
  0%, 100% {
    opacity: 0.88;
    filter: blur(44px);
  }
  50% {
    opacity: 0.98;
    filter: blur(38px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .right-bleed-bg {
    animation: none;
  }
}
</style>

