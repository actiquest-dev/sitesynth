<template>

  <section class="border-t border-[#636363] bg-[#161616]">
    <div class="max-w-6xl mx-auto px-6">
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div v-for="(offer, index) in offers" :key="index"
          class="column-box group relative overflow-hidden z-0 border border-[#636363] p-6 py-12 cursor-pointer bg-[#161616] hover:bg-white/10 transition-colors duration-300">
          <GlowEffect />

          <!-- Content -->
          <img :src="offer.imageSrc" :alt="offer.imageAlt" class="mb-4 w-auto max-w-full" />
          <h3 class="text-xl font-semibold text-white pt-6 pb-8">{{ offer.title }}</h3>
          <p class="text-[#999999] mt-2">{{ offer.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>

defineProps({
  offers: Array
});

</script>
