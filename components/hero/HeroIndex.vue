<style scoped>
h1 {
  font-weight: 100;
}

/* Анимируем только свечение, а не сам текст */
h1 :deep(.glow-text) {
  display: inline-block;
  color: #ffffff; /* текст остаётся стабильным белым */
  text-shadow:
    0 0 0 rgba(200, 155, 255, 0),
    0 0 0 rgba(128, 0, 255, 0);
  animation: pulse-glow 2.4s ease-in-out infinite;
  will-change: text-shadow;
}

/* Пульсирующее свечение без мигания текста */
@keyframes pulse-glow {
  0%,
  100% {
    text-shadow:
      0 0 0 rgba(200, 155, 255, 0),
      0 0 0 rgba(128, 0, 255, 0);
  }
  50% {
    text-shadow:
      0 0 12px rgba(200, 155, 255, 0.9),
      0 0 32px rgba(128, 0, 255, 1);
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
    <GlowEffect />
    <ParticleEffect />

    <!-- Content -->
    <div class="max-w-[1248px] mx-auto text-center px-6 relative z-10 w-full">
      <h1
        class="text-4xl sm:text-6xl font-extrabold mb-8 leading-tight"
        v-html="title"
      ></h1>
      <p class="text-base sm:text-[16px] font-medium mb-8 text-[#d4d4d4]">
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

