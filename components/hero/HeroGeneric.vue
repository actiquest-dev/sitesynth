<template> 
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden bg-cover bg-no-repeat"
    :class="backgroundPosition"
    :style="backgroundImageStyle"
  >
    <component
      :is="selectedGlowEffect"
      :class="[
        subtlePointerGlow ? 'hero-pointer-glow' : '',
        subtlePointerGlow && glowEffect === 'GlowRed' ? 'hero-pointer-glow-red' : '',
        subtlePointerGlow && glowEffect !== 'GlowRed' ? 'hero-pointer-glow-violet' : '',
      ]"
    />
    <ParticleEffect :variant="particleVariant" />

    <div
      class="relative max-w-[1248px] mx-auto px-6"
      :class="paddingClasses"
    >
      <!-- TEXT BLOCK -->
      <div class="text-center px-6 max-w-4xl mx-auto">
        <!-- Logo -->
        <div v-if="logo" class="mb-8 flex justify-center">
          <img
            :src="logo.src"
            :alt="logo.alt || 'Logo'"
            :class="logo.class || 'h-16 w-auto'"
          />
        </div>

        <!-- Dynamic Content Elements -->
        <div
          v-for="(element, index) in content"
          :key="index"
          :class="getElementMargin(element.margin)"
        >
          <component
            :is="element.tag"
            :class="getElementClasses(element.tag, element.textColor)"
          >
            <span v-html="element.text"></span>
          </component>
        </div>
      </div>

      <!-- MEDIA BLOCK (OUTSIDE text container) -->
      <div
        v-if="$slots.media"
        class="mt-12 w-full flex justify-center"
      >
        <slot name="media" />
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
  logo: {
    type: Object,
    default: null,
  },
  content: {
    type: Array,
    required: true,
  },
  glowEffect: {
    type: String,
    default: "GlowEffect",
  },
  backgroundImage: {
    type: String,
    default: null,
  },
  backgroundPosition: {
    type: String,
    default: "bg-center",
  },
  paddingClasses: {
    type: String,
    default: "",
  },
  particleVariant: {
    type: String,
    default: "violet",
  },
  subtlePointerGlow: {
    type: Boolean,
    default: false,
  },
});

// Background image style
const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {};
});

// Text styles
const getElementClasses = (tag, customTextColor) => {
  const textColor = customTextColor || "text-white";

  switch (tag) {
    case "h1":
      return `${textColor} text-4xl sm:text-5xl font-extrabold`;
    case "h2":
      return `${textColor} text-3xl sm:text-4xl font-bold`;
    case "h3":
      return `${textColor} text-2xl sm:text-3xl font-bold`;
    case "h4":
      return `${textColor} text-xl sm:text-2xl font-semibold`;
    case "h5":
      return `${textColor} text-lg sm:text-xl font-semibold`;
    case "h6":
      return `${textColor} text-base sm:text-lg font-semibold`;
    case "p":
      return `${textColor} text-base sm:text-lg font-normal`;
    default:
      return `${textColor} text-base`;
  }
};

// Glow component loader
const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);

// Margins
const getElementMargin = (customMargin) => {
  return customMargin || "mb-8";
};
</script>

<style scoped>
:deep(.hero-pointer-glow.hero-pointer-glow-violet.glow) {
  background: radial-gradient(
    320px 320px at var(--pos, 50% 50%),
    rgba(141, 53, 255, 0.11) 0%,
    rgba(141, 53, 255, 0.08) 34%,
    rgba(141, 53, 255, 0.04) 60%,
    rgba(141, 53, 255, 0.015) 78%,
    transparent 100%
  ) !important;
  filter: blur(20px) !important;
}

:deep(.hero-pointer-glow.hero-pointer-glow-red.glow) {
  background: radial-gradient(
    300px 300px at var(--pos, 50% 50%),
    rgba(170, 55, 51, 0.14) 0%,
    rgba(170, 55, 51, 0.1) 34%,
    rgba(170, 55, 51, 0.05) 60%,
    rgba(170, 55, 51, 0.02) 78%,
    transparent 100%
  ) !important;
  filter: blur(18px) !important;
}
</style>
