<template>
  <section :id="id || undefined" :class="`${bgColor} group relative overflow-hidden border-t border-b border-[#636363] services`">
    <GlowEffect />

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">
      <!-- Left Column -->
      <div class="py-24 md:pr-6 md:border-r border-[#636363] flex items-center justify-center">
        <img :src="leftImgSrc" :alt="leftImgAlt" class="max-w-full h-auto" />
      </div>

      <!-- Right Column -->
      <div class="py-24 md:pl-6 flex items-center justify-center">
        <img :src="rightImgSrc" :alt="rightImgAlt" class="max-w-full h-auto" />
      </div>
    </div>
    
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: ''
  },
  leftImgSrc: String,
  leftImgAlt: String,
  rightImgSrc: String,
  rightImgAlt: String,
  bgColor: {
    type: String,
    default: 'bg-[#161616]'
  }
})
</script>
