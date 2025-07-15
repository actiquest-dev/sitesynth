<template>
  <section class="relative bg-[#161616] text-white group overflow-hidden bg-cover bg-no-repeat" :class="backgroundPosition" :style="backgroundImageStyle">
    <GlowRed />

    <div class="relative max-w-6xl mx-auto px-6" :class="paddingClasses">
      <div class="text-center px-6 max-w-4xl mx-auto">
        <!-- Logo -->
        <div v-if="logo" class="mb-8 flex justify-center">
          <img :src="logo.src" :alt="logo.alt || 'Logo'" :class="logo.class || 'h-16 w-auto'" />
        </div>

        <!-- Dynamic Content Elements -->
        <div v-for="(element, index) in content" :key="index" :class="getElementMargin(element.margin)">
          <component :is="element.tag" :class="getElementClasses(element.tag, element.textColor)">
            {{ element.text }}
          </component>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  logo: {
    type: Object,
    default: null
    // Structure: { src: String, alt?: String, class?: String }
  },
  content: {
    type: Array,
    required: true
    // Structure:
    // [
    //   {
    //     tag: String,        // h1, h2, h3, h4, h5, h6, p, span, div
    //     text: String,       // The content text
    //     textColor?: String, // Custom text color (optional)
    //     margin?: String     // Custom margin classes (optional)
    //   }
    // ]
  },
  backgroundImage: {
    type: String,
    default: null
  },
  backgroundPosition: {
    type: String,
    default: 'bg-center'
  },
  paddingClasses: {
    type: String,
    default: ''
  }
})

// Computed style for background image
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

// Function to get appropriate CSS classes based on tag
const getElementClasses = (tag, customTextColor) => {
  const textColor = customTextColor || 'text-white'

  switch (tag) {
    case 'h1':
      return `${textColor} text-4xl sm:text-5xl font-extrabold`
    case 'h2':
      return `${textColor} text-3xl sm:text-4xl font-bold`
    case 'h3':
      return `${textColor} text-2xl sm:text-3xl font-normal`
    case 'h4':
      return `${textColor} text-xl sm:text-2xl font-semibold`
    case 'h5':
      return `${textColor} text-lg sm:text-xl font-semibold`
    case 'h6':
      return `${textColor} text-base sm:text-lg font-semibold`
    case 'p':
      return `${textColor} text-base sm:text-lg font-medium`
    default:
      return `${textColor} text-base`
  }
}

// Function to get margin classes
const getElementMargin = (customMargin) => {
  return customMargin || 'mb-8'
}
</script>
