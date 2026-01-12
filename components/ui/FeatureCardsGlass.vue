<!-- components/ui/FeatureCardsGlass.vue (GLASS / blur variant) -->
<template>
  <section :id="id || undefined" :class="sectionClass">
    <div class="max-w-[1248px] mx-auto px-6">
      <div :class="['grid gap-6', gridClass]">
        <component
          v-for="(card, index) in cards"
          :key="index"
          :is="card.link ? 'a' : 'div'"
          :href="card.link || undefined"
          :target="card.target || undefined"
          :rel="card.target === '_blank' ? 'noopener noreferrer' : undefined"
          class="group/card relative border border-[#636363] overflow-hidden transition-colors duration-300
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          :class="[
            cardBgClass,
            card.link ? 'cursor-pointer' : '',
            cardHoverBgClass,
            minHeightClass
          ]"
        >
          <!-- pinned image -->
          <img
            v-if="(card.image && showPinnedImages)"
            :src="card.image"
            :alt="card.imageAlt || ''"
            class="pointer-events-none select-none absolute bottom-0 right-0 z-0 max-w-none opacity-90"
            :class="imageClass"
            loading="lazy"
          />

          <!-- content -->
          <div class="relative z-10 flex flex-col h-full">
            <div class="p-10 pb-0">
              <!-- fixed text box (как в HeroBrand/Fullstack принцип) -->
              <div :class="textBoxMaxWidthClass">
                <h3 class="text-left leading-tight" :class="titleClass">
                  <span v-if="card.icon" class="mr-2">{{ card.icon }}</span>
                  {{ card.title }}
                </h3>

                <p class="text-left mt-5 leading-relaxed" :class="descriptionClass">
                  {{ card.description }}
                </p>
              </div>

              <!-- round arrow (optional) -->
              <div v-if="(card.showArrow ?? showArrow)" class="mt-7">
                <span
                  class="inline-flex items-center justify-center rounded-full
                         border border-white/35 bg-white/5 text-white/90
                         transition-all duration-300
                         group-hover/card:bg-white/10 group-hover/card:border-white/60
                         group-hover/card:shadow-[0_0_0_6px_rgba(255,255,255,0.06)]"
                  :class="arrowSizeClass"
                  aria-hidden="true"
                >
                  <font-awesome
                    :icon="arrowIcon"
                    class="transition-transform duration-300 group-hover/card:translate-x-[2px]"
                    :class="arrowIconSizeClass"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>

            <!-- spacer -->
            <div class="flex-1"></div>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: "" },

  // layout
  sectionClass: { type: String, default: "" },
  gridClass: { type: String, default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" },
  minHeightClass: { type: String, default: "min-h-[420px]" },

  // cards
  // card: { icon?, title, description, link?, target?, image?, imageAlt?, showArrow? }
  cards: { type: Array, default: () => [] },

  // GLASS styles (default)
  // серый "стеклянный" слой как в HeroBrand
  cardBgClass: {
    type: String,
    default: "bg-[#ffffff14] backdrop-blur-[10px]",
  },
  cardHoverBgClass: {
    type: String,
    default: "hover:bg-[#ffffff1a]",
  },

  // text box
  textBoxMaxWidthClass: { type: String, default: "max-w-[293px]" },
  titleClass: { type: String, default: "text-white text-xl font-semibold" },
  descriptionClass: { type: String, default: "text-[#999999]" },

  // pinned images
  showPinnedImages: { type: Boolean, default: true },
  imageClass: { type: String, default: "" },

  // arrow
  showArrow: { type: Boolean, default: true }, // можно отключить глобально
  arrowIcon: { type: Array, default: () => ["fas", "arrow-right"] },
  arrowSizeClass: { type: String, default: "w-10 h-10" },
  arrowIconSizeClass: { type: String, default: "text-[12px]" },
});
</script>
