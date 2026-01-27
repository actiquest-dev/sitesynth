<template>
  <section
    :id="id || undefined"
    class="border-b border-t border-[#636363] bg-[#161616]"
  >
    <!-- ВАЖНО: grid на всю ширину -->
    <div class="grid grid-cols-1 md:grid-cols-2">
      
      <!-- LEFT COLUMN -->
      <div class="py-12 md:border-r border-[#636363]">
        <div class="max-w-[600px] ml-auto px-6 md:px-0 md:pr-12">
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
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN (1-в-1 как эталон) -->
<div
  v-if="getCurrentImageSrc"
  class="relative border-t border-[#636363] md:border-t-0"
>
  <!-- FIXED IMAGE VIEWPORT -->
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
  </section>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  sections: Array,
  imageSrc: String,
  imageAlt: String,
  imageClass: String,
  images: Array,
  accentColor: {
    type: String,
    default: "text-[#8CB0FF]",
  },
});

const openIndex = ref(0);
const containerHeight = ref(400);

// высоты контента аккордеона
const contentHeights = ref([]);

// запоминаем реальные высоты блоков
function setContentRef(el, idx) {
  if (el) {
    contentHeights.value[idx] = el.scrollHeight;
  }
}

function toggle(idx) {
  // как на GitHub: повторный клик закрывает
  openIndex.value = openIndex.value === idx ? -1 : idx;
}

function updateContainerHeight(event) {
  const img = event.target;
  const naturalHeight = img.naturalHeight;
  const naturalWidth = img.naturalWidth;
  const containerWidth = img.offsetWidth;

  const scaledHeight = (naturalHeight / naturalWidth) * containerWidth;

  if (scaledHeight > containerHeight.value) {
    containerHeight.value = scaledHeight;
  }
}

const getCurrentImageSrc = computed(() => {
  if (props.images && props.images.length > 0) {
    const currentImage = props.images[openIndex.value] || props.images[0];
    return currentImage ? currentImage.src : null;
  }
  return props.imageSrc || null;
});

const getCurrentImageAlt = computed(() => {
  if (props.images && props.images.length > 0) {
    const currentImage = props.images[openIndex.value] || props.images[0];
    return currentImage ? currentImage.alt : "";
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
