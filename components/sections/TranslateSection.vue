<template>
  <section class="py-20 bg-[#DDDDDD]">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 px-6">
      <div></div>
      <h2 class="text-left text-4xl text-[#161616] px-6">{{ sectionTitle }}</h2>
    </div>
  </section>

  <section class="border-t border-b border-[#636363] border-2 bg-[#DDDDDD]">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 px-6">
      <!-- Image Section -->
      <div class="py-12 p-6 border-r border-[#636363]">
        <img :src="imageSrc" :alt="imageAlt">
      </div>

      <!-- Content Section -->
      <div class="py-12 px-8">
        <h2 class="text-2xl font-semibold text-gray-800 pb-6">{{ mainTitle }}</h2>
        <p class="text-gray-600 leading-relaxed">{{ mainDescription }}</p>

        <!-- Dynamic Links -->
        <div class="flex flex-wrap gap-4 py-10">
          <a v-for="(link, index) in links" :key="index" :href="link.url" class="bg-[#161616] text-white px-6 py-3 rounded-[49px] inline-block">
            {{ link.text }}
          </a>
        </div>

        <!-- Tools Section -->
        <h2 class="text-2xl font-semibold text-gray-800 pb-6">{{ toolsTitle }}</h2>
        <ul class="list-disc pl-6 text-gray-600">
          <li v-for="(tool, index) in tools" :key="index">{{ tool }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>


<script setup>
defineProps({
  sectionTitle: String,
  imageSrc: String,
  imageAlt: String,
  mainTitle: String,
  mainDescription: String,
  links: Array,
  toolsTitle: String,
  tools: Array
});
</script>
