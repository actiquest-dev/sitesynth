<template>
  <div :style="{ display: 'flex', gap: gap + 'px' }">
    <SplitFlap
      v-for="(ch, i) in value.split('')"
      :key="i"
      :value="ch"
      :fontSize="fontSize"
      :color="color"
    />
  </div>
</template>

<script setup lang="ts">
import SplitFlap from './SplitFlap.vue'

withDefaults(
  defineProps<{
    value: string
    fontSize?: number
    color?: string
    gap?: number
  }>(),
  {
    fontSize: 96,
    color: '#ffffff',
    gap: 2,
  }
)
</script>
