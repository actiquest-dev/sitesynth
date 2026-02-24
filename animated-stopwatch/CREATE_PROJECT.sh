#!/bin/bash

# Создание структуры папок
mkdir -p src/app/components
mkdir -p src/styles

# package.json
cat > package.json << 'EOF'
{
  "name": "sitesynth-vue",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-vue": "^5.2.1",
    "tailwindcss": "4.1.12",
    "typescript": "^5.7.3",
    "vite": "6.3.5",
    "vue-tsc": "^2.2.0"
  }
}
EOF

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
EOF

# env.d.ts
cat > env.d.ts << 'EOF'
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
EOF

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SiteSynth Studio</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
EOF

# src/main.ts
cat > src/main.ts << 'EOF'
import { createApp } from 'vue'
import App from './app/App.vue'
import './styles/index.css'

createApp(App).mount('#app')
EOF

# src/styles/index.css
cat > src/styles/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Share+Tech+Mono&family=Roboto:wght@300;400&display=swap');
@import './tailwind.css';
EOF

# src/styles/tailwind.css
cat > src/styles/tailwind.css << 'EOF'
@import "tailwindcss";
EOF

# src/app/App.vue
cat > src/app/App.vue << 'EOF'
<template>
  <div class="min-h-screen flex items-center justify-center p-6" style="background: #161616">
    <div class="relative w-full" style="max-width: 1141px">
      <div
        class="spinning-border pointer-events-none absolute"
        style="
          inset: -1px;
          border-radius: 1px;
          background: conic-gradient(
            from var(--bangle),
            transparent 0%,
            transparent 55%,
            rgba(100, 0, 255, 0) 60%,
            rgba(165, 31, 255, 0.9) 68%,
            rgba(80, 160, 255, 1) 72%,
            rgba(165, 31, 255, 0.9) 76%,
            rgba(100, 0, 255, 0) 82%,
            transparent 87%,
            transparent 100%
          );
          z-index: 0;
        "
      />

      <div
        class="relative flex w-full"
        style="
          min-height: 475px;
          border: 1px solid #636363;
          overflow: hidden;
          z-index: 1;
          background: #161616;
        "
      >
        <AnimatedBackground />

        <div
          class="absolute pointer-events-none orb-pulse"
          style="
            top: -120px;
            right: -120px;
            width: 527px;
            height: 527px;
            z-index: 1;
          "
        >
          <OrbSvg style="width: 100%; height: 100%" />
        </div>

        <div
          class="flex flex-col justify-center relative"
          style="flex: 1 1 0; padding: 60px 83px; z-index: 2"
        >
          <h1
            class="text-white mb-4"
            style="
              font-family: 'Roc Grotesk', 'Inter', sans-serif;
              font-size: clamp(28px, 3vw, 43px);
              line-height: 1.37;
              max-width: 557px;
              font-weight: 500;
            "
          >
            Your business online in 5 days — from €500.
          </h1>

          <p
            class="text-white mb-4"
            style="
              font-family: 'Roc Grotesk', 'Inter', sans-serif;
              font-size: clamp(18px, 1.6vw, 24px);
              line-height: 29px;
              font-weight: 500;
            "
          >
            No endless back-and-forth. No surprises
          </p>

          <p
            class="mb-8"
            style="
              font-family: 'Inter', sans-serif;
              font-size: 16px;
              font-weight: 500;
              color: #999;
              max-width: 475px;
              line-height: 1.5;
            "
          >
            Log in to SiteSynth Studio to place your order, follow your project, and stay in touch with us every
            step of the way.
          </p>

          <button
            class="transition-colors button-hover"
            style="
              font-family: 'Inter', sans-serif;
              font-size: 16px;
              font-weight: 700;
              color: #fff;
              border: 1px solid #fff;
              padding: 10px 18px;
              width: fit-content;
              background: transparent;
              cursor: pointer;
            "
            @mouseenter="buttonHover = true"
            @mouseleave="buttonHover = false"
            :style="{
              background: buttonHover ? '#fff' : 'transparent',
              color: buttonHover ? '#161616' : '#fff',
            }"
          >
            Let's start
          </button>
        </div>

        <div class="relative flex-shrink-0" style="width: 437px; min-height: 475px; z-index: 2">
          <div
            class="absolute"
            style="
              top: 36px;
              left: 36px;
              right: -1px;
              bottom: 36px;
              background: rgba(22, 22, 22, 0.1);
              border: 1px solid #636363;
              border-radius: 14.109px 0 0 14.109px;
            "
          >
            <CountdownWidget />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CountdownWidget from './components/CountdownWidget.vue'
import OrbSvg from './components/OrbSvg.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'

const buttonHover = ref(false)
</script>

<style>
@keyframes border-spin {
  from {
    --bangle: 0deg;
  }
  to {
    --bangle: 360deg;
  }
}

@property --bangle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes orb-breathe {
  0%,
  100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

.orb-pulse {
  animation: orb-breathe 5s ease-in-out infinite;
}

.spinning-border {
  animation: border-spin 7s linear infinite;
}

.button-hover {
  transition: background 0.3s, color 0.3s;
}
</style>
EOF

# src/app/components/CountdownWidget.vue
cat > src/app/components/CountdownWidget.vue << 'EOF'
<template>
  <div class="absolute inset-0 flex flex-col" style="padding: 18px 20px 20px">
    <div class="flex items-center justify-between" style="margin-bottom: 12px">
      <div class="flex items-center gap-[7px]">
        <div class="size-[9px] rounded-full" style="background: #9747ff" />
        <div class="size-[9px] rounded-full" style="background: rgba(255, 255, 255, 0.15)" />
        <div class="size-[9px] rounded-full" style="background: rgba(255, 255, 255, 0.15)" />
      </div>

      <div class="flex items-center" style="gap: 2px">
        <FlipGroup :value="hh" :fontSize="13" color="#888" :gap="1" />
        <span :style="separatorStyle">:</span>
        <FlipGroup :value="mmt" :fontSize="13" color="#888" :gap="1" />
        <span :style="separatorStyle">:</span>
        <FlipGroup :value="ss" :fontSize="13" color="#9747FF" :gap="1" />
      </div>
    </div>

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

      <div class="flex flex-col items-center justify-center" style="flex: 1; padding: 0 16px; position: relative">
        <span :style="ghostStyle">{{ daysFormatted }}</span>

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
EOF

# src/app/components/SplitFlap.vue
cat > src/app/components/SplitFlap.vue << 'EOF'
<template>
  <div :style="containerStyle">
    <div v-if="phase === 'idle'" :style="fullTxtStyle">{{ curr }}</div>

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
EOF

# src/app/components/FlipGroup.vue
cat > src/app/components/FlipGroup.vue << 'EOF'
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
EOF

# src/app/components/TimeUnit.vue
cat > src/app/components/TimeUnit.vue << 'EOF'
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
EOF

# src/app/components/Ticker.vue
cat > src/app/components/Ticker.vue << 'EOF'
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
EOF

# src/app/components/OrbSvg.vue
cat > src/app/components/OrbSvg.vue << 'EOF'
<template>
  <svg
    width="264"
    height="344"
    viewBox="0 0 264 344"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_f_1549_3949)">
      <g clip-path="url(#paint0_angular_1549_3949_clip_path)">
        <g transform="matrix(0 0.1575 -0.1575 0 263.4 80.5)">
          <foreignObject x="-1006.35" y="-1006.35" width="2012.7" height="2012.7">
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style="
                background: conic-gradient(from 90deg, rgba(0,51,255,0.31) 0deg, rgba(165,31,255,1) 360deg);
                height: 100%;
                width: 100%;
                opacity: 1;
              "
            />
          </foreignObject>
        </g>
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f_1549_3949"
        x="2.28882e-05"
        y="-182.9"
        width="526.8"
        height="526.8"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="52.95" result="effect1_foregroundBlur_1549_3949" />
      </filter>
      <clipPath id="paint0_angular_1549_3949_clip_path">
        <circle cx="263.4" cy="80.5" r="157.5" />
      </clipPath>
    </defs>
  </svg>
</template>

<script setup lang="ts">
</script>
EOF

# src/app/components/AnimatedBackground.vue
cat > src/app/components/AnimatedBackground.vue << 'EOF'
<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="z-index: 0"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let animId: number

  const resize = () => {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width || canvas.parentElement?.offsetWidth || 800
    canvas.height = rect.height || canvas.parentElement?.offsetHeight || 475
  }

  const ro = new ResizeObserver(resize)
  if (canvas.parentElement) ro.observe(canvas.parentElement)
  resize()

  const blobs = [
    { baseX: 0.78, baseY: -0.05, r: 0.42, color: [165, 31, 255], speed: 0.00018, amp: 0.06, phase: 0 },
    { baseX: 0.88, baseY: 0.55, r: 0.30, color: [0, 80, 255], speed: 0.00024, amp: 0.07, phase: 1.3 },
    { baseX: 0.58, baseY: 0.12, r: 0.24, color: [110, 0, 230], speed: 0.00020, amp: 0.05, phase: 2.6 },
    { baseX: 0.12, baseY: 0.65, r: 0.20, color: [60, 0, 190], speed: 0.00014, amp: 0.08, phase: 0.8 },
  ]

  const draw = (ts: number) => {
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    blobs.forEach((b) => {
      const px = (b.baseX + Math.sin(ts * b.speed + b.phase) * b.amp) * W
      const py = (b.baseY + Math.cos(ts * b.speed * 1.3 + b.phase) * b.amp) * H
      const pulse = 1 + 0.06 * Math.sin(ts * b.speed * 3 + b.phase)
      const radius = b.r * Math.min(W, H) * pulse

      const gr = ctx.createRadialGradient(px, py, 0, px, py, radius)
      const [r, g, bl] = b.color
      gr.addColorStop(0, `rgba(${r},${g},${bl},0.30)`)
      gr.addColorStop(0.45, `rgba(${r},${g},${bl},0.12)`)
      gr.addColorStop(1, `rgba(${r},${g},${bl},0)`)

      ctx.fillStyle = gr
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    animId = requestAnimationFrame(draw)
  }

  animId = requestAnimationFrame(draw)

  onUnmounted(() => {
    cancelAnimationFrame(animId)
    ro.disconnect()
  })
})
</script>
EOF

echo ""
echo "✅ Проект создан!"
echo ""
echo "Запустите:"
echo "  npm install"
echo "  npm run dev"
