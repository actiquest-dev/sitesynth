<template>
  <section :id="id || undefined" :class="backgroundColor" class="job-opportunity">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="space-y-8">

        <div
          v-for="(job, index) in jobs"
          :key="index"
          class="relative border border-[#636363] overflow-hidden"
          :class="isCta(job) ? 'bg-[#DDDDDD]' : 'bg-[#161616]'"
        >
          <!-- CTA ROW (grey) -->
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
              class="absolute right-0 top-0 h-full w-[320px] object-cover opacity-100"
            />

            <div class="relative z-10 h-full flex items-center justify-between px-12">
              <div class="max-w-[720px]">
                <component :is="job.titleTag || 'h3'" :class="job.titleClass">
                  {{ job.title }}
                </component>

                <component :is="job.descriptionTag || 'p'" :class="job.descriptionClass">
                  {{ job.description }}
                </component>
              </div>

              <!-- Apply button -->
              <span
                class="shrink-0 bg-[#161616] text-white px-10 py-3 text-sm font-semibold
                       border border-[#161616]
                       transition-colors duration-200 hover:bg-[#333333]"
              >
                {{ job.linkText || "Apply" }}
              </span>
            </div>
          </a>

          <!-- NORMAL JOB ROW -->
          <a
            v-else
            :href="job.link"
            class="group block h-[140px] transition-colors duration-300 hover:bg-white/5"
            rel="noopener noreferrer"
          >
            <!-- Glow INSIDE each row (behind content) -->
            <div class="absolute inset-0 z-0 pointer-events-none">
              <component :is="resolvedGlowEffect" class="absolute inset-0" />
            </div>

            <div class="relative z-10 h-full flex">
              <!-- left logo area -->
              <div class="w-[180px] border-r border-[#636363] flex items-center justify-center">
                <img
                  :src="job.image"
                  :alt="job.imageAlt || job.title"
                  class="w-full h-full object-contain p-8 opacity-40"
                />
              </div>

              <!-- text -->
              <div class="flex-1 flex flex-col justify-center px-10">
                <component :is="job.titleTag || 'h3'" :class="job.titleClass">
                  {{ job.title }}
                </component>

                <!-- в макете это “Full Time | Location”, но если у тебя description — оставляем -->
                <component
                  :is="job.descriptionTag || 'p'"
                  :class="job.descriptionClass"
                >
                  {{ job.description }}
                </component>
              </div>

              <!-- right chevron -->
              <div class="w-[140px] border-l border-[#636363] flex items-center justify-center">
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
import { computed, resolveComponent } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  backgroundColor: { type: String, default: "bg-[#161616]" },
  jobs: { type: Array, required: true },
  glowEffect: { type: String, default: "GlowBlue" },
});

/**
 * Важно: resolveComponent работает только если GlowBlue реально зарегистрирован
 * (лежит в /components и auto-import включен, либо импортирован глобально).
 */
const resolvedGlowEffect = computed(() => {
  try {
    return resolveComponent(props.glowEffect);
  } catch (e) {
    // fallback чтобы билд не падал
    return resolveComponent("GlowEffect");
  }
});

const isCta = (job) => {
  const bg = String(job.bgColor || "").toLowerCase();
  const link = String(job.link || "");
  return bg.includes("dddddd") || link.startsWith("mailto:");
};
</script>

<style>
/* Делает glow реально видимым в этих строках.
   Если твой GlowBlue использует .glow внутри, это его усиливает. */
.job-opportunity .glow {
  opacity: 1 !important;
  filter: blur(70px) !important;
}

/* Если у GlowBlue есть переменная --pos как в testimonial,
   можно дать дефолт, чтобы glow не "случайно" был в углу. */
.job-opportunity {
  --pos: 55% 45%;
}
</style>




