<template>
  <section class="bg-[#161616] flex justify-center">
    <div class="max-w-6xl mx-auto px-6">
      <div ref="card" class="grid grid-cols-1 md:grid-cols-3 gap-8 relative border border-[#636363] py-14 group overflow-hidden">
         <component :is="selectedGlowEffect" />
        <!-- Left Column (1/3) -->
        <div class="flex flex-col items-center text-center">
          <img :src="imageSrc" :alt="personName" class="mb-4 w-auto max-w-[150px]" />
          <h4 class="text-xl font-semibold text-white">{{ personName }}</h4>
          <p class="text-gray-300 mt-2">{{ personTitle }}</p>
        </div>
        <!-- Right Column (2/3) -->
        <div class="md:col-span-2 flex flex-col justify-center px-6">
          <i class="text-6xl fa-solid fa-quote-left" :class="quoteColor"></i>
          <h3 class="text-2xl font-bold text-white mt-4 mb-6">{{ quoteTitle }}</h3>
          <p class="text-gray-300">
            "{{ quoteText }}"
          </p>
          <a :href="ctaLink" class="mt-6 w-auto max-w-max px-4 py-2 button btn-2 text-white font-semibold">
            <span>{{ ctaText }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  imageSrc: String,
  personName: String,
  personTitle: String,
  quoteTitle: String,
  quoteText: String,
  ctaText: String,
  ctaLink: String,
  glowEffect: {
    type: String,
    default: 'GlowEffect'
  },
  quoteColor: {
    type: String,
    default: 'text-[#A620FF]'
  }
})

const selectedGlowEffect = computed(() => {
  // Dynamically import the component based on the prop
  if (props.glowEffect === 'GlowRed') {
    return resolveComponent('GlowRed')
  }
  return resolveComponent('GlowEffect')
})

</script>
