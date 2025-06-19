<template>
  <section class="py-20 bg-[#161616]">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2">
      <!-- Left Column: Successful Stories -->
      <div class="mb-4 md:mb-0 md:pr-4 pl-4 text-left md:text-right md:border-r border-[#636363]">
        <a :href="storiesLink" class="text-[#8CB0FF] text-1xl font-semibold hover:text-[#A620FF] transition-colors duration-1000">
          {{ storiesText }} <i class="fa-solid fa-chevron-right relative top-[2px]"></i>
        </a>
      </div>
      <!-- Right Column: Blog Insights -->
      <div class="pl-4 text-left">
        <a :href="blogLink" class="text-[#8CB0FF] text-1xl font-semibold hover:text-[#A620FF] transition-colors duration-1000">
          {{ blogText }} <i class="fa-solid fa-chevron-right relative top-[2px]"></i>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  storiesText: String,
  storiesLink: String,
  blogText: String,
  blogLink: String
});
</script>
