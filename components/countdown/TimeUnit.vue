<template>
  <div class="flex flex-col items-center" style="gap: 6px">
    <FlipGroup :value="padded" :fontSize="32" color="#ffffff" :gap="2" />
    <span :style="labelStyle">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FlipGroup from './FlipGroup.vue'

const props = defineProps<{
  value: number
  label: string
}>()

const INTER = "'Inter', sans-serif"

const padded = computed(() => props.value.toString().padStart(2, '0'))

const labelStyle = {
  fontFamily: INTER,
  fontSize: '11px',
  color: '#666',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
}
</script>
