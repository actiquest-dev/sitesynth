<template>
  <section class="group relative overflow-hidden border-t border-[#636363] bg-[#161616] services">
    <GlowEffect />

    <!-- Content -->
    <div class="max-w-5xl mx-auto px-6 pt-[6rem] flex justify-center items-center relative z-10">
      <img :src="centerImg" :alt="centerImgAlt" class="max-w-full h-auto" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  centerImg: String,
  centerImgAlt: String,
})
</script>
