<template>
  <section class="relative bg-[#161616] text-white group overflow-hidden bg-cover bg-center bg-no-repeat" :style="backgroundImageStyle">
    <GlowEffect />

    <div class="relative max-w-6xl mx-auto px-6 pt-[16rem] pb-[12rem]">
      <!-- Hero -->
      <div class="text-center px-6">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-10">{{ title }}</h1>
        <p class="text-base sm:text-lg font-medium mb-8">{{ description }}</p>
        <a :href="buttonLink" class="inline-block mt-8 px-4 py-2 text-black bg-white font-semibold">
          <span>{{ buttonText }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  cards: Array,
  backgroundImage: {
    type: String,
    default: null
  }
});

// Computed background image style
const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`
    }
  }
  return {}
})

</script>
