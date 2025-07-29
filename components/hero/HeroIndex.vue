<template>
  <!-- Hero Section -->
  <section class="w-full h-[100vh] bg-[#161616] text-white relative overflow-hidden flex items-center justify-center hero-section group">
    <GlowEffect />
    <div class="max-w-6xl mx-auto text-center px-6 relative z-10 w-full">
      <h1 class="text-4xl sm:text-6xl font-extrabold mb-8">{{ title }}</h1>
      <p class="text-base sm:text-[16px] font-medium mb-8">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
});
</script>
