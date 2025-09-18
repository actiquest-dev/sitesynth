<template>
  <section
    :id="id || undefined"
    :class="`${bgColor} group relative overflow-hidden services pt-20`"
  >
    <GlowEffect />
    <div class="flex justify-center">
      <div :class="`${bgDivider} w-full md:w-2/4 p-14 shadow-lg`">
        <h2 class="text-3xl font-bold text-white text-center mb-10">
          {{ title }}
        </h2>
        <div v-for="(item, index) in items" :key="index" class="mb-8 last:mb-0">
          <h3 class="text-xl font-semibold text-white flex items-center gap-2">
            {{ item.icon }} {{ item.title }}
          </h3>
          <p class="text-gray-200 mt-2">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// import { defineProps } from 'vue'

defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  items: Array,
  bgColor: {
    type: String,
    default: "bg-[#161616]",
  },
  bgDivider: {
    type: String,
    default: "bg-[#FFFFFF24]",
  },
});
</script>
