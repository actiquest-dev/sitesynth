<template>
  <div v-if="visible" class="fixed bottom-4 right-4 max-w-md z-50">
    <div 
      :class="[
        'p-4 rounded-lg border text-sm font-medium shadow-lg',
        type === 'error' && 'bg-[#AA3733]/10 border-[#AA3733] text-[#AA3733]',
        type === 'info' && 'bg-[#0033ff]/10 border-[#0033ff] text-[#0033ff]',
        type === 'success' && 'bg-[#2bad2b]/10 border-[#2bad2b] text-[#2bad2b]',
        type === 'warning' && 'bg-[#ff9500]/10 border-[#ff9500] text-[#ff9500]',
      ]"
    >
      <div class="flex items-start gap-3">
        <span class="text-xl mt-0.5">
          <span v-if="type === 'error'">❌</span>
          <span v-else-if="type === 'info'">ℹ️</span>
          <span v-else-if="type === 'success'">✅</span>
          <span v-else-if="type === 'warning'">⚠️</span>
        </span>
        <div class="flex-1">
          <p class="font-semibold">{{ title }}</p>
          <p class="text-xs opacity-80 mt-1">{{ message }}</p>
          <code v-if="details" class="text-xs opacity-70 mt-2 block bg-[#0f0f0f]/30 p-2 rounded">{{ details }}</code>
        </div>
        <button
          @click="close"
          class="text-lg opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  type?: 'error' | 'info' | 'success' | 'warning'
  title?: string
  message?: string
  details?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: 'Notification',
  duration: 5000,
})

const visible = ref(true)

const close = () => {
  visible.value = false
}

// Auto close after duration
if (props.duration > 0) {
  setTimeout(() => {
    close()
  }, props.duration)
}
</script>
