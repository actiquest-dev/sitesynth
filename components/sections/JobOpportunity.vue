<template>
  <section :id="id || undefined" :class="backgroundColor">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="space-y-8">
        <div
          v-for="(job, index) in jobs"
          :key="index"
          class="border border-[#636363] overflow-hidden"
          :class="isCta(job) ? 'bg-[#DDDDDD]' : 'bg-[#161616]'"
        >
          <!-- ========================= -->
          <!-- CTA (grey) -->
          <!-- ========================= -->
          <a
            v-if="isCta(job)"
            :href="job.link"
            class="relative block"
            rel="noopener noreferrer"
          >
            <!-- Pattern: desktop (справа фикс ширина) -->
            <div class="absolute right-0 top-0 h-full w-[320px] hidden md:block">
              <img
                v-if="job.image"
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- Pattern: mobile (справа половина) -->
            <div class="absolute right-0 top-0 h-full w-1/2 md:hidden">
              <img
                v-if="job.image"
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="h-full w-full object-cover"
              />
            </div>

            <!-- DESKTOP CTA layout -->
            <div class="relative z-10 hidden md:flex items-center justify-between h-[140px] px-12 gap-10">
              <div class="max-w-[760px]">
                <div class="text-[#161616] text-2xl font-semibold leading-tight">
                  {{ job.title }}
                </div>
                <div class="text-[#161616] text-base mt-1">
                  {{ job.description }}
                </div>
              </div>

              <span
                class="shrink-0 bg-[#161616] text-white px-10 py-3 text-sm font-semibold
                       border border-[#161616] transition-colors duration-200 hover:bg-[#333333]"
              >
                {{ job.linkText || "Apply" }}
              </span>
            </div>

            <!-- MOBILE CTA layout (как в референсе) -->
            <div class="relative z-10 md:hidden p-6">
              <div class="text-[#161616] text-3xl font-semibold leading-tight">
                {{ job.title }}
              </div>
              <div class="text-[#161616] text-base mt-2">
                {{ job.description }}
              </div>

              <span
                class="mt-6 block w-full text-center bg-[#161616] text-white py-4 text-base font-semibold
                       border border-[#161616] transition-colors duration-200 active:bg-[#333333]"
              >
                {{ job.linkText || "Apply" }}
              </span>
            </div>
          </a>

          <!-- ========================= -->
          <!-- NORMAL JOB ROW -->
          <!-- ========================= -->
          <a
            v-else
            :href="job.link"
            class="group relative block bg-[#161616]
                   transition-colors duration-300 hover:bg-white/5"
            rel="noopener noreferrer"
            @mousemove="onMove($event)"
            @mouseenter="onEnter"
            @mouseleave="onLeave"
          >
            <!-- mouse-follow glow -->
            <div
              class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div class="glow" />
            </div>

            <!-- DESKTOP ROW -->
            <div class="relative z-10 hidden md:flex items-center h-[140px]">
              <!-- LEFT IMAGE (flush left, чуть меньше) -->
              <div class="h-full w-[220px] flex items-stretch">
                <img
                  :src="job.image"
                  :alt="job.imageAlt || job.title"
                  class="h-full w-full object-cover"
                />
              </div>

              <!-- TEXT -->
              <div class="flex-1 px-12">
                <div class="text-white text-2xl font-semibold leading-tight">
                  {{ job.title }}
                </div>
                <div class="text-[#999999] text-base mt-2">
                  {{ job.description }}
                </div>
              </div>

              <!-- RIGHT ICON -->
              <div class="w-[180px] flex items-center justify-center">
                <span class="text-[#636363] group-hover:text-white transition-colors duration-200">
                  <i class="fa fa-chevron-right transition-transform duration-200 group-hover:translate-x-1"></i>
                </span>
              </div>
            </div>

            <!-- MOBILE ROW (картинки нет, как ты просила) -->
            <div class="relative z-10 md:hidden p-8">
              <div class="text-white text-4xl font-semibold leading-tight">
                {{ job.title }}
              </div>

              <div class="text-[#999999] text-2xl mt-6">
                {{ job.description }}
              </div>

              <div class="text-[#999999] text-xl mt-14">
                {{ job.linkText || "open" }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: "" },
  backgroundColor: { type: String, default: "bg-[#161616]" },
  jobs: { type: Array, required: true },
});

const isCta = (job) => {
  const bg = String(job.bgColor || "").toLowerCase();
  const link = String(job.link || "");
  return bg.includes("dddddd") || link.startsWith("mailto:");
};

// mouse-follow glow (per hovered row)
const setPos = (el, x, y) => {
  el.style.setProperty("--mx", `${x}px`);
  el.style.setProperty("--my", `${y}px`);
};

const onEnter = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  setPos(el, rect.width / 2, rect.height / 2);
};

const onMove = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  setPos(el, x, y);
};

const onLeave = (e) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  setPos(el, rect.width / 2, rect.height / 2);
};
</script>

<style scoped>
.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle 360px at var(--mx, 50%) var(--my, 50%),
    rgba(21, 0, 255, 0.45) 0%,
    rgba(21, 0, 255, 0.22) 25%,
    rgba(21, 0, 255, 0.10) 45%,
    rgba(21, 0, 255, 0.0) 70%
  );
  filter: blur(60px);
}
</style>

