<template>
  <button
    @click="toggleOpen"
    class="ai-chat-btn fixed bottom-6 right-6 z-40"
    aria-label="Open AI Chat"
  >
    <span class="ai-chat-pulse" aria-hidden="true"></span>
    <span class="ai-chat-inner">
      <svg v-if="!isOpen" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props { open?: boolean }
interface Emits { (e: 'update:open', value: boolean): void }

const props = withDefaults(defineProps<Props>(), { open: false })
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit('update:open', value)
})

const toggleOpen = () => { isOpen.value = !isOpen.value }
</script>

<style scoped>
.ai-chat-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 200ms ease;
}

.ai-chat-btn:hover {
  transform: scale(1.08);
}

/* Pulsing ring */
.ai-chat-pulse {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid rgba(141, 53, 255, 0.7);
  animation: chat-pulse 2.4s ease-out infinite;
  pointer-events: none;
}

@keyframes chat-pulse {
  0%   { transform: scale(1);    opacity: 0.8; }
  60%  { transform: scale(1.55); opacity: 0; }
  100% { transform: scale(1.55); opacity: 0; }
}

.ai-chat-inner {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: #161616;
  border: 1px solid rgba(141, 53, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 200ms ease, border-color 200ms ease;
  box-shadow: 0 0 12px rgba(141, 53, 255, 0.25);
}

.ai-chat-btn:hover .ai-chat-inner {
  background: rgba(141, 53, 255, 0.15);
  border-color: rgba(141, 53, 255, 0.7);
  box-shadow: 0 0 20px rgba(141, 53, 255, 0.4);
}
</style>
