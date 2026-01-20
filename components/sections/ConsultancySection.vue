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

    <!-- Content wrapper -->
    <div class="relative z-10 max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- LEFT -->
        <div class="py-20 md:pr-16 md:border-r border-[#636363]">
          <h2 class="text-white text-3xl font-bold leading-tight">
            {{ title }}
          </h2>

          <p v-if="description" class="mt-10 text-[#999999] leading-relaxed max-w-[420px]">
            {{ description }}
          </p>
        </div>

        <!-- RIGHT -->
        <div class="py-20 md:pl-16 relative overflow-hidden">
          <!-- Animated corner gradient background -->
          <div
            class="right-bg"
            :class="activeTab === 'typical' ? 'right-bg--typical' : 'right-bg--sitesynth'"
            aria-hidden="true"
          ></div>

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
  description: { type: String, default: "" },

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
  defaultTab: { type: String, default: "typical" }, // 'typical' | 'sitesynth'
});

const activeTab = ref(props.defaultTab === "sitesynth" ? "sitesynth" : "typical");
const revealKey = ref(0);
const isRevealed = ref(false);

const sectionRef = ref(null);
let io;

const currentCards = computed(() =>
  activeTab.value === "typical" ? props.typicalCards : props.siteSynthCards
);

function setTab(tab) {
  if (activeTab.value === tab) return;

  activeTab.value = tab;

  // re-run animation on tab switch
  revealKey.value += 1;
  isRevealed.value = false;

  nextTick(() => {
    requestAnimationFrame(() => {
      isRevealed.value = true;
    });
  });
}

onMounted(() => {
  // reveal on scroll
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

/* Right column animated "corner" gradient (changes by active tab) */
.right-bg {
  position: absolute;

  /* bigger than the column => no "boxed" look */
  inset: -260px;

  pointer-events: none;
  z-index: 0;

  filter: blur(34px);
  opacity: 0.95;

  transform: translate3d(0, 0, 0);
  animation: rightGlowDrift 12s ease-in-out infinite alternate;
}

/* Typical = red */
.right-bg--typical {
  background:
    radial-gradient(1200px 700px at 110% -10%, rgba(170, 55, 51, 0.55), rgba(170, 55, 51, 0) 62%),
    radial-gradient(900px 560px at 70% 25%, rgba(170, 55, 51, 0.22), rgba(170, 55, 51, 0) 60%),
    radial-gradient(900px 700px at 15% 115%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 58%);
}

/* SiteSynth = green */
.right-bg--sitesynth {
  background:
    radial-gradient(1200px 700px at 110% -10%, rgba(46, 187, 103, 0.45), rgba(46, 187, 103, 0) 62%),
    radial-gradient(900px 560px at 70% 25%, rgba(46, 187, 103, 0.20), rgba(46, 187, 103, 0) 60%),
    radial-gradient(900px 700px at 15% 115%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 58%);
}

@keyframes rightGlowDrift {
  0% {
    transform: translate3d(40px, -20px, 0) scale(1);
  }
  100% {
    transform: translate3d(-20px, 30px, 0) scale(1.05);
  }
}

@media (prefers-reduced-motion: reduce) {
  .right-bg {
    animation: none;
  }
}
</style>

