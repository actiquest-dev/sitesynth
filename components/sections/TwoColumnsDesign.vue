<template>
  <section :id="id || undefined" :class="`group relative overflow-hidden border-t border-b border-[#636363] ${sectionBgColor}`">
    
    <!-- Content -->
    <div class="mx-auto grid grid-cols-1 md:grid-cols-2 relative z-10">
      <component :is="selectedGlowEffect" />
      
      <!-- Left Column -->
      <slot name="left"></slot>
      
      <!-- Right Column -->
      <slot name="right"></slot>
    </div>
    
  </section>
</template>

<script setup>

import { defineAsyncComponent, computed } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  // Styling props
  sectionBgColor: {
    type: String,
    default: 'bg-[#161616]'
  },
  glowEffect: {
    type: String,
    default: 'GlowEffect'
  },
})

// Dynamically load the glow component by name from the effects folder
const selectedGlowEffect = computed(() =>
    defineAsyncComponent(() =>
        import(`@/components/effects/${props.glowEffect}.vue`)
    )
)
</script>
