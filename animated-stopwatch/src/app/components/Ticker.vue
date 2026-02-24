<template>
  <div style="overflow: hidden; width: 100%">
    <div class="ticker-scroll" :style="tickerStyle">
      <span v-for="i in 2" :key="i" :style="textStyle">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()

const INTER = "'Inter', sans-serif"

const tickerStyle = {
  display: 'flex',
  whiteSpace: 'nowrap' as const,
}

const textStyle = {
  fontFamily: INTER,
  fontSize: '10px',
  letterSpacing: '0.14em',
  color: '#666',
  textTransform: 'uppercase' as const,
  paddingRight: '60px',
}
</script>

<style scoped>
.ticker-scroll {
  animation: scroll 22s linear infinite;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
