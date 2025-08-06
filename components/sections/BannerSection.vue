<template>
  <section :id="id || undefined" :class="sectionClass">
    <component :is="tag" :class="contentClass">
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
    default: "max-w-6xl mx-auto text-4xl text-white",
  },
});
</script>
