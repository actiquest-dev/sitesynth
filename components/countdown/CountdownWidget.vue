<template>
  <div class="app-container">
    <!-- Outer glow border -->
    <div class="glow-border"></div>

    <!-- App window (like macOS) -->
    <div class="app-window">
      <!-- Header with brand and clock -->
      <div class="app-header">
        <div class="brand-header">
          <img src="/assets/Vector.svg" alt="SiteSynth" class="brand-logo" />
          <span class="brand-name">SiteSynth Studio</span>
        </div>
        <div class="mini-clock">
          <span>{{ hh }}</span>
          <span class="sep">:</span>
          <span>{{ mmt }}</span>
          <span class="sep">:</span>
          <span class="sec">{{ ss }}</span>
        </div>
      </div>

      <!-- App content -->
      <div class="app-content">
        <!-- Inner dialog window: Launch Countdown -->
        <div class="dialog-window">
          <!-- Dialog header -->
          <div class="dialog-header">
            <span class="dialog-title">LAUNCH COUNTDOWN</span>
            <div class="date-badge">
              <div class="pulse-dot"></div>
              <span>{{ dayName }} {{ dayNum }} {{ monthStr }}</span>
            </div>
          </div>

          <!-- Dialog body: Big days display -->
          <div class="dialog-body">
            <div class="days-display">
              <div class="ghost-text">{{ daysFormatted }}</div>
              <div class="flip-digits">
                <SplitFlap
                  v-for="(ch, i) in daysFormatted.split('')"
                  :key="i"
                  :value="ch"
                  :fontSize="120"
                  color="#f2f2f2"
                />
                <div class="cursor-blink"></div>
              </div>
              <div class="remaining-label">DAYS REMAINING</div>
            </div>

            <!-- Time breakdown: HRS / MIN / SEC -->
            <div class="time-row">
              <TimeUnit :value="hours" label="HRS" />
              <div class="separator">
                <div class="sep-dot"></div>
                <div class="sep-dot"></div>
              </div>
              <TimeUnit :value="minutes" label="MIN" />
              <div class="separator">
                <div class="sep-dot"></div>
                <div class="sep-dot"></div>
              </div>
              <TimeUnit :value="seconds" label="SEC" />
            </div>

            <!-- Progress bar -->
            <div class="progress-bar-container">
              <div class="progress-track">
                <div class="progress-fill" :style="{ transform: `scaleX(${progress})` }"></div>
              </div>
            </div>

            <!-- Ticker -->
            <div class="ticker-box">
              <Ticker text="SITESYNTH STUDIO · YOUR SITE IS ALMOST READY · STAY TUNED · " />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SplitFlap from './SplitFlap.vue'
import TimeUnit from './TimeUnit.vue'
import Ticker from './Ticker.vue'

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
</script>

<style scoped>
.app-container {
  position: relative;
  width: 100%;
  padding: 4px;
}

.glow-border {
  position: absolute;
  inset: 0;
  border-radius: 0;
  background: conic-gradient(
    from var(--gangle),
    transparent 0%,
    transparent 25%,
    rgba(151, 71, 255, 0.35) 40%,
    rgba(80, 160, 255, 0.5) 50%,
    rgba(151, 71, 255, 0.35) 60%,
    transparent 75%,
    transparent 100%
  );
  --gangle: 0deg;
  animation: glow-spin 8s linear infinite;
  z-index: 0;
  pointer-events: none;
}

@keyframes glow-spin {
  from { --gangle: 0deg; }
  to { --gangle: 360deg; }
}

/* ── App window ── */
.app-window {
  position: relative;
  z-index: 1;
  width: 100%;
  background: rgba(22, 22, 22, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Header ── */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.brand-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.02em;
}

.mini-clock {
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  color: #ccc;
  display: flex;
  gap: 2px;
}

.mini-clock .sep {
  color: #555;
}

.mini-clock .sec {
  color: #9747FF;
}

/* ── Content area ── */
.app-content {
  flex: 1;
  padding: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Dialog window ── */
.dialog-window {
  flex: 1;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.dialog-title {
  color: #888;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.14em;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  color: #9747FF;
}

.pulse-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #9747ff;
  animation: pulse 2.4s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* ── Dialog body ── */
.dialog-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Days display ── */
.days-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px 16px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.ghost-text {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 200px;
  color: rgba(151, 71, 255, 0.03);
  letter-spacing: -0.05em;
  user-select: none;
  line-height: 1;
}

.flip-digits {
  display: flex;
  gap: 0;
  position: relative;
  z-index: 1;
  margin-bottom: 10px;
}

.remaining-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  color: #888;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
}

/* ── Time row ── */
.time-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.separator {
  display: flex;
  flex-direction: column;
  gap: 3px;
  opacity: 0.25;
}

.sep-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

/* ── Progress ── */
.progress-bar-container {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.progress-track {
  height: 2px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6e00ff, #9747FF, #3b82f6);
  transform-origin: left center;
  transition: transform 1.2s ease-out;
}

/* ── Cursor ── */
.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 0.85em;
  background: #9747ff;
  border-radius: 1px;
  vertical-align: middle;
  margin-left: 4px;
  animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── Ticker ── */
.ticker-box {
  padding: 8px 16px;
  overflow: hidden;
}
</style>
