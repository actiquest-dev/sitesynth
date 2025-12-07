<template>
  <div class="min-h-screen bg-[#161616] flex flex-col">
    <HeaderSection />

    <!-- Error Hero Section -->
    <section
      class="flex-1 w-full bg-[#161616] text-white relative overflow-hidden flex items-center justify-center hero-section group pt-32 pb-20"
    >
      <GlowEffect />

      <div class="max-w-4xl mx-auto text-center px-6 relative z-10 w-full">
        <!-- Large Error Code -->
        <div class="mb-8">
          <h1
            class="text-8xl sm:text-9xl lg:text-[12rem] font-extrabold text-transparent bg-clip-text bg-linear-to-r from-[#8CB0FF] via-[#A620FF] to-[#8CB0FF] leading-none"
          >
            {{ error.statusCode }}
          </h1>
        </div>

        <!-- Error Message -->
        <div class="mb-8">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {{ getErrorTitle() }}
          </h2>
          <p
            class="text-lg sm:text-xl text-[#A3A3A3] font-light max-w-2xl mx-auto"
          >
            {{ getErrorMessage() }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <NuxtLink
            to="/"
            class="button btn-2 px-4 py-2 text-white font-semibold"
          >
            Go Home
          </NuxtLink>

          <button
            @click="handleError"
            class="button btn-2 px-4 py-2 text-white font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Floating Elements for Visual Interest -->
      <div
        class="absolute top-20 left-10 w-20 h-20 border-2 border-[#636363] rounded-full opacity-20 animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-16 h-16 border-2 border-[#8CB0FF] rounded-full opacity-30 animate-bounce"
      ></div>
      <div
        class="absolute top-1/3 right-20 w-12 h-12 bg-linear-to-r from-[#A620FF] to-[#8CB0FF] rounded-full opacity-20 animate-pulse"
      ></div>
    </section>

    <FooterSection />
  </div>
</template>

<script setup>
// Define props for error handling
const props = defineProps(["error"]);

// Get error title based on status code
const getErrorTitle = () => {
  switch (props.error.statusCode) {
    case 404:
      return "Page Not Found";
    case 500:
      return "Server Error";
    case 403:
      return "Access Forbidden";
    default:
      return "Something Went Wrong";
  }
};

// Get error message based on status code
const getErrorMessage = () => {
  switch (props.error.statusCode) {
    case 404:
      return "The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.";
    case 500:
      return "We're experiencing some technical difficulties. Please try again later.";
    case 403:
      return "You don't have permission to access this resource.";
    default:
      return "An unexpected error occurred. Please try again or contact support if the problem persists.";
  }
};

// Set page meta based on error
useHead({
  title: `${props.error.statusCode} - ${getErrorTitle()} | Sitesynth`,
  meta: [{ name: "description", content: getErrorMessage() }],
});

// Handle error action
const handleError = async () => {
  await clearError({ redirect: "/" });
};
</script>
