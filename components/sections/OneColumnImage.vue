<template>
  <section
    :id="id || undefined"
    class="group relative overflow-hidden border-t border-[#636363] bg-[#161616] services"
  >
    <component :is="selectedGlowEffect" />

    <!-- Content -->
    <div
      :class="`max-w-[1248px] px-6 mx-auto ${padding} flex justify-center items-center relative z-10`"
    >
      <img :src="centerImg" :alt="centerImgAlt" class="max-w-full h-auto" />
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
  centerImg: String,
  centerImgAlt: String,
  glowEffect: {
    type: String,
    default: "GlowEffect",
  },
  padding: {
    type: String,
    default: "",
  },
});

// Dynamically load the glow component by name from the effects folder
const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);
</script>
