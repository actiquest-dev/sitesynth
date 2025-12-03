<template>
  <section :id="id" class="bg-[#161616] flex justify-center">
    <div class="max-w-[1248px] mx-auto px-6 w-full">
      <div
        ref="card"
        class="relative grid grid-cols-1 md:grid-cols-3 gap-8 border border-[#636363] py-14 px-8 md:px-10 bg-[#101010] overflow-hidden"
      >
        <!-- Градиент в НИЖНЕМ ЛЕВОМ УГЛУ -->
        <div
          class="absolute bottom-0 left-0 w-[420px] h-[420px] pointer-events-none opacity-90"
          style="
            background-image: url('/assets/gradients/gradient-for-banner-section.svg');
            background-size: cover;
            background-position: bottom left;
            background-repeat: no-repeat;
            mask-image: radial-gradient(circle at bottom left, white 0%, transparent 70%);
          "
        ></div>

        <!-- ЛЕВАЯ КОЛОНКА -->
        <div class="flex flex-col justify-center items-center text-center relative z-10">
          <img
            :src="imageSrc"
            :alt="personName"
            class="mb-4 w-auto max-w-[150px]"
          />
          <h4 class="text-xl font-semibold text-white">
            {{ personName }}
          </h4>
          <p class="text-gray-300 mt-2">
            {{ personTitle }}
          </p>
        </div>

        <!-- ПРАВАЯ КОЛОНКА -->
        <div class="md:col-span-2 relative flex flex-col justify-center px-6 md:px-10 py-4 z-10">
          <i class="text-5xl sm:text-6xl fa-solid fa-quote-left" :class="quoteColor"></i>

          <h3 class="text-3xl sm:text-4xl font-black text-white mt-4 mb-6">
            {{ quoteTitle }}
          </h3>

          <p class="text-gray-300 leading-relaxed">
            "{{ quoteText }}"
          </p>

          <a
            :href="ctaLink"
            :class="`inline-flex items-center justify-center border border-white ${hoverbg} ${hoverborder}
                     bg-white text-[#161616] mt-8 px-6 py-2 font-semibold text-sm sm:text-base
                     transition-colors duration-[900ms]`"
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
  glowEffect: { type: String, default: "GlowEffect" },
  quoteColor: { type: String, default: "text-[#A620FF]" },
  hoverbg: { type: String, default: "hover:bg-[#8D35FF] hover:text-white" },
  hoverborder: { type: String, default: "hover:border-[#8D35FF]" },
});

const selectedGlowEffect = computed(() => {
  if (props.glowEffect === "GlowRed") {
    return resolveComponent("GlowRed");
  }
  return resolveComponent("GlowEffect");
});
</script>

});
</script>

