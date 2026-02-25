<template>
  <button
    @click="toggleChat"
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#0033ff] hover:bg-blue-700 shadow-lg transition-all duration-300 flex items-center justify-center z-40 group"
    :class="{ 'scale-110': isOpen }"
    aria-label="Open AI Chat"
  >
    <!-- Chat icon -->
    <svg
      v-if="!isOpen"
      class="w-6 h-6 text-white group-hover:scale-110 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>

    <!-- Close icon -->
    <svg
      v-else
      class="w-6 h-6 text-white group-hover:scale-110 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>

    <!-- Notification badge (optional) -->
    <span
      v-if="hasMessages && !isOpen"
      class="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"
    ></span>
  </button>
</template>

<script setup lang="ts">
const { isOpen, hasMessages, toggleChat } = useAIChat()
</script>

<style scoped>
button {
  box-shadow: 0 4px 12px rgba(0, 51, 255, 0.3);
}

button:hover {
  box-shadow: 0 6px 16px rgba(0, 51, 255, 0.4);
}
</style>
