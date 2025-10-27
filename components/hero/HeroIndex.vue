<style scoped>
h1 {
  text-shadow: 0 0 12px #fff, 0 0 22px #7de7ff, 0 0 42px #7de7ff;
  font-weight: 100;
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
