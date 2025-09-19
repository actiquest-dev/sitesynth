<template>
  <section
    :id="id || undefined"
    :class="backgroundColor"
    @mousemove="handleMouseMove"
    @mouseleave="resetToAutoSlide"
  >
    <div class="hero-tags-holder overflow-hidden py-12">
      <div
        class="hero-tags-wrapper flex gap-6 whitespace-nowrap"
        :style="{
          willChange: 'transform',
          transform: `translate3d(${sliderPosition}%, 0px, 0px)`,
          transformStyle: 'preserve-3d',
        }"
      >
        <div class="hero-tags-container flex gap-6">
          <!-- First set of tags -->
          <div
            v-for="(value, index) in values"
            :key="`first-${index}`"
            class="hero-tags flex-shrink-0"
          >
            <div
              :class="[value.buttonClass, value.bgColor]"
              class="hero-tag-text px-20 py-8 rounded-full border-2 border-white font-semibold text-4xl whitespace-nowrap"
            >
              {{ value.buttonText }}
            </div>
          </div>

          <!-- Duplicate set for infinite loop -->
          <div
            v-for="(value, index) in values"
            :key="`second-${index}`"
            class="hero-tags flex-shrink-0"
          >
            <div
              :class="[value.buttonClass, value.bgColor]"
              class="hero-tag-text px-20 py-8 rounded-full border-2 border-white font-semibold text-4xl whitespace-nowrap"
            >
              {{ value.buttonText }}
            </div>
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
    required: true,
  },
});

const sliderPosition = ref(0);
const isHovering = ref(false);
const mouseInfluence = ref(0);
let animationFrame = null;

// Smooth animation loop
const animate = () => {
  if (!isHovering.value) {
    // Auto-slide: slow drift to the left
    sliderPosition.value -= 0.05;
  } else {
    // Mouse influence: faster movement based on mouse position
    sliderPosition.value -= 0.05 + mouseInfluence.value;
  }

  // Reset position for infinite loop (when first set is completely off-screen)
  if (sliderPosition.value <= -100) {
    sliderPosition.value = 0;
  }
  if (sliderPosition.value >= 0) {
    sliderPosition.value = -100;
  }

  animationFrame = requestAnimationFrame(animate);
};

const handleMouseMove = (event) => {
  isHovering.value = true;

  const rect = event.currentTarget.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const containerWidth = rect.width;
  const centerX = containerWidth / 2;

  // Calculate influence: negative = move left faster, positive = move right (slower)
  const deltaX = mouseX - centerX;
  const normalizedDelta = deltaX / centerX; // -1 to 1

  // Scale the influence
  mouseInfluence.value = normalizedDelta * 0.2; // Adjust multiplier for sensitivity
};

const resetToAutoSlide = () => {
  isHovering.value = false;
  mouseInfluence.value = 0;
};

onMounted(() => {
  animate();
});

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>
