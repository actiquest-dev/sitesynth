<template>
  <section
    :id="id || undefined"
    :class="backgroundColor"
    @mousemove="handleMouseMove"
    @mouseleave="resetToAutoSlide"
  >
    <div class="mx-auto px-6 py-12 overflow-hidden">
      <div
        class="flex gap-6 transition-transform duration-1000 ease-out"
        :style="{ transform: `translateX(${sliderPosition}px)` }"
      >
        <div
          v-for="(value, index) in values"
          :key="index"
          class="button-container flex-shrink-0"
        >
          <div
            :class="[value.buttonClass, value.bgColor]"
            class="animated-button px-20 py-8 rounded-full border-2 border-white font-semibold text-4xl whitespace-nowrap"
          >
            {{ value.buttonText }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  backgroundColor: {
    type: String,
    default: "bg-[#161616]",
  },
  values: {
    type: Array,
    required: true, // Ensure the parent provides this prop
  },
});

const sliderPosition = ref(0);
const isHovering = ref(false);
let autoSlideInterval = null;

// Auto slide function (slow drift to the right)
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    if (!isHovering.value) {
      sliderPosition.value += 2; // Slow persistent movement to the right
    }
  }, 50);
};

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
};

const handleMouseMove = (event) => {
  isHovering.value = true;

  const rect = event.currentTarget.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const containerWidth = rect.width;
  const centerX = containerWidth / 2;

  // Calculate direction and intensity based on mouse position
  const deltaX = mouseX - centerX;
  const intensity = Math.abs(deltaX) / centerX; // 0 to 1
  const maxSpeed = 10;

  if (deltaX < 0) {
    // Mouse on left side - move left
    sliderPosition.value -= maxSpeed * intensity;
  } else {
    // Mouse on right side - move right
    sliderPosition.value += maxSpeed * intensity;
  }
};

const resetToAutoSlide = () => {
  isHovering.value = false;
};

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>
