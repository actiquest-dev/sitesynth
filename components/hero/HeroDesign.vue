<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden"
    :style="backgroundImageStyle"
  >
    <GlowEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[16rem] pb-[12rem]">
      <!-- Hero -->
      <div class="text-center px-6 max-w-4xl mx-auto">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-10">{{ title }}</h1>
        <p class="text-base sm:text-lg font-medium">{{ description }}</p>
      </div>

      <!-- Form -->
      <form
        @submit="handleSubmit"
        class="flex items-center max-w-4xl mx-auto mt-15 px-6"
      >
        <!-- Left Image -->
        <img src="/assets/figma.svg" alt="Left Image" class="h-12 w-12 mr-2" />

        <!-- Input -->
        <div class="relative flex-1 border border-white/30 overflow-hidden">
          <input
            type="url"
            v-model="formData.link"
            placeholder="Enter a link"
            :disabled="state.isSubmitting"
            class="w-full h-12 px-4 pr-14 bg-white/10 backdrop-blur-[10px] text-[#A3A3A3]
                   focus:outline-none disabled:opacity-50"
          />

          <!-- Right Arrow Button -->
          <button
            type="submit"
            :disabled="state.isSubmitting || !formData.link.trim()"
            class="absolute cursor-pointer inset-y-0 right-0 flex items-center justify-center w-12
                   bg-[#A259FF] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <font-awesome
              v-if="!state.isSubmitting"
              :icon="['fas', 'arrow-right']"
              class="text-white text-sm"
              aria-hidden="true"
            />
            <font-awesome
              v-else
              :icon="['fas', 'spinner']"
              class="text-white text-sm animate-spin"
              aria-hidden="true"
            />
          </button>
        </div>
      </form>

      <!-- Message -->
      <div v-if="state.message" class="text-center mt-4 px-6">
        <p :class="isSuccessMessage() ? 'text-green-400' : 'text-red-400'">
          {{ state.message }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  description: String,
  backgroundImage: String,
});

// Use link form composable
const { formData, state, handleSubmit, isSuccessMessage } = useLinkForm();

// Simple computed style for background image
const backgroundImageStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  return {};
});
</script>




