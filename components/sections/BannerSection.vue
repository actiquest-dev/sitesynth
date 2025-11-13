<template>
  <section 
    :id="id || undefined" 
    :class="sectionClass"
    class="relative overflow-hidden"
  >
    <!-- Gradient Background (optional) -->
    <div 
      v-if="showGradient"
      class="absolute inset-0 pointer-events-none"
      :style="{
        backgroundImage: 'url(public/assets/gradients/gradient-for-banner-section.svg)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }"
    ></div>

    <component :is="tag" :class="contentClass" class="relative z-10">
      <span v-html="text"></span>
    </component>
  </section>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    default: "",
  },
  tag: {
    type: String,
    default: "h2",
  },
  text: {
    type: String,
    required: true,
  },
  sectionClass: {
    type: String,
    default: "py-20 bg-[#161616] text-white text-center",
  },
  contentClass: {
    type: String,
    default: "max-w-[1248px] mx-auto text-4xl text-white",
  },
  showGradient: {
    type: Boolean,
    default: false,
  },
});
</script>
