<template>
  <section
    :id="id || undefined"
    class="relative bg-[#DDDDDD] group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <GlowEffect />

    <div class="relative z-10 max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">
      <!-- HERO TEXT -->
      <div class="text-center px-6">
        <h1 class="text-[#161616] text-4xl sm:text-5xl font-extrabold mb-10">
          {{ title }}
        </h1>

        <p class="text-[#161616] text-base sm:text-lg font-medium mb-8">
          {{ description }}
        </p>

        <a
          :href="buttonLink"
          class="inline-block mt-8 px-4 py-2 border border-[#161616] bg-[#161616] text-white font-semibold
                 transition-colors duration-500 hover:bg-[#8D35FF] hover:border-[#8D35FF]"
        >
          {{ buttonText }}
        </a>
      </div>

      <!-- CARDS GRID -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="(card, index) in cards"
          :key="index"
          :href="card.link"
          class="group/card relative border border-[#636363] bg-[#161616] overflow-hidden
                 transition-colors duration-300 hover:bg-[#1a1a1a]
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#161616]/30"
        >
          <!-- MAIN LAYOUT (same principle) -->
          <div class="relative z-10 flex flex-col min-h-[420px]">
            <!-- header: padding + fixed text box width -->
            <div class="p-10 pb-0">
              <!-- fixed text box -->
              <div class="max-w-[293px]">
                <h3 class="text-white text-xl font-semibold leading-tight text-left">
                  <span v-if="card.icon" class="mr-2">{{ card.icon }}</span>{{ card.title }}
                </h3>

                <p class="text-left mt-5 leading-relaxed" style="color: #bbbbbb !important;">
                  {{ card.description }}
                </p>
              </div>

              <!-- smaller round arrow -->
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

            <!-- pinned image (sticks to corner) -->
            <img
              v-if="card.image"
              :src="card.image"
              alt=""
              class="pointer-events-none select-none absolute bottom-0 right-0 z-0
                     max-w-none opacity-95"
            />
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  // cards: [{ icon?, title, description, link, image? }]
  cards: { type: Array, default: () => [] },
  backgroundImage: { type: String, default: null },
});

const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {};
});
</script>

