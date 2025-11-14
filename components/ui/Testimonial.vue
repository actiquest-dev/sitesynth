<template>
  <section :id="id" class="bg-[#161616] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6">
      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-2 gap-12 relative border border-[#636363] p-12 group overflow-hidden"
      >
        <component :is="selectedGlowEffect" />
        
        <!-- Left Column - Profile -->
        <div class="flex flex-col items-center justify-center text-center relative z-10">
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-6 w-32 h-32 rounded-full object-cover"
          />
          <h4 class="text-2xl font-bold text-white">{{ personName }}</h4>
          <p class="text-gray-400 mt-2 font-light">{{ personTitle }}</p>
        </div>
        
        <!-- Right Column - Quote -->
        <div class="flex flex-col justify-center relative z-10">
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
import { computed, resolveComponent } from "vue";

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

const selectedGlowEffect = computed(() => {
  if (props.glowEffect === "GlowRed") {
    return resolveComponent("GlowRed");
  }
  return resolveComponent("GlowEffect");
});
</script>
