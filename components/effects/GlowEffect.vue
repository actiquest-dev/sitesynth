<!-- components/GlowEffect.vue -->
<template>
  <div ref="glowEl"
       class="glow absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
       :class="hoverClass"
       :style="{ '--pos': glowPos }">
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
  hoverClass: {
    type: String,
    default: 'group-hover:opacity-100'
  }
})

const glowEl = ref(null)
const glowPos = ref('50% 50%')
let parentEl = null

const handlePointerMove = (e) => {
  const rect = parentEl.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const xPercent = (x / rect.width) * 100
  const yPercent = (y / rect.height) * 100
  glowPos.value = `${xPercent}% ${yPercent}%`
}

onMounted(() => {
  parentEl = glowEl.value?.parentElement
  if (parentEl) {
    parentEl.addEventListener('pointermove', handlePointerMove)
  }
})

onBeforeUnmount(() => {
  if (parentEl) {
    parentEl.removeEventListener('pointermove', handlePointerMove)
  }
})

</script>

<style scoped>
.glow {
  background: radial-gradient(circle at var(--pos, 50% 50%),
      var(--glow-c1, rgba(168, 102, 255, 0.22)) 0%,
      var(--glow-c2, rgba(168, 102, 255, 0.16)) 12%,
      var(--glow-c3, rgba(141, 53, 255, 0.14)) 30%,
      var(--glow-c4, rgba(141, 53, 255, 0.08)) 45%,
      transparent 65%);
  mask-image: radial-gradient(circle at var(--pos, 50% 50%), rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.45) 26%, transparent 58%);
  -webkit-mask-image: radial-gradient(circle at var(--pos, 50% 50%), rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.45) 26%, transparent 58%);
  filter: blur(44px);
  transition: opacity 0.4s ease;
}

</style>
