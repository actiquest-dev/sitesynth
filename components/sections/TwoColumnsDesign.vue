<template>
  <section class="group relative overflow-hidden border-t border-b border-[#636363] bg-[#161616] services">
    <GlowEffect />

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">
      <!-- Left Column -->
      <div class="py-24 md:pr-6 md:border-r border-[#636363]">
        <h2 class="leading-snug text-4xl font-bold text-white">{{ leftTitle }}</h2>
      </div>

      <!-- Right Column -->
      <div class="py-24 md:pl-6">
        <p class="leading-relaxed text-1xl font-bold text-white">{{ rightParagraph }}</p>
      </div>
    </div>
    
  </section>
</template>

<script setup>

defineProps({
  leftTitle: String,
  rightParagraph: String
})

</script>
