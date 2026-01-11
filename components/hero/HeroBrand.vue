<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <GlowEffect class="absolute inset-0 z-0 pointer-events-none" />

    <div
      class="relative z-10 max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]"
    >
      <!-- HERO TEXT -->
      <div class="text-center px-6">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-10">{{ title }}</h1>
        <p class="text-base sm:text-lg font-medium mb-8">{{ description }}</p>

        <a
          :href="buttonLink"
          class="inline-block mt-8 px-4 py-2 font-semibold border border-white bg-white text-[#161616] transition-all duration-500 hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white"
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
          class="group/card relative border border-[#636363] bg-[#ffffff14] backdrop-blur overflow-hidden transition-colors duration-300 hover:bg-[#ffffff1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <!-- MAIN LAYOUT (same principle) -->
          <div class="relative z-10 flex flex-col min-h-[420px]">
            <!-- header: padding + fixed text box width -->
            <div class="p-10 pb-0">
              <!-- вот этот бокс (как на твоей красной рамке) -->
              <div class="max-w-[293px]">
                <h3 class="text-xl font-semibold leading-tight text-left">
                  {{ card.title }}
                </h3>

                <p class="text-left text-[#999999] mt-5 leading-relaxed">
                  {{ card.description }}
                </p>
              </div>

              <!-- smaller round arrow -->
              <div class="mt-7">
                <span
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 bg-white/5 text-white/90 transition-all duration-300 group-hover/card:bg-white/10 group-hover/card:border-white/55 group-hover/card:shadow-[0_0_0_6px_rgba(255,255,255,0.06)]"
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
            <img
              v-if="card.image"
              :src="card.image"
              alt=""
              class="pointer-events-none select-none absolute bottom-0 right-0 max-w-none opacity-95"
            />
            <!-- bottom image area -->
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
  backgroundImage: String,
  cards: { type: Array, default: () => [] }, // { title, description, link, image? }
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
