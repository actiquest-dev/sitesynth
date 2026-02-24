<template>
  <div :style="containerStyle">
    <!-- IDLE -->
    <div v-if="phase === 'idle'" :style="fullTxtStyle">{{ curr }}</div>

    <!-- FOLD -->
    <template v-if="phase === 'fold'">
      <div :style="{ ...panelStyle, top: halfH + 'px' }">
        <div :style="txt(-halfH)">{{ curr }}</div>
      </div>
      <div
        class="flap-fall"
        :style="{ ...panelStyle, top: 0, transformOrigin: 'center bottom', zIndex: 4, backfaceVisibility: 'hidden' }"
      >
        <div :style="txt(0)">{{ prev }}</div>
      </div>
    </template>

    <!-- UNFOLD -->
    <template v-if="phase === 'unfold'">
      <div :style="{ ...panelStyle, top: 0 }">
        <div :style="txt(0)">{{ curr }}</div>
      </div>
      <div
        class="flap-rise"
        :style="{ ...panelStyle, top: halfH + 'px', transformOrigin: 'center top', zIndex: 4, backfaceVisibility: 'hidden' }"
      >
        <div :style="txt(-halfH)">{{ curr }}</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: string
    fontSize?: number
    color?: string
  }>(),
  {
    fontSize: 96,
    color: '#ffffff',
  }
)

const MONO = "'Share Tech Mono', 'Courier New', monospace"

const curr = ref(props.value)
const prev = ref(props.value)
const phase = ref<'idle' | 'fold' | 'unfold'>('idle')

const halfH = computed(() => Math.round(props.fontSize * 0.52))
const cardW = computed(() => Math.round(props.fontSize * 0.62))

watch(
  () => props.value,
  (newVal) => {
    if (newVal === curr.value) return
    prev.value = curr.value
    phase.value = 'fold'
    setTimeout(() => {
      curr.value = newVal
      phase.value = 'unfold'
    }, 160)
    setTimeout(() => {
      phase.value = 'idle'
    }, 330)
  }
)

const containerStyle = computed(() => ({
  position: 'relative' as const,
  display: 'inline-block',
  width: cardW.value + 'px',
  height: halfH.value * 2 + 'px',
  perspective: '300px',
}))

const panelStyle = computed(() => ({
  position: 'absolute' as const,
  left: 0,
  right: 0,
  height: halfH.value + 'px',
  overflow: 'hidden',
}))

const txt = (yOff: number) => ({
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: yOff + 'px',
  textAlign: 'center' as const,
  fontFamily: MONO,
  fontSize: props.fontSize + 'px',
  color: props.color,
  lineHeight: 1,
})

const fullTxtStyle = computed(() => ({
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: 0,
  textAlign: 'center' as const,
  fontFamily: MONO,
  fontSize: props.fontSize + 'px',
  color: props.color,
  lineHeight: 1,
}))
</script>

<style scoped>
.flap-fall {
  animation: fall 0.16s cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes fall {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(-90deg);
  }
}

.flap-rise {
  animation: rise 0.16s cubic-bezier(0, 0, 0.6, 1) forwards;
}

@keyframes rise {
  from {
    transform: rotateX(90deg);
  }
  to {
    transform: rotateX(0deg);
  }
}
</style>
