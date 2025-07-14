<template>
  <section class="border-b border-[#636363] bg-[#161616]">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
      <!-- Left Column (Expandable Sections) -->
      <div class="border-r border-[#636363] py-12 pr-12">
        <div v-for="(section, index) in sections" :key="index" class="toggle-section border-t border-[#636363] pt-4 mt-4" :class="index === 0 ? 'border-t-0' : ''">
          <h3
            :class="['flex items-center justify-between cursor-pointer', openIndex === index ? 'text-white text-2xl font-bold' : 'text-[#636363] text-xl font-semibold']"
            @click="toggle(index)"
          >
            {{ section.title }}
            <span :class="`${accentColor} toggle-btn`">{{ openIndex === index ? '−' : '+' }}</span>
          </h3>
          <div class="toggle-content transition-all duration-500 ease-in-out overflow-hidden" :class="openIndex === index ? 'max-h-[500px]' : 'max-h-0'">
            <p class="text-[#999999] mt-2">{{ section.description }}</p>
            <a v-if="section.link" :href="section.link" :class="`${accentColor} font-semibold mt-4 inline-block pb-8 transition-colors duration-1000`">
              {{ section.linkText }}
              <i class="fa-solid fa-chevron-right relative top-[2px]" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Right Column (Image) -->
      <div :class="`${imageClass}`">
        <img :src="getCurrentImageSrc" :alt="getCurrentImageAlt" class="transition-opacity duration-300">
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  sections: Array,
  imageSrc: String,
  imageAlt: String,
  imageClass: String,
  images: Array, // New prop for dynamic images
  accentColor: {
    type: String,
    default: 'text-[#8CB0FF]'
  }
})

// 0: Discover, 1: Define, 2: Design, 3: Deliver
const openIndex = ref(0)
function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx
}

// Computed properties for dynamic image handling
const getCurrentImageSrc = computed(() => {
  if (props.images && props.images.length > 0) {
    const currentImage = props.images[openIndex.value]
    return currentImage ? currentImage.src : (props.imageSrc || '')
  }
  return props.imageSrc || ''
})

const getCurrentImageAlt = computed(() => {
  if (props.images && props.images.length > 0) {
    const currentImage = props.images[openIndex.value]
    return currentImage ? currentImage.alt : (props.imageAlt || '')
  }
  return props.imageAlt || ''
})
</script>
