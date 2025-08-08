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
        @submit.prevent="submitForm"
        class="flex items-center max-w-4xl mx-auto mt-15 px-6"
      >
        <!-- Left Image -->
        <img src="/assets/figma.svg" alt="Left Image" class="h-12 w-12 mr-2" />

        <!-- Input -->
        <div class="relative flex-1">
          <input
            type="url"
            v-model="link"
            placeholder="Enter a link"
            :disabled="isSubmitting"
            class="w-full h-12 px-4 bg-[#6363634D] text-[#A3A3A3] focus:outline-none disabled:opacity-50"
          />

          <!-- Right Arrow Button -->
          <button
            type="submit"
            :disabled="isSubmitting || !link.trim()"
            class="absolute cursor-pointer inset-y-0 right-0 flex items-center justify-center w-12 bg-[#A259FF] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="!isSubmitting" class="fas fa-arrow-right text-white"></i>
            <i v-else class="fas fa-spinner fa-spin text-white"></i>
          </button>
        </div>
      </form>

      <!-- Message -->
      <div v-if="message" class="text-center mt-4 px-6">
        <p
          :class="
            message.includes('successfully') ? 'text-green-400' : 'text-red-400'
          "
        >
          {{ message }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  title: String,
  description: String,
  backgroundImage: String,
});

// Form state
const link = ref("");
const isSubmitting = ref(false);
const message = ref("");

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

// Form submission handler
const submitForm = async () => {
  if (!link.value.trim()) {
    message.value = "Please enter a link";
    return;
  }

  isSubmitting.value = true;
  message.value = "";

  try {
    const response = await $fetch("/api/send-link", {
      method: "POST",
      body: {
        link: link.value,
      },
    });

    if (response.success) {
      message.value = "Link submitted successfully!";
      link.value = ""; // Clear the form
    } else {
      message.value = response.error || "Something went wrong";
    }
  } catch (error) {
    console.error("Submission error:", error);
    message.value = "Failed to submit link. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
