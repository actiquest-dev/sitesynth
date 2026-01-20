<template>
  <section :id="id || undefined" class="bg-[#161616]">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 md:border border-[#636363]">
        <!-- LEFT -->
        <div class="py-20 md:pr-16 md:border-r border-[#636363]">
          <h2 class="text-white text-6xl font-extrabold leading-tight">
            {{ title }}
          </h2>

          <p
            v-if="description"
            class="mt-10 text-[#999999] leading-relaxed max-w-[420px]"
          >
            {{ description }}
          </p>
        </div>

        <!-- RIGHT -->
        <div class="py-20 md:pl-16">
          <!-- Tabs (без линии снизу + без градиента) -->
          <div class="flex justify-center md:justify-start mb-10">
            <div
              class="relative inline-flex border border-[#636363] bg-[#161616] overflow-hidden"
            >
              <!-- sliding indicator -->
              <div
                class="absolute top-0 bottom-0 w-1/2 bg-white/5 transition-transform duration-300"
                :style="{ transform: activeTab === 'left' ? 'translateX(0%)' : 'translateX(100%)' }"
              />

              <button
                type="button"
                class="relative z-10 px-6 py-3 text-sm font-semibold transition-opacity"
                :class="activeTab === 'left' ? 'text-white opacity-100' : 'text-white/50 opacity-80 hover:opacity-100'"
                @click="setTab('left')"
              >
                {{ leftTitle }}
              </button>

              <button
                type="button"
                class="relative z-10 px-6 py-3 text-sm font-semibold transition-opacity"
                :class="activeTab === 'right' ? 'text-white opacity-100' : 'text-white/50 opacity-80 hover:opacity-100'"
                @click="setTab('right')"
              >
                {{ rightTitle }}
              </button>
            </div>
          </div>

          <!-- Cards -->
          <div ref="cardsWrap" class="space-y-8">
            <div
              v-for="(item, index) in activeItems"
              :key="activeTab + '-' + index"
              class="border bg-[#161616] transition-all duration-500 will-change-transform"
              :class="cardBorderClass"
              :style="cardStyle(index)"
            >
              <div class="p-10">
                <div class="flex items-start gap-5">
                  <img
                    class="w-7 h-7 mt-1 select-none pointer-events-none"
                    :src="item.iconSrc || activeIconSrc"
                    :alt="item.iconAlt || ''"
                  />

                  <div>
                    <h3 class="text-white text-2xl font-semibold leading-tight">
                      {{ item.title }}
                    </h3>
                    <p class="mt-4 text-[#999999] leading-relaxed">
                      {{ item.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- (никаких underline/линий под табами и никаких градиентов) -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  id: { type: String, default: "" },

  // LEFT column
  title: { type: String, default: "Why SiteSynth?" },
  description: { type: String, default: "" },

  // Tab labels
  leftTitle: { type: String, default: "Typical Consultancy" },
  rightTitle: { type: String, default: "SiteSynth" },

  // Cards
  leftItems: { type: Array, default: () => [] },
  rightItems: { type: Array, default: () => [] },

  // Icons (defaults)
  leftIconSrc: { type: String, default: "/assets/icons/other/info-circle.svg" },
  rightIconSrc: { type: String, default: "/assets/icons/other/tick-circle.svg" },
});

const activeTab = ref("left"); // default = Typical Consultancy
const inView = ref(false);
const cardsWrap = ref(null);

let io = null;
let timeouts = [];

const setTab = (tab) => {
  activeTab.value = tab;
};

const activeItems = computed(() =>
  activeTab.value === "left" ? props.leftItems : props.rightItems
);

const activeIconSrc = computed(() =>
  activeTab.value === "left" ? props.leftIconSrc : props.rightIconSrc
);

// Borders: red for left, green for right
const cardBorderClass = computed(() =>
  activeTab.value === "left" ? "border-[#AA3733]" : "border-[#3CA76B]"
);

const resetAnim = () => {
  inView.value = false;
  timeouts.forEach((t) => clearTimeout(t));
  timeouts = [];
};

const cardStyle = (index) => {
  // sequential appear only after section is in view
  const delay = index * 140;

  // if not in view -> hidden
  if (!inView.value) {
    return {
      opacity: 0,
      transform: "translateY(12px)",
    };
  }

  return {
    transitionDelay: `${delay}ms`,
    opacity: 1,
    transform: "translateY(0px)",
  };
};

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      if (!e) return;

      if (e.isIntersecting) {
        // trigger once
        inView.value = true;
      }
    },
    { threshold: 0.25 }
  );

  if (cardsWrap.value) io.observe(cardsWrap.value);
});

onBeforeUnmount(() => {
  if (io && cardsWrap.value) io.unobserve(cardsWrap.value);
  if (io) io.disconnect();
  resetAnim();
});

// when switching tabs, replay animation (optional)
watch(activeTab, () => {
  resetAnim();
  // small tick so browser applies initial hidden styles
  const t = setTimeout(() => {
    inView.value = true;
  }, 30);
  timeouts.push(t);
});
</script>


