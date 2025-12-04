<template>
  <section :id="id" class="bg-[#DDDDDD] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6">
      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 relative border border-[#636363] py-14 group overflow-hidden"
      >
        <GlowEffect />

          <!-- Gradient Background -->
        <div 
          class="absolute inset-0 pointer-events-none opacity-100"
          :style="{
            backgroundImage: 'url(/assets/gradients/gradient-for-banner-section.svg)',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }"
        ></div>
        
        <!-- Left Column (1/3) -->
        <!-- Center vertically and ensure image sits above the glow overlay -->
        <div
          class="flex flex-col justify-center items-center text-center relative z-10"
        >
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-4 w-auto max-w-[150px] relative z-20"
          />
          <h4 class="text-xl font-semibold text-[#161616]">{{ personName }}</h4>
          <p class="text-[#636363] mt-2">{{ personTitle }}</p>
        </div>
        <!-- Right Column (2/3) -->
        <div class="md:col-span-2 flex flex-col justify-center px-6">
          <i class="text-6xl text-[#A620FF] fa-solid fa-quote-left"></i>
          <h3 class="text-3xl font-bold text-[#161616] mt-4 mb-6">
            {{ quoteTitle }}
          </h3>
          <p class="text-[#636363]">"{{ quoteText }}"</p>
          <a
            :href="ctaLink"
            class="mt-6 w-auto max-w-max px-4 py-2 border-[#161616] hover:bg-white hover:text-[#161616] hover:border-white bg-[#161616] text-white transition-colors duration-[1000ms] font-semibold"
          >
            <span>{{ ctaText }}</span>
          </a>
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
  imageSrc: String,
  personName: String,
  personTitle: String,
  quoteTitle: String,
  quoteText: String,
  ctaText: String,
  ctaLink: String,
});
</script>
