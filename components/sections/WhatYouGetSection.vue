<template>
  <section :id="id || undefined" :class="sectionClass">
    <div :class="containerClass">
      <div :class="gridClass">
        <component
          v-for="(card, index) in cards"
          :key="index"
          :is="card.link ? 'a' : 'div'"
          :href="card.link || undefined"
          class="group relative border overflow-hidden transition-colors duration-300"
          :class="cardClass"
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

          <!-- hover overlay (очень мягко) -->
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

  // visuals
  borderColor: { type: String, default: "#636363" },
  cardBgOpacity: { type: Number, default: 7 }, // 7%
  blur: { type: Boolean, default: false }, // backdrop blur

  // content
  cards: { type: Array, default: () => [] },
});

const cardClass = computed(() => {
  const bg = `bg-white/[${props.cardBgOpacity}]`; // tailwind arbitrary opacity
  const border = `border-[${props.borderColor}]`;

  return [
    "no-underline", // если будет <a>
    "focus:outline-none",
    "focus-visible:ring-2 focus-visible:ring-white/30",
    "min-h-[260px]",
    bg,
    border,
    props.blur ? "backdrop-blur-md" : "",
  ].join(" ");
});
</script>
