<template>
  <section :id="id || undefined" class="border-t border-[#636363] bg-[#161616]">
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
<style scoped>
/* Увеличиваем glow эффект только в этом компоненте */
:deep(.glow) {
  background: radial-gradient(circle at var(--pos, 50% 50%),
      rgba(0, 102, 255, 0.4) 0%,
      rgba(0, 102, 255, 0.4) 3%,
      rgba(166, 32, 255, 0.3) 3%,
      rgba(166, 32, 255, 0.3) 40%,
      transparent 80%);  /* Было 50%, стало 80% - эффект больше */
  mask-image: radial-gradient(circle at var(--pos, 80% 80%), black 0%, transparent 80%);  /* Было 30%, стало 50% */
  -webkit-mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 40%);  /* Было 20%, стало 40% */
  filter: blur(40px);  /* Было 20px, стало 40px - более размытый */
}
</style>
