<template>
  <!-- Carousel Section -->
  <section
    :id="id || undefined"
    class="relative bg-[#161616] pt-16 pb-16 border-t border-b border-[#636363]"
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
      slidesPerView: 2,
      spaceBetween: 20,
      breakpoints: {
        640: { slidesPerView: 3, spaceBetween: 24 },
        1024: { slidesPerView: 7, spaceBetween: 36 },
      },
      loop: true,
      speed: 5200,
      allowTouchMove: false,
      autoplay: {
        delay: 0,
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

<style scoped>
:deep(.pictures-swiper .swiper-wrapper) {
  transition-timing-function: linear !important;
}

:deep(.pictures-swiper .swiper-slide) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.pictures-swiper .swiper-slide img) {
  height: 58px;
  width: auto;
  max-width: 240px;
  object-fit: contain;
}

@media (max-width: 1024px) {
  :deep(.pictures-swiper .swiper-slide img) {
    height: 46px;
    max-width: 210px;
  }
}
</style>
