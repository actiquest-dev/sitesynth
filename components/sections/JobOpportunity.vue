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
              class="absolute right-0 top-0 h-full w-auto object-cover opacity-100"
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

              <!-- Apply button -->
              <span
                class="shrink-0 bg-[#161616] text-white px-10 py-3 text-sm font-semibold
                       transition-colors duration-200 hover:bg-[#333333]"
              >
                Apply
              </span>
            </div>
          </a>

          <!-- NORMAL JOB ROW - Логотип слева + текст -->
          
            v-else
            :href="job.link"
            class="group block h-[140px] transition-colors duration-300 hover:bg-white/5"
            rel="noopener noreferrer"
          >
            <!-- Glow INSIDE each row (behind content) -->
            <component
              :is="resolvedGlowEffect"
              class="absolute inset-0 z-0 pointer-events-none"
            />

            <div class="relative z-10 h-full flex">
              <!-- left logo area -->
              <div class="w-[240px] border-r border-[#636363] flex items-center justify-center">
                <img
                  :src="job.image"
                  :alt="job.imageAlt || job.title"
                  class="w-full h-full object-cover opacity-40"
                />
              </div>

              <!-- text (БЕЗ правого блока со стрелкой!) -->
              <div class="flex-1 flex flex-col justify-center px-10">
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
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import GlowBlue from "~/components/effects/GlowBlue.vue";
import GlowEffect from "~/components/effects/GlowEffect.vue";
import GlowRed from "~/components/effects/GlowRed.vue";

const props = defineProps({
  id: { type: String, default: "" },
  backgroundColor: { type: String, default: "bg-[#161616]" },
  jobs: { type: Array, required: true },
  glowEffect: { type: String, default: "GlowBlue" },
});

const resolvedGlowEffect = computed(() => {
  if (props.glowEffect === "GlowBlue") return GlowBlue;
  if (props.glowEffect === "GlowRed") return GlowRed;
  return GlowEffect;
});

const isCta = (job) => {
  const bg = (job.bgColor || "").toLowerCase();
  return bg.includes("dddddd") || (job.link || "").startsWith("mailto:");
};
</script>

<style scoped>
/* Optional */
</style>



