<template>
<section 
  :id="id || undefined" 
    <div class="max-w-[1248px] mx-auto px-6">
  class="what-we-offer-section border-t border-[#363636] bg-[#161616]"
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <NuxtLink
          v-for="(offer, index) in offers"
          :key="index"
          :to="offer.link"
          class="column-box group relative overflow-hidden z-0 border-l border-r border-[#636363] p-6 py-12 cursor-pointer bg-[#161616] hover:bg-white/10 transition-colors duration-300 block no-underline"
        >
          <GlowBlue />

          <!-- Gradient Background (always visible) -->
          <div 
            class="gradient-bg absolute inset-0 opacity-100 transition-opacity duration-300 pointer-events-none"
            :style="getGradientStyle(index)"
          ></div>

          <!-- Content -->
          <div class="relative z-10">
            <img
              :src="offer.imageSrc"
              :alt="offer.imageAlt"
              class="mb-4 w-auto max-w-full"
            />
            <h3 class="text-xl font-semibold text-white pt-6 pb-8">
              {{ offer.title }}
            </h3>
            <p class="text-[#999999] mt-2">{{ offer.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
  offers: Array,
});

// Function to get gradient background style for each card
const getGradientStyle = (index) => {
  const gradients = [
    'url(/assets/gradients/gradient-bottom-left.svg)',
    'url(/assets/gradients/gradient-top-left.svg)',
    'url(/assets/gradients/gradient-bottom-right.svg)',
    'url(/assets/gradients/gradient-top-right.svg)',
  ];
  
  return {
    backgroundImage: gradients[index % 4],
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
};
</script>
<style>
/* Убираем scoped! */
.what-we-offer-section .glow {
  background: radial-gradient(circle at var(--pos, 50% 50%),
      rgba(21, 0, 255, 0.5) 0%,
      rgba(21, 0, 255, 0.5) 5%,
      rgba(21, 0, 255, 0.4) 5%,
      rgba(21, 0, 255, 0.3) 50%,
      transparent 100%) !important;
  mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 70%) !important;
  -webkit-mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 60%) !important;
  filter: blur(60px) !important;
}
</style>
