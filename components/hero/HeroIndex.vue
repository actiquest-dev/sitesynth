<template>
  <!-- Hero Section -->
  <section
    :id="id || undefined"
    class="w-full h-[100vh] text-white relative overflow-hidden flex items-center justify-center hero-section group"
    :style="backgroundImage ? `background-image:url('${backgroundImage}');background-size:cover;background-position:center;background-repeat:no-repeat;` : ''"
  >
    <GlowEffect />
    <ParticleEffect />

    <div class="max-w-[1248px] mx-auto text-center px-6 relative z-10 w-full">
      <!-- Заголовок: неон/пульс только на glow-части -->
      <h1 class="text-4xl sm:text-6xl font-extrabold mb-8 leading-tight">
        <span>{{ titleLeading }}</span>
        <span class="glow" :data-text="titleGlow">{{ titleGlow }}</span>
      </h1>

      <p v-if="subtitle" class="text-base sm:text-[16px] font-medium mb-8 opacity-90">
        {{ subtitle }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import GlowEffect from '@/components/effects/GlowEffect.vue'
import ParticleEffect from '@/components/effects/ParticleEffect.vue'

defineProps<{
  id?: string
  backgroundImage?: string
  titleLeading?: string
  titleGlow?: string
  subtitle?: string
}>()
</script>

<style scoped>
/* убираем общий неон с h1 */
h1 { text-shadow: none; }

/* неон + пульс только на выделенной части */
.glow {
  position: relative;
  display: inline-block;
  margin-left: .25ch;            /* тонкий отступ перед фразой */
  will-change: filter, text-shadow, opacity, transform;
  animation: glowPulse 2.2s ease-in-out infinite;
  text-shadow:
    0 0 6px rgba(125,231,255,.9),
    0 0 16px rgba(61,190,255,.75),
    0 0 28px rgba(61,190,255,.6);
}

/* мягкий ореол позади текста */
.glow::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  z-index: -1;
  color: #7de7ff;
  filter: blur(8px);
  opacity: .7;
  pointer-events: none;
  animation: haloPulse 2.2s ease-in-out infinite;
}

/* анимации */
@keyframes glowPulse {
  0%, 100% {
    text-shadow:
      0 0 6px rgba(125,231,255,.9),
      0 0 16px rgba(61,190,255,.75),
      0 0 28px rgba(61,190,255,.6);
    transform: translateZ(0);
  }
  50% {
    text-shadow:
      0 0 10px rgba(125,231,255,1),
      0 0 26px rgba(61,190,255,.9),
      0 0 42px rgba(61,190,255,.85);
  }
}

@keyframes haloPulse {
  0%, 100% { filter: blur(8px);  opacity: .65; }
  50%     { filter: blur(12px); opacity: .9;  }
}

/* уважение к reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .glow, .glow::after { animation: none; }
}
</style>
