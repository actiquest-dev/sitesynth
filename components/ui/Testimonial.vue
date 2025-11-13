<template>
  <section :id="id" class="bg-[#161616] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6">
      <div
        ref="card"
        class="relative border border-[#636363] p-12 group overflow-hidden"
      >
        <component :is="selectedGlowEffect" class="absolute inset-0 z-0 pointer-events-none" />
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <!-- Left Column - Profile -->
          <div class="flex flex-col items-center justify-center text-center">
            <img
              :src="imageSrc"
              :alt="personName"
              class="mb-4 w-32 h-32 rounded-full object-cover"
            />
            <h4 class="text-xl font-bold text-white mt-4">{{ personName }}</h4>
            <p class="text-gray-400 mt-1 font-light text-sm">{{ personTitle }}</p>
          </div>
          
          <!-- Right Column - Quote -->
          <div class="flex flex-col justify-center">
            <i class="text-5xl fa-solid fa-quote-left mb-4" :class="quoteColor"></i>
            <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
              {{ quoteTitle }}
            </h3>
            <p class="text-gray-300 mb-6 leading-relaxed">
              {{ quoteText }}
            </p>
            <a
              :href="ctaLink"
              :class="`border border-white text-white px-5 py-2 font-semibold w-fit hover:bg-white hover:text-[#161616] transition-all duration-300`"
            >
              {{ ctaText }}
            </a>
          </div>
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
