<template>
  <section class="relative bg-[#161616] text-white overflow-hidden">
    <!-- Glow-эффект как в HeroGeneric -->
    <component :is="selectedGlowEffect" />
    <!-- Звёздочки/частицы, если компонент уже есть в проекте -->
    <ParticleEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[12rem] pb-24">
      <!-- Заголовок и подпись (контент через props, как в HeroGeneric) -->
      <div class="text-center max-w-4xl mx-auto">
        <div
          v-for="(item, index) in content"
          :key="index"
          :class="item.margin || 'mb-6'"
        >
          <component :is="item.tag" :class="getClasses(item.tag)">
            <span v-if="item.html" v-html="item.text"></span>
            <span v-else>{{ item.text }}</span>
          </component>
        </div>
      </div>

      <!-- Таблетки -->
      <div class="mt-12 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
        <div
          v-for="(tag, index) in tags"
          :key="index"
          :class="[
            'rounded-full',
            tag.variant === 'primary'
              ? 'bg-gradient-to-r from-[#2F46FF] via-[#8D35FF] to-[#FF7AF2] p-[1px]'
              : 'border border-[#FFFFFF22]'
          ]"
        >
          <div
            class="rounded-full bg-[#161616] px-8 py-3 text-sm font-medium text-white/90"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue";

const props = defineProps({
  content: {
    type: Array,
    required: true,
  },
  glowEffect: {
    type: String,
    default: "GlowBlue",
  },
});

// динамический импорт Glow-эффекта
const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);

// таблетки под заголовком
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

// стили текста, похожие на HeroGeneric
const getClasses = (tag) => {
  switch (tag) {
    case "h1":
      return "text-4xl sm:text-5xl font-extrabold leading-tight";
    case "h2":
      return "text-3xl sm:text-4xl font-bold";
    case "p":
      return "text-base sm:text-lg text-[#d4d4d4]";
    default:
      return "text-white";
  }
};
</script>
