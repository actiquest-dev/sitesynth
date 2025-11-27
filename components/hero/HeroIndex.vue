<style scoped>
h1 {
  font-weight: 100;
  /* Убрали text-shadow отсюда! */
}

/* Используем :deep() для v-html контента */
h1 :deep(.glow-text) {
  animation: pulse-glow 2s ease-in-out infinite;
  display: inline-block;
  text-shadow: 
    0 0 10px #C89BFF,
    0 0 30px #8000FF;
  will-change: opacity;
}

/* Оптимизированная анимация пульсации через opacity */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
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
