<template>
  <section :id="id || undefined" :class="sectionClass">
    <div class="max-w-[1248px] mx-auto px-6">
      <div :class="['grid', gridClass]">
        <component
          v-for="(card, idx) in normalizedCards"
          :key="idx"
          :is="card.link ? 'a' : 'div'"
          :href="card.link || undefined"
          class="group/card relative overflow-hidden border border-[#636363] bg-[#161616]
                 transition-colors duration-300 hover:bg-[#1a1a1a]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          :class="[minHeightClass, card.link ? 'cursor-pointer' : '']"
        >
          <!-- depth / vignette -->
          <div
            class="absolute inset-0 pointer-events-none opacity-100"
            style="
              background:
                radial-gradient(650px 420px at 35% 20%, rgba(255,255,255,0.08), transparent 60%),
                radial-gradient(700px 480px at 85% 0%, rgba(141,53,255,0.10), transparent 55%),
                radial-gradient(900px 560px at 50% 120%, rgba(0,0,0,0.70), transparent 70%);
            "
          ></div>

          <div class="relative z-10 p-11">
            <!-- icon -->
            <div class="w-8 h-8">
              <img
                v-if="card.iconSrc"
                :src="card.iconSrc"
                :alt="card.iconAlt || ''"
                class="w-8 h-8 opacity-90"
              />
              <span v-else-if="card.icon" class="text-xl leading-none opacity-90">
                {{ card.icon }}
              </span>
            </div>

            <h3 class="mt-4 text-2xl font-semibold leading-tight text-white">
              {{ card.title }}
            </h3>

            <p class="mt-4 text-[#999999] leading-relaxed max-w-[300px]">
              {{ card.description }}
            </p>

            <!-- optional arrow -->
            <div v-if="showArrow && card.link" class="mt-8">
              <span
                class="inline-flex items-center justify-center w-10 h-10 rounded-full
                       border border-white/20 bg-white/5 text-white/80
                       transition-all duration-300
                       group-hover/card:bg-white/10 group-hover/card:border-white/40"
                aria-hidden="true"
              >
                <svg
                  class="w-4 h-4 transition-transform duration-300 group-hover/card:translate-x-[2px]"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M5 12h12m0 0-5-5m5 5-5 5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: { type: String, default: "" },

  // prefer this
  cards: { type: Array, default: () => [] },

  // legacy support (если где-то уже используешь items)
  items: { type: Array, default: () => [] },

  sectionClass: { type: String, default: "bg-[#161616] pb-20" },
  gridClass: {
    type: String,
    default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[49px]",
  },
  minHeightClass: { type: String, default: "min-h-[270px]" },

  // стрелка (по умолчанию выключена)
  showArrow: { type: Boolean, default: false },
});

const normalizedCards = computed(() => {
  return (props.cards?.length ? props.cards : props.items) || [];
});
</script>

