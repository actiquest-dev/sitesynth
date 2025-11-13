<template>
  <section
    :id="id || undefined"
    class="group relative overflow-hidden border-t border-b border-[#636363] bg-[#161616] services"
  >
    <GlowEffect />
    
    <!-- Background SVG - fixed to corner -->
    <img 
      src="/assets/gradients/blur-sphere-free.svg"
      alt=""
      class="absolute bottom-0 right-0 pointer-events-none opacity-100"
      style="width: auto; height: auto;"
    />
    
    <!-- Content -->
    <div
      class="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10"
    >
      <!-- Left Column -->
      <div class="py-16 md:pr-12 md:border-r border-[#636363]">
        <h2 class="text-3xl font-bold text-white">{{ leftTitle }}</h2>
        <div v-for="(item, index) in leftItems" :key="index" class="mt-16">
          <h3 class="text-xl font-semibold text-white flex items-center gap-2">
            {{ item.icon }} {{ item.title }}
          </h3>
          <p class="text-[#999999] mt-3 font-light leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
      
      <!-- Right Column -->
      <div class="py-16 md:pl-12">
        <h2 class="text-3xl font-bold text-white">{{ rightTitle }}</h2>
        <div v-for="(item, index) in rightItems" :key="index" class="mt-16">
          <h3 class="text-xl text-white font-semibold flex items-center gap-2">
            {{ item.icon }} {{ item.title }}
          </h3>
          <p class="text-[#999999] mt-3 font-light leading-relaxed">{{ item.description }}</p>
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
  leftTitle: String,
  leftItems: Array,
  rightTitle: String,
  rightItems: Array,
});
</script>
