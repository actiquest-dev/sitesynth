<template>
  <section
    :id="id || undefined"
    class="relative bg-[#DDDDDD] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <GlowEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">
      <!-- Hero -->
      <div class="text-center px-6">
        <h1 class="text-[#161616] text-4xl sm:text-5xl font-extrabold mb-10">
          {{ title }}
        </h1>
        <p class="text-[#161616] text-base sm:text-lg font-medium mb-8">
          {{ description }}
        </p>
        <a
          :href="buttonLink"
          class="inline-block mt-8 px-4 py-2 border-[#161616] hover:bg-white hover:text-[#161616] hover:border-white bg-[#161616] text-white transition-colors duration-[1000ms] font-semibold"
        >
          <span>{{ buttonText }}</span>
        </a>
      </div>

      <!-- Cards Grid -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="border border-[#636363] bg-[#161616] p-6 py-12 flex flex-col justify-between cursor-pointer"
        >
          <h3 class="text-xl font-semibold text-center pt-6 pb-8">
            {{ card.icon }} {{ card.title }}
          </h3>
          <p class="text-center text-[#999999]">{{ card.description }}</p>
          <div class="text-center mt-6">
            <a
              :href="card.link"
              class="text-[#8CB0FF] font-semibold hover:text-[#A620FF] transition-colors duration-1000"
            >
              Read more →
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
  id: {
    type: String,
    default: "",
  },
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  cards: Array,
  backgroundImage: {
    type: String,
    default: null,
  },
});

// Computed style for background image
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
