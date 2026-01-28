<template>
  <section :id="id || undefined" class="what-we-offer-section border-t border-[#636363] bg-[#161616]">
    <div class="max-w-[1248px] mx-auto px-6">
      <!-- One outer frame (mobile look like your screenshot) -->
      <div class="relative border border-[#636363]">
        <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="(offer, index) in offers"
            :key="index"
            :to="offer.link"
            class="group relative overflow-hidden z-0 cursor-pointer bg-[#161616] block no-underline
                   px-8 py-10 md:p-6 md:py-12
                   min-h-[320px]
                   transition-colors duration-300 hover:bg-white/10
                   border-b border-[#636363] last:border-b-0
                   md:border-b-0 md:border-r md:border-[#636363]"
            :class="[
              // remove right border on last column in each row (md = 2 cols, lg = 4 cols)
              'md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(4n)]:border-r-0'
            ]"
          >
            <!-- Glow (keep for md+; mobile screenshot has only corner gradient) -->
            <div class="hidden md:block">
              <GlowBlue />
            </div>

            <!-- Corner gradient (mobile: top corners, alternating like the screenshot) -->
            <div
              class="gradient-bg absolute inset-0 opacity-100 pointer-events-none"
              :style="getGradientStyle(index)"
            ></div>

            <!-- Content -->
            <div class="relative z-10">
              <img
                :src="offer.imageSrc"
                :alt="offer.imageAlt"
                class="w-16 h-16 object-contain mb-10"
              />

              <h3 class="text-[22px] leading-snug font-semibold text-white max-w-[260px]">
                {{ offer.title }}
              </h3>

              <p class="text-[#999999] mt-6 text-sm leading-relaxed max-w-[280px]">
                {{ offer.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
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
})

// Mobile screenshot: top-right, top-left, top-right, top-left...
const getGradientStyle = (index) => {
  const gradients = [
    'url(/assets/gradients/gradient-top-right.svg)',
    'url(/assets/gradients/gradient-top-left.svg)',
    'url(/assets/gradients/gradient-top-right.svg)',
    'url(/assets/gradients/gradient-top-left.svg)',
  ]

  return {
    backgroundImage: gradients[index % 4],
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}
</script>

<style>
/* no scoped */
.what-we-offer-section .glow {
  background: radial-gradient(
      circle at var(--pos, 50% 50%),
      rgba(21, 0, 255, 0.5) 0%,
      rgba(21, 0, 255, 0.5) 5%,
      rgba(21, 0, 255, 0.4) 5%,
      rgba(21, 0, 255, 0.3) 50%,
      transparent 100%
    ) !important;
  mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 70%) !important;
  -webkit-mask-image: radial-gradient(circle at var(--pos, 50% 50%), black 0%, transparent 60%) !important;
  filter: blur(60px) !important;
}
</style>

