<template>
  <section
    :id="id || undefined"
    class="relative bg-[#DDDDDD] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <GlowEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">
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
          class="inline-block mt-8 px-4 py-2
                 border border-[#161616] bg-[#161616] text-white font-semibold
                 transition-colors duration-500
                 hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white"
        >
          {{ buttonText }}
        </a>
      </div>

      <!-- CARDS GRID -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- CARD -->
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="group/card border border-[#636363] bg-[#161616]
                 p-6 py-12 flex flex-col justify-between"
        >
          <h3 class="text-xl font-semibold text-center pt-6 pb-8">
            {{ card.icon }} {{ card.title }}
          </h3>

          <p class="text-center text-[#999999]">
            {{ card.description }}
          </p>

          <!-- READ MORE -->
          <div class="text-center mt-6">
            <a
              :href="card.link"
              class="relative inline-flex items-baseline gap-1
                     text-[#8CB0FF] font-semibold group/link"
            >
              <span>Read more</span>

              <font-awesome
                :icon="['fas', 'chevron-right']"
                class="text-sm relative top-[1px]
                       transition-transform duration-300 group-hover/card:translate-x-1"
                aria-hidden="true"
              />

              <!-- UNDERLINE ANIMATION -->
              <span
                class="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8CB0FF]
                       transition-all duration-300
                       group-hover/card:w-full"
              ></span>
            </a>
          </div>
        </div>
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
  cards: Array,
  backgroundImage: { type: String, default: null },
});

// Background image support
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


