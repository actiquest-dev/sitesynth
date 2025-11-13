<template>
  <section :id="id" class="bg-[#161616] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6">
      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 relative border border-[#636363] py-14 group overflow-hidden"
      >
        <component :is="selectedGlowEffect" class="absolute inset-0 z-0 pointer-events-none" />

        <div class="flex flex-col items-center text-center relative z-10">
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-4 w-auto max-w-[150px]"
          />
          <h4 class="text-xl font-semibold text-white">{{ personName }}</h4>
          <p class="text-gray-300 mt-2">{{ personTitle }}</p>
        </div>

        <div class="md:col-span-2 flex flex-col justify-center px-6 relative z-10">
          <i class="text-6xl fa-solid fa-quote-left" :class="quoteColor"></i>
          <h3 class="text-4xl font-black text-white mt-4 mb-6">
            {{ quoteTitle }}
          </h3>
          <p class="text-gray-300">"{{ quoteText }}"</p>

          <a
            :href="ctaLink"
            :class="[
              'border-[1px] border-white bg-white text-[#161616] mt-6 w-auto max-w-max px-4 py-2 font-semibold transition-colors duration-[1000ms]',
              {
                'hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white': props.colorScheme === 'purple',
                'hover:bg-red-500 hover:border-red-500 hover:text-white': props.colorScheme === 'red',
                // Добавьте другие цветовые схемы здесь
              }
            ]"
          >
            <span>{{ ctaText }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// [ИСПРАВЛЕНО] resolveComponent удален
import { computed } from "vue";

// [ИСПРАВЛЕНО] Компоненты импортируются напрямую
// ВАЖНО: Убедитесь, что пути './GlowEffect.vue' и './GlowRed.vue' верны!
import GlowEffect from "./GlowEffect.vue";
import GlowRed from "./GlowRed.vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  imageSrc: String,
  personName: String,
  personTitle: String,
  quoteTitle: String,
  quoteText: String,
  ctaText: String,
  ctaLink: String,
  glowEffect: {
    type: String,
    default: "GlowEffect",
  },
  quoteColor: {
    type: String,
    default: "text-[#A620FF]",
  },
  // [ИСПРАВЛЕНО] Заменено на colorScheme
  colorScheme: {
    type: String,
    default: 'purple', // 'purple' или 'red' и т.д.
  },
});

// [ИСПРАВЛЕНО] computed теперь возвращает сам импортированный компонент
const selectedGlowEffect = computed(() => {
  if (props.glowEffect === "GlowRed") {
    return GlowRed; // Возвращаем компонент
  }
  return GlowEffect; // Возвращаем компонент по умолчанию
});
</script>
