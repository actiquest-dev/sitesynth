<style scoped>
h1 {
  font-weight: 100;
  /* Убрали text-shadow отсюда! */
}

/* Используем :deep() для v-html контента */
/* Use :deep() for v-html content. Reduce paint cost by animating opacity only
   and keeping the (reduced) text-shadow static. This moves the animation to
   the compositor (much cheaper) and avoids repeated expensive repaints. */
h1 :deep(.glow-text) {
  display: inline-block;
  /* Static (reduced) glow - kept simple to avoid heavy paints */
  text-shadow:
    0 0 6px #C89BFF,
    0 0 12px #C89BFF,
    0 0 18px #8000FF;
  will-change: opacity, transform;
  transform: translateZ(0);
  /* animate opacity only (compositor-friendly) */
  animation: pulse-opacity 2000ms ease-in-out infinite;
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.86; }
}

/* Respect user's reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  h1 :deep(.glow-text) {
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
<template>
  <!-- Hero Section -->
  <section
    :id="id || undefined"
    class="w-full h-[100vh] bg-[#161616] text-white relative overflow-hidden flex items-center justify-center hero-section group"
    :style="
      backgroundImage
        ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
        : ''
    "
  >
    <GlowEffect />
    <ParticleEffect />
    <div class="max-w-[1248px] mx-auto text-center px-6 relative z-10 w-full">
      <h1 class="text-4xl sm:text-6xl font-extrabold mb-8" v-html="title"></h1>
      <p class="text-base sm:text-[16px] font-medium mb-8">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  subtitle: String,
  backgroundImage: String,
});
</script>
