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
          <!-- CTA (grey) -->
          <a
            v-if="isCta(job)"
            :href="job.link"
            class="relative flex items-center h-[140px] px-12"
            rel="noopener noreferrer"
          >
            <!-- right pattern block -->
            <div class="absolute right-0 top-0 h-full w-[320px]">
              <img
                v-if="job.image"
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="h-full w-full object-cover"
              />
            </div>

            <div class="relative z-10 flex items-center w-full justify-between gap-10">
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
          </a>

          <!-- Normal job row -->
          <a
            v-else
            :href="job.link"
            class="group relative flex items-center h-[140px] bg-[#161616]
                   transition-colors duration-300 hover:bg-[#1b1b1b]"
            rel="noopener noreferrer"
          >
            <!-- Blue glow (работает всегда, без отдельного компонента) -->
            <div
              class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div
                class="absolute -left-[120px] top-1/2 -translate-y-1/2 w-[520px] h-[520px] blur-[80px]"
                style="background: radial-gradient(circle, rgba(21,0,255,0.45) 0%, rgba(21,0,255,0.18) 35%, rgba(21,0,255,0.0) 70%);"
              ></div>
            </div>

            <!-- LEFT: logo zone (ТОЛЬКО одна линия справа) -->
            <div class="h-full w-[220px] border-r border-[#636363] flex items-center justify-center">
              <img
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="h-full w-full object-contain p-10 opacity-25"
              />
            </div>

            <!-- CENTER: text -->
            <div class="flex-1 px-12">
              <div class="text-white text-2xl font-semibold leading-tight">
                {{ job.title }}
              </div>
              <div class="text-[#999999] text-base mt-2">
                {{ job.description }}
              </div>
            </div>

            <!-- RIGHT: chevron zone (ТОЛЬКО одна линия слева) -->
            <div class="h-full w-[180px] border-l border-[#636363] flex items-center justify-center">
              <span class="text-[#636363] group-hover:text-white transition-colors duration-200">
                <i class="fa fa-chevron-right transition-transform duration-200 group-hover:translate-x-1"></i>
              </span>
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
</script>
