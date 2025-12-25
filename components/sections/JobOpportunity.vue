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
            class="relative block"
            rel="noopener noreferrer"
          >
            <!-- desktop height -->
            <div class="h-auto md:h-[140px]">
              <!-- right pattern -->
              <img
                v-if="job.image"
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="absolute right-0 top-0 h-full w-auto object-cover"
              />

              <div
                class="relative z-10 flex h-full flex-col gap-4
                       px-6 py-6
                       md:flex-row md:items-center md:justify-between md:px-12 md:py-0"
              >
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
                  class="shrink-0 inline-flex items-center justify-center
                         bg-[#161616] text-white px-8 py-3 text-sm font-semibold
                         transition-colors duration-200 hover:bg-[#333333]
                         w-full md:w-auto"
                >
                  Apply
                </span>
              </div>
            </div>
          </a>

          <!-- NORMAL JOB ROW -->
          <a
            v-else
            :href="job.link"
            class="group block transition-colors duration-300 hover:bg-white/5"
            rel="noopener noreferrer"
          >
            <!-- glow behind content -->
            <component
              :is="resolvedGlowEffect"
              class="absolute inset-0 z-0 pointer-events-none"
            />

            <!-- ROW CONTENT -->
            <div class="relative z-10 flex flex-col md:flex-row">
              <!-- LEFT IMAGE / LOGO AREA -->
              <div
                class="w-full md:w-[220px] flex items-center justify-start
                       border-b md:border-b-0 md:border-r border-[#636363]"
              >
                <!-- mobile: full-bleed banner (no padding), desktop: smaller logo inside -->
                <img
                  :src="job.image"
                  :alt="job.imageAlt || job.title"
                  class="w-full h-[110px] md:h-[140px]
                         object-cover md:object-contain
                         md:w-auto md:max-w-[180px]
                         md:ml-6"
                />
              </div>

              <!-- TEXT -->
              <div
                class="flex-1 flex flex-col justify-center
                       px-6 py-6
                       md:px-10 md:py-0 md:h-[140px]"
              >
                <component :is="job.titleTag || 'h3'" :class="job.titleClass">
                  {{ job.title }}
                </component>

                <component
                  :is="job.descriptionTag || 'p'"
                  :class="job.descriptionClass"
                  class="mt-2"
                >
                  {{ job.description }}
                </component>
              </div>

              <!-- RIGHT CHEVRON -->
              <div
                class="flex items-center justify-between
                       border-t md:border-t-0 md:border-l border-[#636363]
                       px-6 py-4
                       md:w-[120px] md:justify-center md:px-0 md:py-0 md:h-[140px]"
              >
                <span class="text-[#636363] group-hover:text-white transition-colors duration-200">
                  <span class="md:hidden font-semibold">Open</span>
                  <i
                    class="fa fa-chevron-right ml-2 md:ml-0
                           transition-transform duration-200
                           group-hover:translate-x-1"
                  ></i>
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

const resolvedGlowEffect = computed(() => resolveComponent(props.glowEffect));

const isCta = (job) => {
  const bg = (job.bgColor || "").toLowerCase();
  return bg.includes("dddddd") || (job.link || "").startsWith("mailto:");
};
</script>



