<template>
  <section :id="id || undefined" class="group relative overflow-hidden border-t border-b border-[#636363] bg-[#161616] services">

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10">
      <!-- Left Column -->
      <div class="py-12 md:pr-6 md:border-r border-[#636363] flex flex-col items-start">
        <div class="flex items-center mb-[2rem]">
          <img :src="leftImgSrc" :alt="leftImgAlt" class="w-10 h-10 object-contain mr-3" />
          <h2 class="text-3xl font-bold text-white">{{ leftH2 }}</h2>
        </div>
        <h3 class="text-xl font-semibold text-white flex items-center gap-2 mb-2">{{ leftH3 }}</h3>
        <p class="text-gray-300 mb-2 whitespace-pre-line">{{ leftP }}</p>
        <a :href="leftLearnMoreLink" class="text-[#8CB0FF] pt-4">
          {{ leftLearnMoreText }}
          <i class="ml-1 fa-solid fa-chevron-right text-sm"></i>
        </a>
      </div>

      <!-- Right Column -->
      <div class="py-12 md:pl-6 flex flex-col items-start">
        <div class="flex items-center mb-[2rem]">
          <img :src="rightImgSrc" :alt="rightImgAlt" class="w-10 h-10 object-contain mr-3" />
          <h2 class="text-3xl font-bold text-white">{{ rightH2 }}</h2>
        </div>
        <h3 class="text-xl font-semibold text-white flex items-center gap-2 mb-2">{{ rightH3 }}</h3>
        <p class="text-gray-300 mb-2 whitespace-pre-line">{{ rightP }}</p>
        <a :href="rightLearnMoreLink" class="text-[#8CB0FF] pt-4 flex items-center">
          {{ rightLearnMoreText }}
          <i class="ml-1 fa-solid fa-chevron-right text-sm"></i>
        </a>
      </div>
    </div>
    
  </section>
</template>

<script setup>

defineProps({
  id: {
    type: String,
    default: ''
  },
  leftImgSrc: String,
  leftImgAlt: String,
  leftH2: String,
  leftH3: String,
  leftP: String,
  leftLearnMoreText: String,
  leftLearnMoreLink: String,
  rightImgSrc: String,
  rightImgAlt: String,
  rightH2: String,
  rightH3: String,
  rightP: String,
  rightLearnMoreText: String,
  rightLearnMoreLink: String
})

</script>
