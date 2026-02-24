<template>
  <div class="absolute inset-0 flex flex-col" style="padding: 18px 20px 20px">
    <!-- Header -->
    <div class="flex items-center justify-between" style="margin-bottom: 12px">
      <div class="flex items-center gap-[7px]">
        <div class="size-[9px] rounded-full" style="background: #9747ff" />
        <div class="size-[9px] rounded-full" style="background: rgba(255, 255, 255, 0.15)" />
        <div class="size-[9px] rounded-full" style="background: rgba(255, 255, 255, 0.15)" />
      </div>

      <!-- Mini clock -->
      <div class="flex items-center" style="gap: 2px">
        <FlipGroup :value="hh" :fontSize="13" color="#888" :gap="1" />
        <span :style="separatorStyle">:</span>
        <FlipGroup :value="mmt" :fontSize="13" color="#888" :gap="1" />
        <span :style="separatorStyle">:</span>
        <FlipGroup :value="ss" :fontSize="13" color="#9747FF" :gap="1" />
      </div>
    </div>

    <!-- Main card -->
    <div
      class="flex flex-col"
      style="
        flex: 1;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.018);
        overflow: hidden;
      "
    >
      <!-- Top strip -->
      <div
        class="flex items-center justify-between"
        style="padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06)"
      >
        <span :style="labelStyle">Launch countdown</span>
        <div class="flex items-center gap-[6px]">
          <div class="pulse-dot size-[5px] rounded-full" style="background: #9747ff" />
          <span :style="dateStyle">{{ dayName }} {{ dayNum }} {{ monthStr }}</span>
        </div>
      </div>

      <!-- Big days number -->
      <div class="flex flex-col items-center justify-center" style="flex: 1; padding: 0 16px; position: relative">
        <!-- Ghost watermark -->
        <span :style="ghostStyle">{{ daysFormatted }}</span>

        <!-- Flip digits -->
        <div class="flex items-end" style="position: relative; z-index: 1; gap: 4px">
          <SplitFlap
            v-for="(ch, i) in daysFormatted.split('')"
            :key="i"
            :value="ch"
            :fontSize="96"
            color="#ffffff"
          />
          <span class="cursor-blink" />
        </div>

        <span :style="remainingStyle">days remaining</span>
      </div>

      <!-- HRS / MIN / SEC row -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.06)">
        <div class="flex items-center justify-between" style="padding: 12px 20px">
          <TimeUnit :value="hours" label="hrs" />
          <div class="flex flex-col gap-[5px]">
            <div class="size-[3px] rounded-full" style="background: rgba(255, 255, 255, 0.12)" />
            <div class="size-[3px] rounded-full" style="background: rgba(255, 255, 255, 0.12)" />
          </div>
          <TimeUnit :value="minutes" label="min" />
          <div class="flex flex-col gap-[5px]">
            <div class="size-[3px] rounded-full" style="background: rgba(255, 255, 255, 0.12)" />
            <div class="size-[3px] rounded-full" style="background: rgba(255, 255, 255, 0.12)" />
          </div>
          <TimeUnit :value="seconds" label="sec" />
        </div>
      </div>

      <!-- Progress + ticker -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.06)">
        <div style="height: 2px; background: rgba(255, 255, 255, 0.04); overflow: hidden">
          <div
            class="progress-bar"
            :style="{
              height: '100%',
              background: 'linear-gradient(90deg, #6e00ff, #9747FF, #3b82f6)',
              transformOrigin: 'left center',
              width: '100%',
              transform: `scaleX(${progress})`,
            }"
          />
        </div>
        <div style="padding: 7px 0">
          <Ticker text="SiteSynth Studio · Your site is almost ready · Stay tuned · " />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SplitFlap from './SplitFlap.vue'
import FlipGroup from './FlipGroup.vue'
import TimeUnit from './TimeUnit.vue'
import Ticker from './Ticker.vue'

const MONO = "'Share Tech Mono', 'Courier New', monospace"
const INTER = "'Inter', sans-serif"

const now = ref(new Date())
const endDate = ref(new Date())
endDate.value.setDate(endDate.value.getDate() + 5)

const totalDuration = 5 * 24 * 3600 * 1000

let intervalId: number | null = null

onMounted(() => {
  intervalId = window.setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

const diff = computed(() => Math.max(0, endDate.value.getTime() - now.value.getTime()))
const totalSecs = computed(() => Math.floor(diff.value / 1000))
const days = computed(() => Math.floor(totalSecs.value / 86400))
const hours = computed(() => Math.floor((totalSecs.value % 86400) / 3600))
const minutes = computed(() => Math.floor((totalSecs.value % 3600) / 60))
const seconds = computed(() => totalSecs.value % 60)
const progress = computed(() => 1 - diff.value / totalDuration)

const hh = computed(() => now.value.getHours().toString().padStart(2, '0'))
const mmt = computed(() => now.value.getMinutes().toString().padStart(2, '0'))
const ss = computed(() => now.value.getSeconds().toString().padStart(2, '0'))

const dayName = computed(() => now.value.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase())
const dayNum = computed(() => now.value.getDate().toString().padStart(2, '0'))
const monthStr = computed(() => now.value.toLocaleDateString('en-US', { month: 'short' }).toUpperCase())

const daysFormatted = computed(() => days.value.toString().padStart(2, '0'))

const separatorStyle = {
  fontFamily: MONO,
  fontSize: '11px',
  color: '#2a2a2a',
  alignSelf: 'center',
  lineHeight: 1,
}

const labelStyle = {
  fontFamily: INTER,
  fontSize: '9px',
  color: '#666',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
}

const dateStyle = {
  fontFamily: MONO,
  fontSize: '10px',
  color: '#9747FF',
}

const ghostStyle = {
  position: 'absolute' as const,
  fontFamily: MONO,
  fontSize: '180px',
  color: 'rgba(151,71,255,0.04)',
  letterSpacing: '-0.05em',
  userSelect: 'none' as const,
  lineHeight: 1,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  whiteSpace: 'nowrap' as const,
}

const remainingStyle = {
  fontFamily: INTER,
  fontSize: '10px',
  letterSpacing: '0.22em',
  color: '#777',
  textTransform: 'uppercase' as const,
  marginTop: '8px',
  position: 'relative' as const,
  zIndex: 1,
}
</script>

<style scoped>
.pulse-dot {
  animation: pulse 2.4s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
}

.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 0.85em;
  background: #9747ff;
  border-radius: 1px;
  vertical-align: middle;
  margin-left: 5px;
  animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.progress-bar {
  transition: transform 1.2s ease-out;
}
</style>
