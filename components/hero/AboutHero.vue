<template>
  <section class="relative bg-[#161616] text-white overflow-hidden">
    <!-- фон как у других секций -->
    <GlowBlue />
    <ParticleEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[10rem] pb-24 min-h-[80vh]">
      <!-- Заголовок + подпись -->
      <div class="text-center max-w-4xl mx-auto">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-8 leading-tight">
          We started small — on <br class="hidden sm:inline" />
          purpose.
        </h1>
        <p class="text-base sm:text-lg text-[#d4d4d4]">
          Meet the people guiding our vision and driving our work forward.
        </p>
      </div>

      <!-- “Таблетки” в две строки -->
      <div
        class="mt-12 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto"
      >
        <div
          v-for="(tag, index) in tags"
          :key="index"
          :class="[
            'rounded-full',
            tag.variant === 'primary'
              ? 'bg-gradient-to-r from-[#2F46FF] via-[#8D35FF] to-[#FF7AF2] p-[1px]'
              : 'border border-[#FFFFFF33]'
          ]"
        >
          <div
            class="rounded-full bg-[#161616] px-8 py-3 text-sm font-medium text-white/90 flex items-center justify-center"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import GlowBlue from "@/components/effects/GlowBlue.vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

// Тексты “таблеток” и тип оформления
const tags = [
  { label: "Dev Handoff", variant: "primary" },
  { label: "Embedded Support", variant: "secondary" },
  { label: "Dev Handoff", variant: "primary" },
  { label: "Embedded Support", variant: "secondary" },
  { label: "CI/CD Friendly", variant: "secondary" },
  { label: "Launch Assistance", variant: "primary" },
  { label: "CI/CD Friendly", variant: "secondary" },
  { label: "Launch Assistance", variant: "primary" },
];
</script>
