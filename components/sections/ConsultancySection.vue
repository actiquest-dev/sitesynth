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
      :class="
        activeTab === 'typical'
          ? 'right-bleed-bg--typical'
          : 'right-bleed-bg--sitesynth'
      "
      aria-hidden="true"
    />

    <!-- Content wrapper -->
    <div class="relative z-10 max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- LEFT -->
        <div class="py-20 md:pr-16 md:border-r border-[#636363]">
          <h2 v-if="title" class="text-white text-3xl font-bold leading-tight">
            {{ title }}
          </h2>

          <!-- Description (kept for compatibility) -->
          <p
            v-if="description"
            class="mt-10 text-[#999999] leading-relaxed max-w-[420px]"
          >
            {{ description }}
          </p>

          <!-- Extra left content (leftContent.textElements OR leftTextElements) -->
          <div v-if="hasLeftExtras" class="mt-12 max-w-[520px]">
            <div
              v-for="(item, index) in leftExtras"
              :key="index"
              class="mb-4 last:mb-0"
            >
              <component :is="item.tag" :class="getTextClasses(item.tag)">
                <template v-if="item.parts && item.parts.length">
                  <template v-for="(part, pIdx) in item.parts" :key="pIdx">
                    <strong v-if="part.strong" class="text-white font-semibold">
                      {{ part.text }}
                    </strong>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </template>

                <template v-else>
                  {{ item.content }}
                </template>
              </component>
            </div>

            <!-- Optional link under the extra content -->
            <div v-if="leftLink?.href" class="mt-6">
              <a
                v-if="isExternal(leftLink.href)"
                :href="leftLink.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-[#8CB0FF] font-semibold hover:opacity-90 transition"
              >
                <span>{{ leftLink.text || "Learn more" }}</span>
                <span aria-hidden="true">→</span>
              </a>

              <NuxtLink
                v-else
                :to="leftLink.href"
                class="inline-flex items-center gap-2 text-[#8CB0FF] font-semibold hover:opacity-90 transition"
              >
                <span>{{ leftLink.text || "Learn more" }}</span>
                <span aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="py-20 md:pl-16">
          <!-- Tabs -->
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="setTab('typical')"
              :class="[
                'px-5 py-2 rounded-full border border-[#636363] text-sm font-semibold transition',
                activeTab === 'typical'
                  ? 'bg-white text-[#161616] border-white'
                  : 'bg-transparent text-white hover:bg-white/10',
              ]"
            >
              {{ typicalLabel }}
            </button>

            <button
              type="button"
              @click="setTab('sitesynth')"
              :class="[
                'px-5 py-2 rounded-full border border-[#636363] text-sm font-semibold transition',
                activeTab === 'sitesynth'
                  ? 'bg-white text-[#161616] border-white'
                  : 'bg-transparent text-white hover:bg-white/10',
              ]"
            >
              {{ siteSynthLabel }}
            </button>
          </div>

          <!-- Cards -->
          <div class="mt-10">
            <div :key="revealKey">
              <div class="grid gap-5">
                <div
                  v-for="(card, idx) in currentCards"
                  :key="idx"
                  :class="[
                    'border border-[#636363] bg-[#ffffff14] backdrop-blur p-6 transition',
                    isRevealed ? 'card-in' : 'card-out',
                  ]"
                  :style="{ transitionDelay: `${idx * 70}ms` }"
                >
                  <div class="flex items-start gap-4">
                    <img
                      v-if="card.iconSrc"
                      :src="card.iconSrc"
                      alt=""
                      class="w-6 h-6 mt-[2px] opacity-90"
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
          <!-- /Cards -->
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

  // New wrapper prop (what your page is passing now)
  leftContent: { type: Object, default: null },

  // Tabs labels
  typicalLabel: { type: String, default: "Typical Consultancy" },
  siteSynthLabel: { type: String, default: "SiteSynth" },

  // Cards
  typicalCards: { type: Array, default: () => [] },
  siteSynthCards: { type: Array, default: () => [] },

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

const leftExtras = computed(() => {
  if (
    props.leftContent?.textElements &&
    Array.isArray(props.leftContent.textElements) &&
    props.leftContent.textElements.length
  ) {
    return props.leftContent.textElements;
  }
  return props.leftTextElements;
});

const leftLink = computed(() => {
  return props.leftContent?.link || null;
});

const hasLeftExtras = computed(
  () => Array.isArray(leftExtras.value) && leftExtras.value.length > 0
);

function isExternal(href) {
  return /^https?:\/\//.test(href || "");
}

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
      if (!entry) return;
      if (entry.isIntersecting) {
        isRevealed.value = true;
        io?.disconnect();
      }
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
  );

  if (sectionRef.value) io.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  io?.disconnect();
});

function getTextClasses(tag) {
  switch (tag) {
    case "h3":
      return "text-white text-2xl font-bold leading-tight";
    case "h4":
      return "text-white text-xl font-semibold leading-tight";
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
}

.right-bleed-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 1;
  transition: opacity 300ms ease;
}

/* Adjust these backgrounds if you want different feel per tab */
.right-bleed-bg--typical {
  background: radial-gradient(
    1200px 600px at 85% 50%,
    rgba(140, 176, 255, 0.14),
    transparent 60%
  );
  animation: breathe 6s ease-in-out infinite;
}

.right-bleed-bg--sitesynth {
  background: radial-gradient(
    1200px 600px at 85% 50%,
    rgba(141, 53, 255, 0.14),
    transparent 60%
  );
  animation: breathe 6s ease-in-out infinite;
}

@keyframes breathe {
  0% {
    opacity: 0.78;
    filter: blur(44px);
  }
  50% {
    opacity: 0.98;
    filter: blur(38px);
  }
  100% {
    opacity: 0.78;
    filter: blur(44px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .right-bleed-bg {
    animation: none;
  }
}
</style>


