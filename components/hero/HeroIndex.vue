<style scoped>
h1 {
  font-weight: 100;
  /* Убрали text-shadow отсюда! */
}

/* Используем :deep() для v-html контента */
h1 :deep(.glow-text) {
  animation: pulse-glow 2s ease-in-out infinite;
  display: inline-block;
}

/* Анимация пульсации свечения */
@keyframes pulse-glow {
  0%, 100% {
    text-shadow: 
      0 0 10px #7de7ff,
      0 0 20px #7de7ff,
      0 0 30px #7de7ff,
      0 0 40px #00d4ff,
      0 0 70px #00d4ff;
  }
  50% {
    text-shadow: 
      0 0 20px #7de7ff,
      0 0 30px #7de7ff,
      0 0 40px #7de7ff,
      0 0 60px #00d4ff,
      0 0 90px #00d4ff,
      0 0 110px #00d4ff;
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
