<template>
  <section :id="id" class="bg-[#161616] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6">
      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 relative border border-[#636363] py-14 group overflow-hidden"
      >
        <component 
          :is="selectedGlowEffect" 
          class="absolute inset-0 z-0 pointer-events-none" 
        />

        <div class="flex flex-col items-center text-center relative z-10">
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-6 w-auto max-w-[150px] rounded-full object-cover" 
          />
          <h4 class="text-2xl font-bold text-white">{{ personName }}</h4>
          <p class="text-gray-400 mt-2 font-light">{{ personTitle }}</p>
        </div>

        <div class="md:col-span-2 flex flex-col justify-center relative z-10">
          <i class="text-6xl fa-solid fa-quote-left mb-4" :class="quoteColor"></i>
          <h3 class="text-3xl md:text-4xl font-bold text-white mb-4">
            {{ quoteTitle }}
          </h3>
          <p class="text-gray-300 mb-6 leading-relaxed text-lg">
            {{ quoteText }}
          </p>
          <a
            :href="ctaLink"
            :class="`border border-white text-white px-6 py-2 font-semibold w-fit hover:bg-white hover:text-[#161616] transition-all duration-300`"
          >
            {{ ctaText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// [ИСПРАВЛЕНО] Убран resolveComponent
import { computed } from "vue";

// [ИСПРАВЛЕНО] Компоненты импортируются напрямую.
// ЭТО СНОВА СЛОМАЕТ VERCEL, ЕСЛИ ПУТИ НЕВЕРНЫЕ!
//
// Ваш Testimonial.vue лежит в 'components/ui/'.
// Если GlowEffect.vue лежит в 'components/', путь должен быть:
// import GlowEffect from "../GlowEffect.vue";
//
// Если он лежит в 'components/effects/', путь:
// import GlowEffect from "../effects/GlowEffect.vue";
//
// Я буду использовать '../' (на уровень выше), это самая частая структура.
//
// import GlowEffect from "../GlowEffect.vue"; 
import GlowRed from "../GlowRed.vue";

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
});

// [ИСПРАВЛЕНО] computed возвращает импортированный компонент
const selectedGlowEffect = computed(() => {
  if (props.glowEffect === "GlowRed") {
    return GlowRed;
  }
  return GlowEffect;
});
</script>
