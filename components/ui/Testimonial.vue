<template>
  <section :id="id" class="bg-[#DDDDDD] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6">
      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 relative border border-[#636363] py-14 group overflow-hidden"
      >
        <GlowEffect />
        <!-- Left Column (1/3) -->
        <div class="flex flex-col items-center text-center">
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-4 w-auto max-w-[150px]"
          />
          <h4 class="text-xl font-semibold text-[#161616]">{{ personName }}</h4>
          <p class="text-[#636363] mt-2">{{ personTitle }}</p>
        </div>
        <!-- Right Column (2/3) -->
        <div class="md:col-span-2 flex flex-col justify-center px-6">
          <i class="text-6xl text-[#A620FF] fa-solid fa-quote-left"></i>
          <h3 class="text-3xl font-bold text-[#161616] mt-4 mb-6">
            {{ quoteTitle }}
          </h3>
          <p class="text-[#636363]">"{{ quoteText }}"</p>
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
