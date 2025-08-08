<template>
  <section
    :id="id || undefined"
    class="group relative overflow-hidden border-t border-b border-[#636363] bg-[#161616] services"
  >
    <GlowEffect />

    <!-- Content -->
    <div
      class="max-w-[1248px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10"
    >
      <!-- Left Column -->
      <div class="py-12 md:pr-6 md:border-r border-[#636363]">
        <h2 class="text-3xl font-bold text-white">{{ leftTitle }}</h2>
        <div v-for="(item, index) in leftItems" :key="index" class="mt-12">
          <h3 class="text-xl font-semibold text-white flex items-center gap-2">
            {{ item.icon }} {{ item.title }}
          </h3>
          <p class="text-[#999999] mt-2 font-light">{{ item.description }}</p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="py-12 md:pl-6">
        <h2 class="text-3xl font-bold text-white">{{ rightTitle }}</h2>
        <div v-for="(item, index) in rightItems" :key="index" class="mt-12">
          <h3 class="text-xl text-white font-semibold flex items-center gap-2">
            {{ item.icon }} {{ item.title }}
          </h3>
          <p class="text-[#999999] mt-2 font-light">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from "vue";

defineProps({
  id: {
    type: String,
    default: "",
  },
  leftTitle: String,
  leftItems: Array,
  rightTitle: String,
  rightItems: Array,
});
</script>
