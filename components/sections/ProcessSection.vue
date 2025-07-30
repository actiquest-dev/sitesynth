<template>
  <section class="border-b border-t border-[#636363] bg-[#161616]">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
      <!-- Left Column (Expandable Sections) -->
      <div class="border-r border-[#636363] py-12 pr-12">
        <div v-for="(section, index) in sections" :key="index" class="toggle-section border-t border-[#636363] pt-4 mt-4" :class="index === 0 ? 'border-t-0' : ''">
          <h3
            :class="['flex items-center justify-between cursor-pointer transition-all duration-300 ease-out', openIndex === index ? 'text-white text-2xl font-bold' : 'text-[#636363] text-xl font-semibold']"
            @click="toggle(index)"
          >
            {{ section.title }}
            <span :class="`${accentColor} toggle-btn`">{{ openIndex === index ? '−' : '+' }}</span>
          </h3>
          <div class="toggle-content transition-all duration-600 ease-out overflow-hidden" :class="openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'">
            <p class="text-[#999999] mt-2">{{ section.description }}</p>
            <a v-if="section.link" :href="section.link" :class="`${accentColor} font-semibold mt-4 inline-block pb-8 transition-colors duration-300`">
              {{ section.linkText }}
              <i class="fa-solid fa-chevron-right relative top-[2px]" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Right Column (Image) -->
      <div :class="`${imageClass} relative`" :style="{ minHeight: containerHeight + 'px' }">
        <transition name="image-fade" mode="out-in" appear>
          <img 
            :key="getCurrentImageSrc" 
            :src="getCurrentImageSrc" 
            :alt="getCurrentImageAlt" 
            class="absolute inset-0 w-full h-full object-cover"
            @load="updateContainerHeight"
          >
        </transition>
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
  images: Array,
  accentColor: {
    type: String,
    default: 'text-[#8CB0FF]'
  }
})

const openIndex = ref(0)
const containerHeight = ref(400) // Default height

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx
}

// Function to update container height based on loaded images
function updateContainerHeight(event) {
  const img = event.target
  const naturalHeight = img.naturalHeight
  const naturalWidth = img.naturalWidth
  const containerWidth = img.offsetWidth
  
  // Calculate the height the image would have at the container width
  const scaledHeight = (naturalHeight / naturalWidth) * containerWidth
  
  // Update container height to accommodate the tallest image
  if (scaledHeight > containerHeight.value) {
    containerHeight.value = scaledHeight
  }
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

<style scoped>
/* Simple, clean image opacity transition */
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}

.image-fade-enter-to,
.image-fade-leave-from {
  opacity: 1;
}
</style>
