<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative inline-flex items-center justify-center gap-3 font-semibold transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant],
    ]"
    @click="$emit('click')"
  >
    <!-- Loading spinner -->
    <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Icon slot -->
    <slot name="icon"></slot>

    <!-- Text -->
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

defineEmits<{
  click: []
}>()

const sizeClasses = computed(() => ({
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'w-full px-8 py-4 text-lg',
}))

const variantClasses = computed(() => ({
  primary: 'bg-[#0033ff] text-white hover:bg-blue-700 focus:ring-2 focus:ring-[#0033ff]/50 active:bg-blue-800',
  secondary: 'bg-[#8D35FF] text-white hover:bg-purple-700 focus:ring-2 focus:ring-[#8D35FF]/50 active:bg-purple-800',
  ghost: 'bg-transparent border-2 border-[#333] text-white hover:border-[#555] hover:bg-[#1a1a1a] active:bg-[#0f0f0f]',
  danger: 'bg-[#AA3733] text-white hover:bg-red-700 focus:ring-2 focus:ring-[#AA3733]/50 active:bg-red-800',
}))
</script>
