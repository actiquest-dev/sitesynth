<template>
  <section class="relative bg-[#161616] text-white overflow-hidden">
    <!-- Glow-эффект -->
    <component :is="selectedGlowEffect" />

    <!-- Частицы / звёзды -->
    <ParticleEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[12rem] pb-24">
      <!-- Заголовок + подпись -->
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
          :style="{ '--i': index }"
          :class="[
            'group tag-pill cursor-default border-[2px] rounded-full p-[3px]',
            tag.strokeClass,
          ]"
        >
        <div
  class="tag-pill-inner rounded-full bg-[#161616] px-12 py-2 
         text-lg font-medium text-white/90
         transition-all duration-300 group-hover:bg-[#181818]"
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
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

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

// динамический импорт glow-эффекта
const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);

// таблетки под заголовком (value-пилюли SiteSynth)
const tags = [
  { label: "Product-First", strokeClass: "stroke-blue" },
  { label: "Design-Led", strokeClass: "stroke-white" },
  { label: "Senior-Only Team", strokeClass: "stroke-magenta" },
  { label: "Tech & Brand Aligned", strokeClass: "stroke-red" },
  { label: "Docs Included", strokeClass: "stroke-white" },
  { label: "Transparent Scope", strokeClass: "stroke-purple" },
  { label: "Clean Handoff", strokeClass: "stroke-white" },
  { label: "AI-Ready Stack", strokeClass: "stroke-red" },
];

// стили текста (как в HeroGeneric)
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

<style scoped>
.stroke-blue {
  border-color: #0900ff;
  border-style: solid;
}

.stroke-purple {
  border-color: #7b38fc;
  border-style: solid;
}

.stroke-magenta {
  border-color: #a620ff;
  border-style: solid;
}

.stroke-red {
  border-color: #aa3733;
  border-style: solid;
}

.stroke-white {
  border-color: #ffffff;
  border-style: solid;
}

/* ---------- ТАБЛЕТКИ БЕЗ АНИМАЦИИ УГЛОВ ---------- */

/* Внешняя оболочка таблетки */
.tag-pill {
  border-radius: 9999px;
  transition:
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Внутренняя часть: круглая + появление */
.tag-pill-inner {
  border-radius: 9999px;
  opacity: 0;
  transform: translateY(10px);
  transition:
    background-color 380ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 380ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
  animation:
    fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards,
    softPulse 4s ease-in-out infinite;
  animation-delay: calc(var(--i) * 90ms);
}

/* Hover: только поднимается и меняет фон */
.tag-pill:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 18px rgba(144, 144, 255, 0.32);
}

.tag-pill:hover .tag-pill-inner {
  background-color: #181818;
  box-shadow: 0 0 18px rgba(144, 144, 255, 0.32);
  transform: translateY(0);
}

/* Плавное появление */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Мягкий пульс */
@keyframes softPulse {
  0% {
    box-shadow: 0 0 0 rgba(144, 144, 255, 0);
  }
  50% {
    box-shadow: 0 0 14px rgba(144, 144, 255, 0.22);
  }
  100% {
    box-shadow: 0 0 0 rgba(144, 144, 255, 0);
  }
}
</style>


