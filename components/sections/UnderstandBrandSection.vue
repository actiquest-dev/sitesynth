<template>
  <!-- Top Title Section -->
  <section :class="`py-20 ${bgColor}`">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 px-6">
      <h2 :class="`text-left text-4xl ${textColor}`">{{ title }}</h2>
    </div>
  </section>

  <!-- Content Section -->
  <section :class="`border-t border-b border-[#636363] ${bgColor}`">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2">
      <!-- Left Column -->
      <div class="border-r border-[#636363] py-12 p-6">
        <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">{{ leftTitle }}</h2>
        <p :class="`leading-relaxed ${textColor}`">
          {{ leftDescription }}
        </p>

        <!-- Tags -->
        <div v-if="tags?.length" class="flex flex-wrap gap-4 py-10">
          <a v-for="(tag, index) in tags" :key="index" href="#"
            :class="`${tagBgColor} ${tagTextColor} px-6 py-3 rounded-[49px] inline-block`">
            {{ tag }}
          </a>
        </div>

        <!-- Tools -->
        <h2 :class="`text-2xl font-semibold pb-6 ${textColor}`">{{ toolsTitle }}</h2>
        <ul class="list-disc pl-6" :class="textColor">
          <li v-for="(tool, index) in toolsList" :key="index">{{ tool }}</li>
        </ul>
      </div>

      <!-- Right Column Image -->
      <div class="py-12 p-6">
        <img :src="imageSrc" alt="Section image" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  bgColor: {
    type: String,
    default: 'bg-[#DDDDDD]'
  },
  textColor: {
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
  leftTitle: String,
  leftDescription: String,
  tags: Array,
  toolsTitle: String,
  toolsList: Array,
  imageSrc: String
})
</script>
