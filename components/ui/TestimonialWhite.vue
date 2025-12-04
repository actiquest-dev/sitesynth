<template>
  <section :id="id" class="bg-[#DDDDDD] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6 w-full">

      <div
        ref="card"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 relative border border-[#636363] py-14 group overflow-hidden"
      >
        <!-- Сначала: градиент в углу, самый нижний слой -->
        <div
          class="absolute bottom-0 left-0 w-[420px] h-[320px] pointer-events-none opacity-100 z-0"
          :style="{
            backgroundImage: 'url(/assets/gradients/gradient-for-banner-section.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom left',
            backgroundRepeat: 'no-repeat'
          }"
        ></div>

        <!-- Затем: GlowEffect поверх градиента, но под контентом -->
        <component
          :is="selectedGlowEffect"
          class="absolute inset-0 z-[1] pointer-events-none"
        />

        <!-- LEFT COLUMN (контент всегда над glow/градиентом) -->
        <div
          class="flex flex-col justify-center items-center text-center relative z-10 px-4"
        >
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-4 w-auto max-w-[150px] relative z-20"
          />

          <h4 class="text-xl font-semibold text-[#161616]">
            {{ personName }}
          </h4>

          <p class="text-[#636363] mt-2">
            {{ personTitle }}
          </p>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="md:col-span-2 flex flex-col justify-center px-6 relative z-10">
          <i class="text-6xl text-[#A620FF] fa-solid fa-quote-left"></i>

          <h3 class="text-3xl font-bold text-[#161616] mt-4 mb-6">
            {{ quoteTitle }}
          </h3>

          <p class="text-[#636363] leading-relaxed">
            "{{ quoteText }}"
          </p>

          <!-- CTA BUTTON -->
          <a
            :href="ctaLink"
            class="mt-6 w-auto max-w-max px-5 py-2 
                   border-[1px] border-[#161616] 
                   bg-[#161616] text-white font-semibold
                   transition-all duration-500
                   hover:bg-[#8D35FF] hover:border-[#8D35FF] hover:text-white"
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
  id: { type: String, default: "" },
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
  }
});

const selectedGlowEffect = computed(() =>
  resolveComponent(props.glowEffect)
);
</script>
