<template>
  <!-- Hero Section -->
  <section class="w-full h-[100vh] bg-[#161616] text-white relative overflow-hidden flex items-center justify-center hero-section group">
    <GlowEffect />
    <div class="max-w-6xl mx-auto text-center px-6 relative z-10 w-full">
      <h1 class="text-4xl sm:text-5xl font-extrabold mb-6">{{ title }}</h1>
      <h2 class="text-base sm:text-[17px] font-medium mb-8">{{ subtitle }}</h2>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
});
</script>
