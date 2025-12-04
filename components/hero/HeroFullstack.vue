<template>
  <section
    :id="id || undefined"
    class="relative bg-[#DDDDDD] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <GlowEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">

      <!-- HERO -->
      <div class="text-center px-6">
        <h1 class="text-[#161616] text-4xl sm:text-5xl font-extrabold mb-10">
          {{ title }}
        </h1>
        <p class="text-[#161616] text-base sm:text-lg font-medium mb-8">
          {{ description }}
        </p>

        <!-- CTA BUTTON WITH ANIMATED ARROW -->
        <a
          :href="buttonLink"
          class="inline-flex items-center gap-2 mt-8 px-5 py-2
                 border border-[#161616] bg-[#161616] text-white font-semibold
                 transition-all duration-500
                 hover:bg-[#8D35FF] hover:border-[#8D35FF]"
        >
          <span>{{ buttonText }}</span>

          <i
            class="fa-solid fa-arrow-right text-sm
                   transition-transform duration-300
                   group-hover:translate-x-1"
          ></i>
        </a>
      </div>

      <!-- CARDS GRID -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div
          v-for="(card, index) in cards"
          :key="index"
          class="border border-[#636363] bg-[#161616] p-6 py-12 flex flex-col justify-between"
        >
          <h3 class="text-xl font-semibold text-center pt-6 pb-8">
            {{ card.icon }} {{ card.title }}
          </h3>

          <p class="text-center text-[#999999]">
            {{ card.description }}
          </p>

          <!-- READ MORE WITH ANIMATED ARROW + UNDERLINE -->
          <div class="text-center mt-8">
            <a
              :href="card.link"
              class="relative inline-flex items-center gap-2
                     text-[#8CB0FF] font-semibold group"
            >
              <span>Read more</span>

              <i
                class="fa-solid fa-arrow-right text-xs
                       transition-transform duration-300
                       group-hover:translate-x-1"
              ></i>

              <!-- Animated underline -->
              <span
                class="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#8CB0FF]
                       transition-all duration-300
                       group-hover:w-full"
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
  id: String,
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  cards: Array,
  backgroundImage: {
    type: String,
    default: null,
  },
});

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

