<template>
  <section :id="id || undefined" :class="['relative overflow-hidden', sectionClass]">
    <!-- Background image layer -->
    <div
      v-if="backgroundImage"
      class="absolute inset-0 pointer-events-none"
      :style="bgStyle"
    />

    <!-- Optional dark overlay for readability -->
    <div
      v-if="overlay"
      class="absolute inset-0 pointer-events-none"
      :style="overlayStyle"
    />

    <!-- Content -->
    <div :class="['relative z-10', containerClass]">
      <h2 v-if="title" :class="titleClass">
        {{ title }}
      </h2>

      <div :class="gridClass">
        <component
          v-for="(card, index) in cards"
          :key="index"
          :is="card.link ? 'a' : 'div'"
          :href="card.link || undefined"
          class="group relative border overflow-hidden transition-colors duration-300 no-underline
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          :style="cardStyle"
        >
          <div class="p-10 md:p-12">
            <!-- icon -->
            <div v-if="card.iconSrc || card.icon" class="mb-6">
              <img
                v-if="card.iconSrc"
                :src="card.iconSrc"
                :alt="card.iconAlt || ''"
                class="w-7 h-7 select-none pointer-events-none"
              />
              <span v-else class="text-2xl leading-none">{{ card.icon }}</span>
            </div>

            <!-- title -->
            <h3 class="text-white text-2xl font-semibold leading-tight">
              {{ card.title }}
            </h3>

            <!-- description -->
            <p class="mt-4 text-[#999999] leading-relaxed">
              {{ card.description }}
            </p>
          </div>

          <!-- мягкий hover -->
          <div
            class="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style="background: rgba(255,255,255,0.03)"
          />
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: { type: String, default: "" },

  // layout
  sectionClass: { type: String, default: "bg-[#161616] py-20" },
  containerClass: { type: String, default: "max-w-[1248px] mx-auto px-6" },
  gridClass: {
    type: String,
    default: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[49px]",
  },

  // header
  title: { type: String, default: "" },
  titleClass: {
    type: String,
    default: "text-white text-4xl md:text-5xl font-semibold text-center mb-16",
  },

  // background image
  backgroundImage: { type: String, default: "" },
  backgroundPosition: { type: String, default: "center" },
  backgroundSize: { type: String, default: "cover" },

  // overlay above bg image
  overlay: { type: Boolean, default: true },
  overlayOpacity: { type: Number, default: 0.35 },

  // card visuals
  borderColor: { type: String, default: "#333" },
  cardBackground: { type: String, default: "rgba(22, 22, 22, 0.70)" },
  blur: { type: Boolean, default: true },
  blurPx: { type: Number, default: 5.7 },

  // content
  cards: { type: Array, default: () => [] },
});

const bgStyle = computed(() => ({
  backgroundImage: `url(${props.backgroundImage})`,
  backgroundPosition: props.backgroundPosition,
  backgroundRepeat: "no-repeat",
  backgroundSize: props.backgroundSize,
}));

const overlayStyle = computed(() => ({
  background: `rgba(0,0,0,${props.overlayOpacity})`,
}));

const cardStyle = computed(() => ({
  borderColor: props.borderColor,
  background: props.cardBackground,
  // без скруглений специально
  borderRadius: "0px",
  minHeight: "260px",
  backdropFilter: props.blur ? `blur(${props.blurPx}px)` : "none",
  WebkitBackdropFilter: props.blur ? `blur(${props.blurPx}px)` : "none",
}));
</script>
