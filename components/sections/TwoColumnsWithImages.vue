<template>
  <section
    :id="id || undefined"
    class="group relative overflow-hidden border-t border-b border-[#636363] bg-[#161616] services"
  >
    <!-- Content -->
    <div
      class="max-w-[1248px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 relative z-10"
    >
      <!-- Left Column -->
      <div
        class="py-12 md:pr-6 md:border-r border-[#636363] flex flex-col items-start"
      >
        <div class="flex items-center mb-[2rem]">
          <img
            :src="leftImgSrc"
            :alt="leftImgAlt"
            class="w-10 h-10 object-contain mr-3"
          />
          <h2 class="text-3xl font-bold text-white">{{ leftH2 }}</h2>
        </div>

        <h3 class="text-xl font-semibold text-white flex items-center gap-2 mb-2">
          {{ leftH3 }}
        </h3>

        <p class="text-gray-300 mb-2 whitespace-pre-line">
          {{ leftP }}
        </p>

        <!-- Learn more (with arrow + underline hover) -->
        <a
          :href="leftLearnMoreLink"
          class="relative inline-flex items-baseline gap-1 text-[#8CB0FF] font-semibold pt-4 group/link"
        >
          <span>{{ leftLearnMoreText }}</span>

          <font-awesome
            :icon="['fas', 'chevron-right']"
            class="text-sm relative top-[1px] transition-transform duration-300 group-hover/link:translate-x-1"
            aria-hidden="true"
          />

          <span
            class="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#8CB0FF]
                   transition-all duration-300 group-hover/link:w-full"
          ></span>
        </a>
      </div>

      <!-- Right Column -->
      <div class="py-12 md:pl-6 flex flex-col items-start">
        <div class="flex items-center mb-[2rem]">
          <img
            :src="rightImgSrc"
            :alt="rightImgAlt"
            class="w-10 h-10 object-contain mr-3"
          />
          <h2 class="text-3xl font-bold text-white">{{ rightH2 }}</h2>
        </div>

        <h3 class="text-xl font-semibold text-white flex items-center gap-2 mb-2">
          {{ rightH3 }}
        </h3>

        <p class="text-gray-300 mb-2 whitespace-pre-line">
          {{ rightP }}
        </p>

        <!-- Learn more (with arrow + underline hover) -->
        <a
          :href="rightLearnMoreLink"
          class="relative inline-flex items-baseline gap-1 text-[#8CB0FF] font-semibold pt-4 group/link"
        >
          <span>{{ rightLearnMoreText }}</span>

          <font-awesome
            :icon="['fas', 'chevron-right']"
            class="text-sm relative top-[1px] transition-transform duration-300 group-hover/link:translate-x-1"
            aria-hidden="true"
          />

          <span
            class="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#8CB0FF]
                   transition-all duration-300 group-hover/link:w-full"
          ></span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  id: { type: String, default: "" },

  leftImgSrc: String,
  leftImgAlt: String,
  leftH2: String,
  leftH3: String,
  leftP: String,
  leftLearnMoreText: String,
  leftLearnMoreLink: String,

  rightImgSrc: String,
  rightImgAlt: String,
  rightH2: String,
  rightH3: String,
  rightP: String,
  rightLearnMoreText: String,
  rightLearnMoreLink: String,
});
</script>
