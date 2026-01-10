<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <!-- Glow позади контента -->
    <GlowEffect class="absolute inset-0 z-0 pointer-events-none" />

    <div class="relative z-10 max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">
      <!-- HERO TEXT -->
      <div class="text-center px-6">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-10">{{ title }}</h1>
        <p class="text-base sm:text-lg font-medium mb-8">{{ description }}</p>

        <!-- Hero button -->
        <a
          :href="buttonLink"
          class="inline-block mt-8 px-4 py-2 font-semibold border border-white bg-white text-[#161616] transition-all duration-500 hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white"
        >
          {{ buttonText }}
        </a>
      </div>

      <!-- CARDS GRID -->
      <div class="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          v-for="(card, index) in cards"
          :key="index"
          :href="card.link"
          class="group/card relative border border-[#636363] bg-[#ffffff14] backdrop-blur
                 p-10 min-h-[420px] overflow-hidden
                 transition-all duration-300 hover:bg-[#ffffff1a]"
        >
          <!-- Title + description (outlined to the left) -->
       <h3 class="text-xl font-semibold text-left pr-20 pt-2">
            {{ card.title }}
          </h3>

          <p class="text-left text-[#999999] mt-6 max-w-[34ch] leading-relaxed pr-20">
            {{ card.description }}
          </p>

          <!-- Round arrow button -->
          <div class="mt-10">
            <span
              class="inline-flex items-center justify-center w-14 h-14 rounded-full
                     border border-white/35 bg-white/5 text-white/90
                     transition-all duration-300
                     group-hover/card:bg-white/10 group-hover/card:border-white/60"
              aria-label="Open"
            >
              <font-awesome
                :icon="['fas', 'arrow-right']"
                class="text-sm transition-transform duration-300 group-hover/card:translate-x-[2px]"
                aria-hidden="true"
              />
            </span>
          </div>

          <!-- Pinned image (sticks to corner) -->
          <img
            v-if="card.image"
            :src="card.image"
            alt=""
            class="pointer-events-none select-none absolute bottom-0 right-0
                   w-[320px] max-w-none opacity-90"
          />
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  title: String,
  description: String,
  buttonText: String,
  buttonLink: String,
  cards: { type: Array, default: () => [] }, // ожидаем { title, description, link, image? }
  backgroundImage: String,
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

