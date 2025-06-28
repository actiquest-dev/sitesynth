<template>
  <section class="border-t border-b border-[#636363] bg-[#DDDDDD]">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
      <!-- Left Column (Expandable Sections) -->
      <div class="border-r border-[#636363] py-12 pr-12">
        <div v-for="(section, index) in sections" :key="index" class="toggle-section border-t border-[#636363] pt-4 mt-4" :class="index === 0 ? 'border-t-0' : ''">
          <h3
            :class="['flex items-center justify-between cursor-pointer', openIndex === index ? 'text-[#161616] text-2xl font-bold' : 'text-[#636363] text-xl font-semibold']"
            @click="toggle(index)"
          >
            {{ section.title }}
            <span class="text-[#2D68E8] toggle-btn">{{ openIndex === index ? '−' : '+' }}</span>
          </h3>
          <div class="toggle-content transition-all duration-500 ease-in-out overflow-hidden" :class="openIndex === index ? 'max-h-[500px]' : 'max-h-0'">
            <p class="text-[#161616] mt-2">{{ section.description }}</p>
            <a :href="section.link" class="text-[#8CB0FF] font-semibold mt-4 inline-block pb-8 hover:text-[#A620FF] transition-colors duration-1000">
              {{ section.linkText }}
            </a>
          </div>
        </div>
      </div>

      <!-- Right Column (Image) -->
      <div>
        <img :src="imageSrc" :alt="imageAlt">
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  sections: Array,
  imageSrc: String,
  imageAlt: String
})

// 0: Discover, 1: Define, 2: Design, 3: Deliver
const openIndex = ref(0)
function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx
}
</script>
