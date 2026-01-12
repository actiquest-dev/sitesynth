<template>
  <section :id="id || undefined" :class="sectionClass">
    <div class="max-w-[1248px] mx-auto px-6">
      <div :class="['grid gap-6', gridClass]">
        <component
          v-for="(card, index) in cards"
          :key="index"
          :is="card.link ? 'a' : 'div'"
          :href="card.link || undefined"
          class="group/card relative border border-[#636363] overflow-hidden
                 transition-colors duration-300
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          :class="[
            cardBgClass,
            card.link ? 'cursor-pointer' : '',
            cardHoverBgClass,
            minHeightClass,
          ]"
        >
          <div class="relative z-10 flex flex-col h-full">
            <div class="p-10 pb-0">
              <!-- fixed text box (как в HeroFullstack) -->
              <div class="max-w-[293px]">
                <h3 class="text-xl font-semibold leading-tight text-left" :class="titleClass">
                  <span v-if="card.icon" class="mr-2">{{ card.icon }}</span>{{ card.title }}
                </h3>

                <p class="text-left mt-5 leading-relaxed" :class="descriptionClass">
                  {{ card.description }}
                </p>
              </div>

              <!-- round arrow -->
              <div class="mt-7">
                <span
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full
                         border border-white/30 bg-white/5 text-white/90
                         transition-all duration-300
                         group-hover/card:bg-white/10 group-hover/card:border-white/55
                         group-hover/card:shadow-[0_0_0_6px_rgba(255,255,255,0.06)]"
                  aria-hidden="true"
                >
                  <font-awesome
                    :icon="['fas', 'arrow-right']"
                    class="text-[12px] transition-transform duration-300 group-hover/card:translate-x-[2px]"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>

            <!-- pinned image (optional) -->
            <img
              v-if="card.image"
              :src="card.image"
              alt=""
              class="pointer-events-none select-none absolute bottom-0 right-0 z-0
                     max-w-none opacity-95"
            />
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: "" },

  // массив карточек: { icon?, title, description, link?, image? }
  cards: { type: Array, default: () => [] },

  // layout
  sectionClass: { type: String, default: "py-20" },
  gridClass: { type: String, default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" },
  minHeightClass: { type: String, default: "min-h-[320px]" },

  // styles
  cardBgClass: { type: String, default: "bg-[#161616]" },
  cardHoverBgClass: { type: String, default: "hover:bg-[#1a1a1a]" },
  titleClass: { type: String, default: "text-white" },
  descriptionClass: { type: String, default: "text-[#999999]" },
});
</script>
