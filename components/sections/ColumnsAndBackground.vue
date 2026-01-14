<template>
  <section
    :id="id || undefined"
    :class="['relative overflow-hidden', sectionClass]"
  >
    <!-- Glow behind everything -->
    <GlowEffect class="absolute inset-0 z-0 pointer-events-none" />

    <!-- Background image (optional) -->
    <div
      v-if="backgroundImage"
      class="absolute inset-0 z-0 pointer-events-none"
      :style="bgStyle"
      aria-hidden="true"
    ></div>

    <!-- Dark overlay (optional, helps text contrast) -->
    <div
      v-if="overlay"
      class="absolute inset-0 z-[1] pointer-events-none"
      :style="{ backgroundColor: overlayColor }"
      aria-hidden="true"
    ></div>

    <div class="relative z-10 max-w-[1248px] mx-auto px-6 py-16">
      <!-- Optional header -->
      <div v-if="title || subtitle" class="text-center mb-12">
        <h2 v-if="title" class="text-white text-4xl font-extrabold">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-[#999999] mt-4 max-w-3xl mx-auto">
          {{ subtitle }}
        </p>
      </div>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in normalizedCards"
          :key="index"
          class="border border-[#636363] bg-[#161616]/70 backdrop-blur-[5.699999809265137px] p-8"
        >
          <div class="flex items-start gap-4">
            <!-- Icon (svg/png) -->
            <img
              v-if="card.iconSrc"
              :src="card.iconSrc"
              :alt="card.iconAlt || ''"
              class="w-10 h-10 object-contain flex-shrink-0"
              loading="lazy"
            />

            <div class="min-w-0">
              <component
                :is="card.headerTag || 'h3'"
                class="text-white text-xl font-semibold leading-tight"
              >
                {{ card.title }}
              </component>

              <p class="text-[#999999] mt-3 leading-relaxed">
                {{ card.description }}
              </p>
            </div>
          </div>

          <!-- Optional link (disabled by default) -->
          <a
            v-if="showLinks && card.link"
            :href="card.link"
            class="text-[#8CB0FF] mt-6 w-auto max-w-max py-2 font-semibold inline-flex items-center gap-2 group/link relative"
          >
            <span>{{ linkText }}</span>

            <font-awesome
              :icon="['fas', 'chevron-right']"
              class="text-sm relative top-[1px] transition-transform duration-300 group-hover/link:translate-x-1"
              aria-hidden="true"
            />

            <!-- Animated underline -->
            <span
              class="absolute bottom-0 left-0 h-[2px] bg-[#8CB0FF] w-0 group-hover/link:w-full transition-all duration-300"
              aria-hidden="true"
            ></span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: { type: String, default: "" },

  // section styling
  sectionClass: { type: String, default: "bg-[#161616] py-20" },
  backgroundImage: { type: String, default: "" },
  overlay: { type: Boolean, default: true },
  overlayOpacity: { type: Number, default: 0.35 },

  // optional header
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },

  // new API (recommended)
  cards: { type: Array, default: () => [] }, // [{ iconSrc?, iconAlt?, title, description, headerTag?, link? }]

  // old API (backward compatible with your previous ColumnsAndBackground.vue)
  leftElements: { type: Array, default: () => [] },  // [{ title, paragraph, headerTag? }]
  rightElements: { type: Array, default: () => [] }, // [{ title, paragraph, headerTag? }]

  // links
  showLinks: { type: Boolean, default: false },
  linkText: { type: String, default: "Read more" },
});

const bgStyle = computed(() => {
  if (!props.backgroundImage) return {};
  return {
    backgroundImage: `url(${props.backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
});

const overlayColor = computed(() => {
  const a = Math.max(0, Math.min(1, Number(props.overlayOpacity) || 0));
  return `rgba(22, 22, 22, ${a})`;
});

const normalizedCards = computed(() => {
  if (Array.isArray(props.cards) && props.cards.length) return props.cards;

  // Map old structure: { title, paragraph, headerTag? } -> { title, description }
  return [...(props.leftElements || []), ...(props.rightElements || [])].map((el) => ({
    title: el?.title,
    description: el?.paragraph,
    headerTag: el?.headerTag || "h3",
  }));
});
</script>
