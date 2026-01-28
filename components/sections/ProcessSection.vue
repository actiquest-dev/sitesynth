<template>
  <section
    :id="id || undefined"
    class="border-b border-t border-[#636363] bg-[#161616]"
  >
    <div class="max-w-[1248px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2">

      <!-- LEFT COLUMN (Accordion) -->
      <div class="my-auto pr-12 md:border-r md:border-[#636363]">
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

          <!-- Accordion body -->
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
                openIndex === index
                  ? 'translateY(0)'
                  : 'translateY(-4px)',
            }"
          >
            <p class="text-[#999999] mt-2">
              {{ section.description }}
            </p>

            <a
              v-if="section.link"
              :href="section.link"
              :class="[
                accentColor,
                'font-semibold mt-4 inline-flex items-center gap-2',
                'relative group/link py-2 transition-colors duration-300',
              ]"
            >
              <span>{{ section.linkText }}</span>

              <font-awesome
                :icon="['fas', 'chevron-right']"
                class="text-sm relative top-[1px] transition-transform duration-300 group-hover/link:translate-x-1"
                aria-hidden="true"
              />

              <div
                class="absolute bottom-0 left-0 h-[2px] bg-[#8CB0FF] w-0 group-hover/link:w-full transition-all duration-300"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (Image) -->
      <div v-if="getCurrentImageSrc" class="relative">
        <!-- фиксированный viewport -->
        <div class="pt-6 md:pt-0">
          <div class="relative w-full h-[420px] md:h-[520px] overflow-hidden">
            <transition name="image-swap" mode="out-in">
              <img
                :key="getCurrentImageSrc"
                :src="getCurrentImageSrc"
                :alt="getCurrentImageAlt"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </transition>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  sections: {
    type: Array,
    required: true,
  },
  images: {
    type: Array,
    default: () => [],
  },
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
  if (el) {
    contentHeights.value[idx] = el.scrollHeight;
  }
}

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx;
}

const getCurrentImageSrc = computed(() => {
  if (props.images?.length) {
    return props.images[openIndex.value]?.src || props.images[0]?.src;
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
.image-swap-enter-active,
.image-swap-leave-active {
  transition:
    opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.image-swap-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.985);
}

.image-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.985);
}
</style>
