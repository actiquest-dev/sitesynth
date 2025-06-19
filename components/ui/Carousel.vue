<template>
  <!-- Carousel Section -->
  <section class="relative bg-[#161616] pt-[4rem] pb-[4rem] border-t border-b border-[#636363]">
    <!-- Left Transparent Overlay -->
    <div class="absolute top-0 left-0 w-70 h-full bg-gradient-to-r from-[#161616] to-transparent pointer-events-none z-10 fade-left"></div>
    <!-- Right Transparent Overlay -->
    <div class="absolute top-0 right-0 w-70 h-full bg-gradient-to-l from-[#161616] to-transparent pointer-events-none z-10"></div>

    <div class="swiper pictures-swiper">
      <div class="swiper-wrapper">
        <div v-for="image in images" :key="image.src" class="swiper-slide">
          <a :href="image.link" target="_blank">
            <img :src="image.src" :alt="image.alt" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  images: Array
})

import { onMounted } from 'vue'

onMounted(() => {
  if (window.Swiper) {
    new window.Swiper('.pictures-swiper', {
      slidesPerView: 1,
      spaceBetween: 16,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 6, spaceBetween: 30 },
      },
      loop: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })
  }
})
</script>
