<template>
  <section
    :id="id || undefined"
    :class="`group relative overflow-hidden border-t border-b border-[#636363] ${sectionBgColor}`"
  >
    <!-- Glow-эффект (над фоном, под контентом) -->
    <component :is="selectedGlowEffect" />

    <!-- Контейнер по сетке сайта -->
    <div class="relative z-10 max-w-[1248px] mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Left Column -->
        <slot name="left"></slot>

        <!-- Right Column -->
        <slot name="right"></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent, computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  sectionBgColor: {
    type: String,
    default: "bg-[#161616]",
  },
  glowEffect: {
    type: String,
    default: "GlowEffect",
  },
});

const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);
</script>

  <!-- Hero Section -->
  <section
    :id="id || undefined"
    class="w-full h-[100vh] bg-[#161616] text-white relative overflow-hidden flex items-center justify-center hero-section group"
    :style="
      backgroundImage
        ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
        : ''
    "
  >
    <GlowEffect />
    <ParticleEffect />
    <div class="max-w-[1248px] mx-auto text-center px-6 relative z-10 w-full">
      <h1 class="text-4xl sm:text-6xl font-extrabold mb-8" v-html="title"></h1>
      <p class="text-base sm:text-[16px] font-medium mb-8">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  subtitle: String,
  backgroundImage: String,
});
</script>
