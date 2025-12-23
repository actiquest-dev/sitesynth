<template>
  <section :id="id || undefined" :class="backgroundColor">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="space-y-8">
        <div
          v-for="(job, index) in jobs"
          :key="index"
          class="relative border border-[#636363] overflow-hidden"
          :class="isCta(job) ? 'bg-[#DDDDDD]' : 'bg-[#161616]'"
        >
          <!-- CTA ROW -->
          <a
            v-if="isCta(job)"
            :href="job.link"
            class="relative block h-[140px]"
            rel="noopener noreferrer"
          >
            <!-- right pattern -->
            <img
              v-if="job.image"
              :src="job.image"
              :alt="job.imageAlt || job.title"
              class="absolute right-0 top-0 h-full w-auto object-cover"
            />

            <div class="relative z-10 h-full flex items-center justify-between px-12">
              <div class="max-w-[720px]">
                <component :is="job.titleTag || 'h3'" :class="job.titleClass">
                  {{ job.title }}
                </component>

                <component
                  :is="job.descriptionTag || 'p'"
                  :class="job.descriptionClass"
                >
                  {{ job.description }}
                </component>
              </div>

              <span
                class="shrink-0 bg-[#161616] text-white px-10 py-3 text-sm font-semibold
                       transition-colors duration-200 hover:bg-[#333333]"
              >
                Apply
              </span>
            </div>
          </a>

          <!-- NORMAL JOB ROW -->
          <a
            v-else
            :href="job.link"
            class="group relative block h-[140px] transition-colors duration-300 hover:bg-white/5"
            rel="noopener noreferrer"
          >
            <!-- Glow INSIDE each row (behind content) -->
            <component
              :is="GlowComponent"
              class="absolute inset-0 z-0 pointer-events-none"
            />

            <div class="relative z-10 h-full flex items-center">
              <!-- left logo area (БЕЗ border-r) -->
              <div class="w-[180px] flex items-center justify-center">
                <img
                  :src="job.image"
                  :alt="job.imageAlt || job.title"
                  class="w-full h-full object-cover opacity-40"
                />
              </div>

              <!-- text -->
              <div class="flex-1 flex flex-col justify-center px-10">
                <component :is="job.titleTag || 'h3'" :class="job.titleClass">
                  {{ job.title }}
                </component>

                <component
                  :is="job.descriptionTag || 'p'"
                  :class="job.descriptionClass"
                  class="line-clamp-2"
                >
                  {{ job.description }}
                </component>
              </div>

              <!-- right chevron (БЕЗ border-l) -->
              <div class="w-[140px] flex items-center justify-center">
                <span class="text-[#636363] transition-colors duration-200 group-hover:text-white">
                  <i class="fa fa-chevron-right transition-transform duration-200 group-hover:translate-x-1"></i>
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

// ВАЖНО: прямые импорты — glow снова стабильно работает
import GlowBlue from "@/components/GlowBlue.vue";
import GlowEffect from "@/components/GlowEffect.vue";

const props = defineProps({
  id: { type: String, default: "" },
  backgroundColor: { type: String, default: "bg-[#161616]" },
  jobs: { type: Array, required: true },
  glowEffect: { type: String, default: "GlowBlue" }, // "GlowBlue" | "GlowEffect"
});

const GlowComponent = computed(() => {
  return props.glowEffect === "GlowEffect" ? GlowEffect : GlowBlue;
});

const isCta = (job) => {
  const bg = (job.bgColor || "").toLowerCase();
  return bg.includes("dddddd") || (job.link || "").startsWith("mailto:");
};
</script>

<style scoped>
/* если у тебя нет tailwind line-clamp — убери line-clamp-2 в шаблоне */
</style>

