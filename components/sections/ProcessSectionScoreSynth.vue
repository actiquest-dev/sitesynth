<template>
  <section
    :id="id || undefined"
    class="border-b border-t border-[#636363] bg-[#161616]"
  >
    <div class="max-w-[1248px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2">

      <!-- Left Column (Expandable Sections) -->
      <div class="my-auto pr-12">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="toggle-section group border-t border-[#636363] pt-5 mt-4"
          :class="index === 0 ? 'border-t-0' : ''"
        >
          <h3
            @click="toggle(index)"
            :class="[
              'flex items-center justify-between cursor-pointer transition-colors duration-200',
              openIndex === index
                ? 'text-white text-2xl font-bold'
                : 'text-[#636363] text-2xl font-semibold group-hover:text-white',
            ]"
          >
            {{ section.title }}

            <span
              v-if="openIndex !== index"
              :class="`${accentColor} transition-opacity duration-300`"
            >
              +
            </span>
          </h3>

          <div
            :ref="(el) => setContentRef(el, index)"
            class="overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out"
            :style="{
              maxHeight:
                openIndex === index
                  ? (contentHeights[index] || 0) + 'px'
                  : '0px',
              opacity: openIndex === index ? 1 : 0,
              transform:
                openIndex === index ? 'translateY(0)' : 'translateY(-4px)',
            }"
          >
            <p class="text-[#999999] mt-2">
              {{ section.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right Image (full-bleed) -->
      <div class="border-t border-[#636363] md:border-t-0">
        <img
          :src="rightImgSrc"
          :alt="rightImgAlt"
          class="w-full h-full block object-cover"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  id: String,
  sections: Array,
  images: Array,
  imageSrc: String,
  imageAlt: String,
  accentColor: {
    type: String,
    default: "text-[#8CB0FF]",
  },
});

const openIndex = ref(0);
const contentHeights = ref([]);

function setContentRef(el, idx) {
  if (el) contentHeights.value[idx] = el.scrollHeight;
}

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx;
}

const getCurrentImageSrc = computed(() => {
  if (props.images?.length) {
    return props.images[openIndex.value]?.src || props.images[0].src;
  }
  return props.imageSrc || null;
});

const getCurrentImageAlt = computed(() => {
  if (props.images?.length) {
    return props.images[openIndex.value]?.alt || "";
  }
  return props.imageAlt || "";
});
</script>

<style scoped>
.image-fade-enter-active,
.image-fade-leave-active {
  transition: opacity 0.5s ease;
}
.image-fade-enter-from,
.image-fade-leave-to {
  opacity: 0;
}
</style>
