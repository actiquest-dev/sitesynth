<template>
  <section class="relative bg-[#161616] py-16 md:py-24 overflow-hidden">
    <!-- Background Effects -->
    <GlowBlue />

    <!-- Background Gradient -->
    <div class="absolute inset-0 pointer-events-none opacity-30">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-4xl mx-auto px-6 md:px-12">
      <div class="bg-[#1a1a1a] border border-[#333] rounded-xl p-8 md:p-12 overflow-hidden">
        <!-- Animated Background Lines -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0033ff] to-transparent animate-pulse"></div>
          <div class="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8D35FF] to-transparent animate-pulse"></div>
        </div>

        <div class="relative z-10 text-center">
          <!-- Tag -->
          <div class="inline-block mb-6">
            <span class="px-3 py-1 bg-[#0033ff]/20 border border-[#0033ff]/50 text-[#0033ff] text-xs font-semibold rounded-full">
              LIMITED TIME OFFER
            </span>
          </div>

          <!-- Heading -->
          <h2 class="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Ready to <span class="bg-gradient-to-r from-[#0033ff] to-[#8D35FF] bg-clip-text text-transparent">synthesize</span> your vision?
          </h2>

          <!-- Subtitle -->
          <p class="text-[#999999] text-lg mb-10 max-w-2xl mx-auto">
            Let's transform your product, brand, and tech into one powerful force.
          </p>

          <!-- Countdown Timer -->
          <div class="mb-10">
            <div class="flex justify-center gap-4 md:gap-6 mb-6">
              <!-- Days -->
              <div class="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div class="text-3xl md:text-4xl font-extrabold text-[#0033ff] tabular-nums">
                  {{ String(timeLeft.days).padStart(2, '0') }}
                </div>
                <div class="text-xs md:text-sm text-[#666] mt-2 uppercase tracking-wide">Days</div>
              </div>

              <!-- Colon -->
              <div class="flex items-center text-2xl md:text-3xl text-[#0033ff] font-bold">:</div>

              <!-- Hours -->
              <div class="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div class="text-3xl md:text-4xl font-extrabold text-[#8D35FF] tabular-nums">
                  {{ String(timeLeft.hours).padStart(2, '0') }}
                </div>
                <div class="text-xs md:text-sm text-[#666] mt-2 uppercase tracking-wide">Hours</div>
              </div>

              <!-- Colon -->
              <div class="flex items-center text-2xl md:text-3xl text-[#8D35FF] font-bold">:</div>

              <!-- Minutes -->
              <div class="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div class="text-3xl md:text-4xl font-extrabold text-[#AA3733] tabular-nums">
                  {{ String(timeLeft.minutes).padStart(2, '0') }}
                </div>
                <div class="text-xs md:text-sm text-[#666] mt-2 uppercase tracking-wide">Minutes</div>
              </div>

              <!-- Colon -->
              <div class="flex items-center text-2xl md:text-3xl text-[#AA3733] font-bold">:</div>

              <!-- Seconds -->
              <div class="bg-[#0a0a0a] border border-[#333] rounded-lg p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                <div class="text-3xl md:text-4xl font-extrabold text--[#AA3733] tabular-nums">
                  {{ String(timeLeft.seconds).padStart(2, '0') }}
                </div>
                <div class="text-xs md:text-sm text-[#666] mt-2 uppercase tracking-wide">Seconds</div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-1 bg-[#333] rounded-full overflow-hidden mb-8">
              <div
                :style="{ width: progressPercent + '%' }"
                class="h-full bg-gradient-to-r from-[#0033ff] via-[#8D35FF] to-[#AA3733] transition-all duration-1000"
              ></div>
            </div>
          </div>

          <!-- CTA Button -->
          <NuxtLink
            to="/intake"
            class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0033ff] to-[#8D35FF] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#0033ff]/50 transition-all duration-300 transform hover:scale-105 group"
          >
            <span>Start Your Project</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>

          <!-- Secondary Text -->
          <p class="text-[#666] text-sm mt-6">
            Only {{ spotsLeft }} spots remaining • Book your consultation today
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import GlowBlue from '@/components/effects/GlowBlue.vue';

const timeLeft = ref({ days: 5, hours: 12, minutes: 34, seconds: 56 });
const spotsLeft = ref(3);

let intervalId = null;

const progressPercent = computed(() => {
  const totalSeconds = 5 * 24 * 60 * 60 + 12 * 60 * 60 + 34 * 60 + 56;
  const currentSeconds = timeLeft.value.days * 24 * 60 * 60 + timeLeft.value.hours * 60 * 60 + timeLeft.value.minutes * 60 + timeLeft.value.seconds;
  return (currentSeconds / totalSeconds) * 100;
});

function updateCountdown() {
  let { days, hours, minutes, seconds } = timeLeft.value;

  if (seconds > 0) {
    seconds--;
  } else if (minutes > 0) {
    minutes--;
    seconds = 59;
  } else if (hours > 0) {
    hours--;
    minutes = 59;
    seconds = 59;
  } else if (days > 0) {
    days--;
    hours = 23;
    minutes = 59;
    seconds = 59;
  }

  timeLeft.value = { days, hours, minutes, seconds };
}

onMounted(() => {
  intervalId = setInterval(updateCountdown, 1000);
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
/* Smooth animation for countdown changes */
:deep(.tabular-nums) {
  font-variant-numeric: tabular-nums;
}
</style>
