<template>
  <section
    :id="id || undefined"
    :class="`group relative overflow-hidden border-t border-b border-[#636363] ${sectionBgColor}`"
  >
    <component :is="selectedGlowEffect" />
    <!-- Content -->
    <div class="mx-auto max-w-4xl px-6 py-16 relative z-10">
      <!-- Single Column Content -->
      <div class="w-full">
        <slot name="content"></slot>
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
  // Styling props
  sectionBgColor: {
    type: String,
    default: "bg-[#161616]",
  },
  glowEffect: {
    type: String,
    default: "GlowEffect",
  },
});

// Dynamically load the glow component by name from the effects folder
const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);
</script>
