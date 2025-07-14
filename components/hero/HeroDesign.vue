<template>
    <section class="relative bg-[#161616] text-white group overflow-hidden" :style="backgroundImageStyle">
        <GlowEffect />

        <div class="relative max-w-6xl mx-auto px-6 pt-[16rem] pb-[12rem]">
            <!-- Hero -->
            <div class="text-center px-6 max-w-4xl mx-auto">
                <h1 class="text-4xl sm:text-5xl font-extrabold mb-10">{{ title }}</h1>
                <p class="text-base sm:text-lg font-medium">{{ description }}</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="submitForm" class="flex items-center max-w-4xl mx-auto mt-15 px-6">
                <!-- Left Image -->
                <img src="/assets/figma.svg" alt="Left Image" class="h-12 w-12 mr-2">

                <!-- Input -->
                <div class="relative flex-1">
                    <input type="url" v-model="link" placeholder="Enter a link"
                        class="w-full h-12 px-4 bg-[#6363634D] text-[#A3A3A3] focus:outline-none">

                    <!-- Right Arrow Button -->
                    <button type="submit"
                        class="absolute cursor-pointer inset-y-0 right-0 flex items-center justify-center w-12 bg-[#A259FF]">
                        <i class="fas fa-arrow-right text-white"></i>
                    </button>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: String,
    description: String,
    backgroundImage: String
});

// Simple computed style for background image
const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  }
  return {}
})

</script>