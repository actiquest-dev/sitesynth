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
          <h2 class="text-white text-5xl font-extrabold leading-tight">
            {{ title }}
          </h2>

          <p v-if="description" class="mt-10 text-[#999999] leading-relaxed max-w-[420px]">
            {{ description }}
          </p>
        </div>

        <!-- RIGHT -->
        <div class="py-20 md:pl-16 relative">
          <!-- Right background (only for SiteSynth tab, like in your mock) -->
          <div
            v-if="activeTab === 'sitesynth'"
            class="absolute inset-0 pointer-events-none"
            :style="siteSynthBgStyle"
            aria-hidden="true"
          />

          <!-- Tabs -->
          <div class="relative z-10 flex items-center gap-8 mb-12">
            <button
              type="button"
              class="text-lg font-semibold transition-opacity"
              :class="activeTab === 'typical' ? 'text-white opacity-100' : 'text-white/35 opacity-100 hover:text-white/60'"
              @click="setTab('typical')"
            >
              {{ typicalLabel }}
            </button>

            <button
              type="button"
              class="text-lg font-semibold transition-opacity"
              :class="activeTab === 'sitesynth' ? 'text-white opacity-100' : 'text-white/35 opacity-100 hover:text-white/60'"
              @click="setTab('sitesynth')"
            >
              {{ siteSynthLabel }}
            </button>

            <!-- simple slider underline -->
            <div class="absolute -bottom-2 left-0 h-[2px] w-full bg-transparent">
              <div
                class="h-[2px] w-[140px] bg-white/40 transition-transform duration-300"
                :style="{
                  transform: activeTab === 'typical' ? 'translateX(0px)' : `translateX(${typicalUnderlineOffset}px)`,
                }"
              />
            </div>
          </div>

          <!-- Cards -->
          <div class="relative z-10 grid grid-cols-1 gap-8">
            <div
              v-for="(card, idx) in currentCards"
              :key="`${activeTab}-${revealKey}-${idx}`"
              class="relative border border-[#636363] bg-[#161616] overflow-hidden"
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

  // Icons fallback (your uploaded ones)
  typicalIconFallback: { type: String, default: "/assets/icons/other/info-circle.svg" },
  siteSynthIconFallback: { type: String, default: "/assets/icons/other/tick-circle.svg" },

  // Right background when SiteSynth active
  siteSynthBg: {
    type: Object,
    default: () => ({
      // adjust if you want another look
      background:
        "radial-gradient(900px 420px at 90% 10%, rgba(141,53,255,0.55), rgba(141,53,255,0) 70%)",
    }),
  },

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

const siteSynthBgStyle = computed(() => ({
  background: props.siteSynthBg?.background || "",
}));

// underline offset (roughly after first tab label)
const typicalUnderlineOffset = 190;

function setTab(tab) {
  if (activeTab.value === tab) return;

  activeTab.value = tab;

  // re-run animation on tab switch
  revealKey.value += 1;
  isRevealed.value = false;
  nextTick(() => {
    // small tick to ensure DOM is re-created
    requestAnimationFrame(() => {
      isRevealed.value = true;
    });
  });
}

onMounted(() => {
  // reveal on scroll (once you reach the section)
  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) {
        isRevealed.value = true;
      }
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
</style>
