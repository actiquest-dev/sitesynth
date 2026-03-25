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

/* CTA border effect (matches Cabinet tab style) */
@property --hero-cta-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes hero-cta-spin {
  from { --hero-cta-angle: 0deg; }
  to { --hero-cta-angle: 360deg; }
}

.hero-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  text-decoration: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.hero-cta-border {
  position: absolute;
  inset: -1px;
  border-radius: 0;
  pointer-events: none;
  opacity: 0;
  background: conic-gradient(
    from var(--hero-cta-angle),
    transparent 0%,
    transparent 55%,
    rgba(140, 0, 255, 0) 60%,
    rgba(205, 97, 255, 1) 68%,
    rgba(120, 190, 255, 1) 72%,
    rgba(205, 97, 255, 1) 76%,
    rgba(140, 0, 255, 0) 82%,
    transparent 87%,
    transparent 100%
  );
  animation: hero-cta-spin 3s linear infinite;
  filter: drop-shadow(0 0 14px rgba(173, 80, 255, 0.55));
  transition: opacity 180ms ease;
}

.hero-cta-bg {
  position: absolute;
  inset: 1px;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(205, 120, 255, 0.48);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.22),
    0 12px 36px rgba(0, 0, 0, 0.45);
  transition: border-color 180ms ease, background 180ms ease, box-shadow 220ms ease;
}

.hero-cta-label {
  position: relative;
  z-index: 2;
  padding: 14px 28px;
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  letter-spacing: 0.01em;
  color: #ffffff;
}

.hero-cta:hover .hero-cta-border,
.hero-cta:focus-visible .hero-cta-border {
  opacity: 1;
}

.hero-cta:hover .hero-cta-bg,
.hero-cta:focus-visible .hero-cta-bg {
  border-color: rgba(220, 140, 255, 0.85);
  background: rgba(141, 53, 255, 0.16);
  box-shadow:
    0 0 0 1px rgba(141, 53, 255, 0.35),
    0 0 26px rgba(173, 80, 255, 0.22),
    0 14px 40px rgba(0, 0, 0, 0.55);
}

.hero-cta:active .hero-cta-bg {
  background: rgba(141, 53, 255, 0.18);
}

@media (prefers-reduced-motion: reduce) {
  .hero-cta-border {
    animation: none;
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
      <NuxtLink
        v-if="ctaText"
        :to="ctaHref"
        class="hero-cta"
      >
        <span class="hero-cta-border" aria-hidden="true"></span>
        <span class="hero-cta-bg" aria-hidden="true"></span>
        <span class="hero-cta-label">{{ ctaText }}</span>
      </NuxtLink>
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
  ctaText: {
    type: String,
    default: "",
  },
  ctaHref: {
    type: String,
    default: "/",
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
