<template>
  <div class="flex flex-col items-center" style="gap: 5px">
    <FlipGroup :value="padded" :fontSize="22" color="#ededed" :gap="2" />
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
  fontSize: '9px',
  color: '#3a3a3a',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
}
</script>
