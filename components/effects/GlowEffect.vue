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
  background: radial-gradient(
    360px 360px at var(--pos, 50% 50%),
    rgba(141, 53, 255, 0.13) 0%,
    rgba(141, 53, 255, 0.09) 34%,
    rgba(141, 53, 255, 0.045) 58%,
    rgba(141, 53, 255, 0.018) 76%,
    transparent 100%
  );
  filter: blur(22px);
  will-change: transform, opacity;
  transition: opacity 0.4s ease;
}

</style>
