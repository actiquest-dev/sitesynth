<template>
  <section :id="id || undefined" :class="sectionClass">
    <div class="max-w-[1248px] mx-auto px-6">
      <div :class="['grid', gridClass]">
        <component
          v-for="(item, idx) in items"
          :key="idx"
          :is="item.link ? 'a' : 'div'"
          v-bind="item.link ? { href: item.link } : {}"
          class="group/card relative overflow-hidden rounded-2xl transition-colors duration-300
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          :class="[
            minHeightClass,
            cardBorderClass,
            cardBgClass,
            cardHoverBgClass,
            item.link ? 'cursor-pointer' : ''
          ]"
        >
          <!-- subtle depth / vignette -->
          <div
            class="absolute inset-0 pointer-events-none opacity-100"
            style="
              background:
                radial-gradient(650px 420px at 35% 20%, rgba(255,255,255,0.08), transparent 60%),
                radial-gradient(700px 480px at 85% 0%, rgba(141,53,255,0.10), transparent 55%),
                radial-gradient(900px 560px at 50% 120%, rgba(0,0,0,0.65), transparent 70%);
            "
          ></div>

          <div class="relative z-10 p-11">
            <img
              v-if="item.iconSrc"
              :src="item.iconSrc"
              :alt="item.iconAlt || ''"
              class="w-8 h-8 opacity-90"
            />

            <h3 class="mt-4 text-2xl font-semibold leading-tight text-white">
              {{ item.title }}
            </h3>

            <p class="mt-4 text-[#999999] leading-relaxed max-w-[300px]">
              {{ item.description }}
            </p>

            <!-- optional arrow -->
            <div v-if="showArrow && item.link" class="mt-8">
              <span
                class="inline-flex items-center justify-center w-10 h-10 rounded-full
                       border border-white/20 bg-white/5 text-white/80
                       transition-all duration-300
                       group-hover/card:bg-white/10 group-hover/card:border-white/40"
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
        </component>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "" },

  // [{ iconSrc, iconAlt?, title, description, link? }]
  items: { type: Array, default: () => [] },

  sectionClass: { type: String, default: "bg-[#161616] pb-20" },
  gridClass: {
    type: String,
    default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[49px]",
  },
  minHeightClass: { type: String, default: "min-h-[270px]" },

  // IMPORTANT: border color for boxes
  cardBorderClass: { type: String, default: "border border-[#636363]" },

  // card bg (если захочешь сделать прям #636363 — можно передать пропом)
  cardBgClass: { type: String, default: "bg-[#161616]" },
  cardHoverBgClass: { type: String, default: "hover:bg-[#1a1a1a]" },

  showArrow: { type: Boolean, default: false },
});
</script>
