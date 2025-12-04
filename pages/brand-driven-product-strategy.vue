<template>
  <section
    :id="id || undefined"
    class="relative bg-[#DDDDDD] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <!-- Glow позади контента -->
    <GlowEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">
      <!-- Hero -->
      <div class="text-center px-6">
        <h1 class="text-[#161616] text-4xl sm:text-5xl font-extrabold mb-10">
          {{ title }}
        </h1>
        <p class="text-[#161616] text-base sm:text-lg font-medium mb-8">
          {{ description }}
        </p>

        <!-- Кнопка hero -->
        <a
          :href="buttonLink"
          class="inline-block mt-8 px-4 py-2
                 border border-[#161616] bg-[#161616] text-white font-semibold
                 transition-colors duration-[600ms]
                 hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white"
        >
          <span>{{ buttonText }}</span>
        </a>
      </div>

      <!-- Cards Grid -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="group/card border border-[#636363] bg-[#161616]
                 p-6 py-12 flex flex-col justify-between cursor-pointer"
        >
          <!-- Заголовок карточки -->
          <h3 class="text-xl font-semibold text-center pt-6 pb-8">
            {{ card.icon }} {{ card.title }}
          </h3>

          <!-- Описание -->
          <p class="text-center text-[#999999]">
            {{ card.description }}
          </p>

          <!-- Read more -->
          <div class="text-center mt-6">
            <a
              :href="card.link"
              class="relative inline-flex items-center gap-2 text-[#8CB0FF] font-semibold group/link"
            >
              <span>Read more</span>

              <!-- Галочка › с анимацией только при hover на эту карточку -->
              <span
                class="text-lg transition-transform duration-300
                       group-hover/card:translate-x-1"
              >
                ›
              </span>

              <!-- Подчёркивание -->
              <span
                class="absolute -bottom-1 left-0 h-[2px] bg-[#8CB0FF] w-0
                       transition-all duration-300
                       group-hover/card:w-full"
              ></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  cards: {
    type: Array,
    default: () => [],
  },
  backgroundImage: {
    type: String,
    default: null,
  },
});

// фон hero (pattern)
const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {};
});
</script>
