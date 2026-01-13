<template>
  <section :id="id || undefined" :class="sectionClass">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="group/card relative overflow-hidden border border-[#636363]
                 bg-white/[0.07] transition-colors duration-300
                 hover:bg-white/[0.10]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                 rounded-none"
          :class="[
            minHeightClass,
            enableBlur ? 'backdrop-blur-md' : '',
            cardClass
          ]"
        >
          <!-- subtle inner vignette (можешь убрать если не надо) -->
          <div
            class="absolute inset-0 pointer-events-none opacity-100"
            style="
              background:
                radial-gradient(120% 120% at 20% 0%, rgba(141, 53, 255, 0.18) 0%, rgba(0,0,0,0) 55%),
                radial-gradient(120% 120% at 100% 100%, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0) 55%),
                radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 60%);
            "
          ></div>

          <div class="relative z-10 p-11">
            <img
              v-if="card.iconSrc"
              :src="card.iconSrc"
              :alt="card.iconAlt || ''"
              class="w-7 h-7 opacity-95"
            />
            <div v-else-if="card.icon" class="text-2xl leading-none opacity-95">
              {{ card.icon }}
            </div>

            <h3 class="mt-6 text-2xl font-semibold text-white leading-tight">
              {{ card.title }}
            </h3>

            <p class="mt-4 text-[#999999] leading-relaxed max-w-[42ch]">
              {{ card.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: "" },
  sectionClass: { type: String, default: "bg-[#161616] pb-20" },
  cards: { type: Array, default: () => [] }, // [{ iconSrc?, iconAlt?, icon?, title, description }]
  enableBlur: { type: Boolean, default: true },
  minHeightClass: { type: String, default: "min-h-[280px]" },
  cardClass: { type: String, default: "" },
});
</script>
