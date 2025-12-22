<template>
  <!-- Carousel Section -->
  <section
    :id="id || undefined"
    class="relative bg-[#161616] pt-[4rem] pb-[4rem] border-t border-b border-[#636363]"
  >
    <!-- Left Transparent Overlay -->
    <div
      class="absolute top-0 left-0 w-70 h-full bg-linear-to-r from-[#161616] to-transparent pointer-events-none z-10 fade-left"
    ></div>
    <!-- Right Transparent Overlay -->
    <div
      class="absolute top-0 right-0 w-70 h-full bg-linear-to-l from-[#161616] to-transparent pointer-events-none z-10"
    ></div>

    <div class="swiper pictures-swiper" ref="swiperContainer">
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Swiper } from "swiper";
import { Navigation, Autoplay } from "swiper/modules";

defineProps({
  id: {
    type: String,
    default: "",
  },
  images: Array,
});

const swiperContainer = ref(null);
let swiper = null;

onMounted(() => {
  if (swiperContainer.value) {
    swiper = new Swiper(swiperContainer.value, {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 16,
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 6, spaceBetween: 60 },
      },
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    });
  }
});

onBeforeUnmount(() => {
  if (swiper) {
    swiper.destroy();
  }
});
</script>
