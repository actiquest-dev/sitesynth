<template>
  <section
    ref="sectionRef"
    :id="id || undefined"
    class="bg-[#161616]"
  >
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
          <!-- Tabs (без линии снизу) -->
          <div class="flex justify-center md:justify-start mb-10">
            <div class="relative inline-flex border border-[#636363] bg-[#161616] overflow-hidden">
              <!-- sliding indicator -->
              <div
                class="absolute top-0 bottom-0 w-1/2 bg-white/5 transition-transform duration-300"
                :style="{ transform: activeTab === 'left' ? 'translateX(0%)' : 'translateX(100%)' }"
              />

              <button
                type="button"
                class="relative z-10 px-6 py-3 text-sm font-semibold transition-opacity"
                :class="activeTab === 'left'
                  ? 'text-white opacity-100'
                  : 'text-white/50 opacity-80 hover:opacity-100'"
                @click="setTab('left')"
              >
                {{ leftTitle }}
              </button>

              <button
                type="button"
                class="relative z-10 px-6 py-3 text-sm font-semibold transition-opacity"
                :class="activeTab === 'right'
                  ? 'text-white opacity-100'
                  : 'text-white/50 opacity-80 hover:opacity-100'"
                @click="setTab('right')"
              >
                {{ rightTitle }}
              </button>
            </div>
          </div>

          <!-- Cards -->
          <div class="space-y-8">
            <div
              v-for="(item, index) in activeItems"
              :key="activeTab + '-' + index"
              class="border bg-[#161616] will-change-transform transition-all duration-500"
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
          </div>
          <!-- /Cards -->
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

  // Tabs
  leftTitle: { type: String, default: "Typical Consultancy" },
  rightTitle: { type: String, default: "SiteSynth" },

  // Content
  leftItems: { type: Array, default: () => [] },
  rightItems: { type: Array, default: () => [] },

  // Default icons (если item.iconSrc не задан)
  leftIconSrc: { type: String, default: "/assets/icons/other/info-circle.svg" },
  rightIconSrc: { type: String, default: "/assets/icons/other/tick-circle.svg" },

  // Optional: отключить анимацию (если надо)
  animateOnScroll: { type: Boolean, default: true },
});

const sectionRef = ref(null);

const activeTab = ref("left"); // default
const inView = ref(false);
const reduceMotion = ref(false);

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

const cardBorderClass = computed(() =>
  activeTab.value === "left" ? "border-[#AA3733]" : "border-[#3CA76B]"
);

const shouldAnimate = computed(() => props.animateOnScroll && !reduceMotion.value);

const cardStyle = (index) => {
  if (!shouldAnimate.value) {
    return { opacity: 1, transform: "translateY(0px)" };
  }

  if (!inView.value) {
    return { opacity: 0, transform: "translateY(12px)" };
  }

  return {
    transitionDelay: `${index * 140}ms`,
    opacity: 1,
    transform: "translateY(0px)",
  };
};

const resetAnim = () => {
  inView.value = false;
  timeouts.forEach((t) => clearTimeout(t));
  timeouts = [];
};

const isInViewport = (el) => {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return r.top < vh * 0.85 && r.bottom > 0;
};

onMounted(() => {
  // prefers-reduced-motion
  try {
    reduceMotion.value = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  } catch (e) {
    reduceMotion.value = false;
  }

  if (!shouldAnimate.value) {
    inView.value = true;
    return;
  }

  // Fallback: если секция уже видна, сразу показываем
  requestAnimationFrame(() => {
    if (isInViewport(sectionRef.value)) inView.value = true;
  });

  // Observer на всю секцию (надежнее)
  io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      if (!e) return;
      if (e.isIntersecting) inView.value = true;
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  if (sectionRef.value) io.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  if (io && sectionRef.value) io.unobserve(sectionRef.value);
  if (io) io.disconnect();
  resetAnim();
});

// При переключении таба: заново проигрываем появление (если анимации включены)
watch(activeTab, () => {
  if (!shouldAnimate.value) return;

  resetAnim();
  const t = setTimeout(() => {
    inView.value = true;
  }, 30);
  timeouts.push(t);
});
</script>


