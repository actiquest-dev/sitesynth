<template>
  <section class="w-full" style="background: #0a0a0a; padding: 80px 20px; display: flex; justify-content: center">
    <div class="relative w-full" style="max-width: 1141px; margin: 0">
    <!-- Spinning glow border layer -->
    <div
      class="spinning-border pointer-events-none absolute"
      style="
        inset: -1px;
        border-radius: 1px;
        background: conic-gradient(
          from var(--bangle),
          transparent 0%,
          transparent 55%,
          rgba(100, 0, 255, 0) 60%,
          rgba(165, 31, 255, 0.9) 68%,
          rgba(80, 160, 255, 1) 72%,
          rgba(165, 31, 255, 0.9) 76%,
          rgba(100, 0, 255, 0) 82%,
          transparent 87%,
          transparent 100%
        );
        z-index: 0;
      "
    />

    <!-- Main card -->
    <div
      class="relative flex w-full flex-col md:flex-row"
      style="
        min-height: 580px;
        border: 1px solid #636363;
        overflow: hidden;
        z-index: 1;
        background: #0a0a0a;
      "
    >
      <!-- Aurora background blobs -->
      <AnimatedBackground />

      <!-- Gradient orb — top-right, pulsing -->
      <div
        class="absolute pointer-events-none orb-pulse"
        style="
          top: -120px;
          right: -120px;
          width: 527px;
          height: 527px;
          z-index: 1;
        "
      >
        <OrbSvg style="width: 100%; height: 100%" />
      </div>

      <!-- Left: Text content -->
      <div
        class="flex flex-col justify-center relative"
        style="flex: 1 1 0; padding: 60px 83px; z-index: 2"
      >
        <h1
          class="text-white mb-4"
          style="
            font-family: 'Space Grotesk', 'Roc Grotesk', 'Inter', sans-serif;
            font-size: clamp(28px, 3vw, 43px);
            line-height: 1.37;
            max-width: 557px;
            font-weight: 500;
          "
        >
          Your business online in 5 days — from €500.
        </h1>

        <p
          class="text-white mb-4"
          style="
            font-family: 'Space Grotesk', 'Roc Grotesk', 'Inter', sans-serif;
            font-size: clamp(18px, 1.6vw, 24px);
            line-height: 29px;
            font-weight: 500;
          "
        >
          No endless back-and-forth. No surprises
        </p>

        <p
          class="mb-8"
          style="
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            font-weight: 500;
            color: #999;
            max-width: 475px;
            line-height: 1.5;
          "
        >
          Log in to SiteSynth Studio to place your order, follow your project, and stay in touch with us every
          step of the way.
        </p>

        <button
          class="transition-colors button-hover"
          @click="navigateToPricing"
          @mouseenter="buttonHover = true"
          @mouseleave="buttonHover = false"
          :style="{
            fontFamily: 'Space Grotesk, Roc Grotesk, Inter, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            color: buttonHover ? '#0a0a0a' : '#fff',
            border: '1px solid #fff',
            padding: '10px 18px',
            width: 'fit-content',
            background: buttonHover ? '#fff' : 'transparent',
            cursor: 'pointer',
          }"
        >
          Let's start
        </button>
      </div>

      <!-- Right: Widget area -->
      <div class="widget-container relative" style="z-index: 2; display: flex; align-items: center; justify-content: center; padding: 24px">
        <CountdownWidget />
      </div>
    </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CountdownWidget from './countdown/CountdownWidget.vue'
import AnimatedBackground from './countdown/AnimatedBackground.vue'
import OrbSvg from './countdown/OrbSvg.vue'

const router = useRouter()
const buttonHover = ref(false)

const navigateToPricing = () => {
  router.push('/pricing')
}
</script>

<style scoped>
@keyframes border-spin {
  from {
    --bangle: 0deg;
  }
  to {
    --bangle: 360deg;
  }
}

@property --bangle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.spinning-border {
  animation: border-spin 7s linear infinite;
}

.button-hover {
  transition: background 0.3s, color 0.3s;
}

@keyframes orb-breathe {
  0%,
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

.orb-pulse {
  animation: orb-breathe 5s ease-in-out infinite;
}

.widget-container {
  width: 480px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .widget-container {
    width: 100%;
  }
}
</style>
