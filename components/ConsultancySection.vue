<style scoped>
.glow {
  background: radial-gradient(circle at var(--pos, 50% 50%),
      rgba(0, 102, 255, 0.4) 0%,
      rgba(0, 102, 255, 0.4) 1%,
      rgba(166, 32, 255, 0.3) 1%,
      rgba(166, 32, 255, 0.3) 35%,
      transparent 50%);
  mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 40%);
  -webkit-mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 40%);
  filter: blur(20px);
  transition: opacity 0.3s ease;
  pointer-events: none;
}
</style>

<template>
  <section class="group relative overflow-hidden border-t border-b border-[#636363] bg-[#161616] services">
    <!-- Glowing overlay -->
    <div class="glow absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"></div>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">
      <!-- Left Column -->
      <div class="py-12 md:pr-6 md:border-r border-[#636363]">
        <h2 class="text-3xl font-bold text-white">{{ leftTitle }}</h2>
        <div v-for="(item, index) in leftItems" :key="index" class="mt-6">
          <h3 class="text-xl font-semibold text-white flex items-center gap-2">{{ item.icon }} {{ item.title }}</h3>
          <p class="text-gray-300 mt-2">{{ item.description }}</p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="py-12 md:pl-6">
        <h2 class="text-3xl font-bold text-white">{{ rightTitle }}</h2>
        <div v-for="(item, index) in rightItems" :key="index" class="mt-6">
          <h3 class="text-xl text-white font-semibold flex items-center gap-2">{{ item.icon }} {{ item.title }}</h3>
          <p class="text-gray-300 mt-2">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { defineProps } from 'vue'

defineProps({
  leftTitle: String,
  leftItems: Array,
  rightTitle: String,
  rightItems: Array
})

let glowListener = null

onMounted(() => {
  const section = document.querySelector('section.group')
  const glow = section?.querySelector('.glow')
  if (!section || !glow) return

  const handlePointerMove = (e) => {
    const rect = section.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100
    glow.style.setProperty('--pos', `${xPercent}% ${yPercent}%`)
  }

  section.addEventListener('pointermove', handlePointerMove)
  glowListener = handlePointerMove
})

onBeforeUnmount(() => {
  const section = document.querySelector('section.group')
  if (section && glowListener) {
    section.removeEventListener('pointermove', glowListener)
  }
})
</script>
