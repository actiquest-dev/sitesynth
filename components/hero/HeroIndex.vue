<style scoped>

:deep(.hero-pointer-glow-violet.glow) {
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

/* Glow текст — всегда светится слегка */
h1 :deep(.glow-text) {
  display: inline-block;
  color: #ffffff;

  /* Базовое свечение — всегда включено */
  text-shadow:
    0 0 6px rgba(200, 155, 255, 0.45),
    0 0 18px rgba(128, 0, 255, 0.55);

  animation: pulse-glow 2.8s ease-in-out infinite;
  will-change: text-shadow;
}

/* Пульсация только усиливает glow, но НЕ убирает его */
@keyframes pulse-glow {
  30%, 100% {
    text-shadow:
      0 0 6px rgba(200, 155, 255, 0.45),
      0 0 18px rgba(128, 0, 255, 0.55);
  }

  50% {
    text-shadow:
      0 0 14px rgba(200, 155, 255, 1),
      0 0 36px rgba(128, 0, 255, 1);
  }
}
</style>

<template>
  <!-- Hero Section -->
  <section
    :id="id || undefined"
    class="w-full h-[100vh] bg-[#161616] text-white relative overflow-hidden flex items-center justify-center hero-section group"
    :style="backgroundStyle"
  >
    <!-- Glow / Particles -->
    <GlowEffect class="hero-pointer-glow-violet" />
    <ParticleEffect />

    <!-- Content -->
    <div class="max-w-[1248px] mx-auto text-center px-6 relative z-10 w-full">
      <h1
        class="text-4xl sm:text-6xl font-extrabold mb-8 leading-tight"
        v-html="title"
      ></h1>
      <p class="text-base sm:text-lg font-normal mb-8 text-[#d4d4d4]">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import GlowEffect from "@/components/effects/GlowEffect.vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  backgroundImage: {
    type: String,
    default: "",
  },
});

const backgroundStyle = computed(() => {
  if (!props.backgroundImage) return {};
  return {
    backgroundImage: `url('${props.backgroundImage}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
});
</script>
