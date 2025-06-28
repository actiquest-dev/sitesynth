<template>
  <section :class="`${bgColor}`">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 px-6 pb-[1.5rem]">
      <div></div>
      <h2 :class="`text-left text-4xl ${h2Color} px-6`">{{ sectionTitle }}</h2>
    </div>
    <div :class="`border-t border-b border-[#636363] ${contentBgColor}`">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 px-6">
        <!-- Image Section -->
        <div class="py-12 p-6 border-r border-[#636363]">
          <img :src="imageSrc" :alt="imageAlt">
        </div>

        <!-- Content Section -->
        <div class="py-12 px-8">
          <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">{{ mainTitle }}</h2>
          <p :class="`leading-relaxed ${textColor}`">{{ mainDescription }}</p>

          <!-- Dynamic Links -->
          <div class="flex flex-wrap gap-4 py-10">
            <a v-for="(link, index) in links" :key="index" :href="link.url"
              :class="`${tagBgColor} ${tagTextColor} border-1 ${borderColor} px-6 py-3 rounded-[49px] inline-block`">
              {{ link.text }}
            </a>
          </div>

          <!-- Tools Section -->
          <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">{{ toolsTitle }}</h2>
          <ul :class="`list-disc pl-6 ${textColor}`">
            <li v-for="(tool, index) in tools" :key="index">{{ tool }}</li>
          </ul>
        </div>
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
  tools: Array,
  bgColor: {
    type: String,
    default: 'bg-[#DDDDDD]'
  },
  contentBgColor: {
    type: String,
    default: 'bg-[#DDDDDD]'
  },
  textColor: {
    type: String,
    default: 'text-[#161616]'
  },
  h2Color: {
    type: String,
    default: 'text-[#161616]'
  },
  tagBgColor: {
    type: String,
    default: 'bg-[#161616]'
  },
  tagTextColor: {
    type: String,
    default: 'text-white'
  },
  borderColor: {
    type: String,
    default: 'border-white'
  },
});
</script>
