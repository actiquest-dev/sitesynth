<template>
  <section
    :id="id || undefined"
    :class="`${bgColor} group relative overflow-hidden border-t border-b border-[#333] services`"
  >
    <GlowEffect />

    <!-- FULL WIDTH GRID (как TwoColumns) -->
    <div class="mx-auto grid grid-cols-1 md:grid-cols-2 relative z-10">
      <!-- Left Image (full-bleed) -->
      <div class="md:border-r border-[#333]">
        <img
          :src="leftImgSrc"
          :alt="leftImgAlt"
          class="w-full h-full block object-cover"
        />
      </div>

      <!-- Right Image (full-bleed) -->
      <div class="border-t border-[#333] md:border-t-0">
        <img
          :src="rightImgSrc"
          :alt="rightImgAlt"
          class="w-full h-full block object-cover"
        />
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
  leftImgSrc: String,
  leftImgAlt: String,
  rightImgSrc: String,
  rightImgAlt: String,
  bgColor: {
    type: String,
    default: "bg-[#161616]",
  },
});
</script>
