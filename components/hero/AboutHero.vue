<template>
  <section class="relative bg-[#161616] text-white overflow-hidden">
    <!-- Glow-эффект -->
    <component :is="selectedGlowEffect" />

    <!-- Частицы / звёзды (если у тебя уже есть такой компонент) -->
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
          :class="[
            // базовое поведение таблетки
            'group rounded-full border-[2px] p-[3px] cursor-default',
            'transition-all duration-300 hover:rounded-md hover:-translate-y-[2px]',
            'hover:shadow-[0_0_18px_rgba(144,144,255,0.35)]',
            tag.strokeClass,
          ]"
        >
          <div
            class="rounded-full bg-[#161616] px-8 py-3 text-sm font-medium text-white/90 
                   transition-all duration-300 group-hover:rounded-md group-hover:bg-[#181818]"
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

// таблетки под заголовком
const tags = [
  { label: "Dev Handoff", strokeClass: "stroke-blue" },      // 0900FF
  { label: "Embedded Support", strokeClass: "stroke-purple" }, // 7B38FC
  { label: "CI/CD Friendly", strokeClass: "stroke-magenta" },  // A620FF
  { label: "Launch Assistance", strokeClass: "stroke-red" },   // AA3733
  { label: "Dev Handoff", strokeClass: "stroke-blue" },
  { label: "Embedded Support", strokeClass: "stroke-purple" },
  { label: "CI/CD Friendly", strokeClass: "stroke-magenta" },
  { label: "Launch Assistance", strokeClass: "stroke-red" },
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
</style>
