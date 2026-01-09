<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden"
  >
    <GlowEffect />
    <div class="relative max-w-[1248px] mx-auto px-6 pt-[6rem] pb-[6rem]">
      <div class="text-center px-6">
        <img :src="imageSrc" :alt="imageAlt" class="mx-auto block w-20 pb-6" />
        <h2 class="text-4xl font-extrabold mb-10">{{ title }}</h2>
        <h3 class="text-2xl font-normal mb-10">{{ h3 }}</h3>
        <p class="text-base sm:text-lg font-normal">{{ description }}</p>

        <!-- Call-to-Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-center gap-4 mt-6"
          :style="{ '--hover': hover }"
        >
          <a
            :href="primaryLink"
            class="cta-btn cta-primary px-6 py-2 border font-semibold transition-colors duration-[1000ms] inline-flex items-center justify-center"
          >
            {{ primaryText }}
          </a>

          <a
            :href="secondaryLink"
            class="cta-btn cta-secondary px-6 py-2 border font-semibold transition-colors duration-[1000ms] inline-flex items-center justify-center"
          >
            {{ secondaryText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "" },
  title: String,
  h3: String,
  description: String,
  imageSrc: String,
  imageAlt: String,
  primaryText: String,
  primaryLink: String,
  secondaryText: String,
  secondaryLink: String,

  // hover color for both buttons
  hover: { type: String, default: "#8D35FF" },

  // second button background (true white by default)
  secondaryBg: { type: String, default: "#FFFFFF" }, // set "#DDDDDD" if you prefer
});
</script>

<style scoped>
/* Shared hover */
.cta-btn:hover {
  background: var(--hover);
  border-color: var(--hover);
  color: #ffffff;
}

/* Primary: black bg, WHITE border */
.cta-primary {
  background: #161616;
  color: #ffffff;
  border-color: #ffffff;
}

/* Secondary: WHITE bg (or #DDDDDD), BLACK border */
.cta-secondary {
  background: v-bind(secondaryBg);
  color: #161616;
  border-color: #161616;
}
</style>

