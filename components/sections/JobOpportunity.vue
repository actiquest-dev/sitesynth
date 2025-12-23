<template>
  <section :id="id || undefined" :class="backgroundColor">
    <div class="max-w-[1248px] mx-auto px-6">
      <div class="space-y-12">
        <NuxtLink
          v-for="(job, index) in jobs"
          :key="index"
          :to="job.link"
          class="block no-underline"
        >
          <!-- CARD -->
          <div
            class="group relative overflow-hidden border border-[#636363] flex"
            :class="[
              job.variant === 'cta'
                ? 'bg-[#dddddd] text-[#161616]'
                : 'bg-[#161616] text-white',
              job.variant !== 'cta'
                ? 'hover:bg-white/5 transition-colors duration-300'
                : '',
            ]"
          >
            <!-- Glow inside each block -->
            <component
              :is="glowComponent"
              class="absolute inset-0 z-0 pointer-events-none opacity-80"
            />

            <!-- LEFT IMAGE AREA -->
            <div
              class="relative z-10 w-[190px] border-r border-[#636363] flex items-center justify-center"
              :class="job.variant === 'cta' ? 'bg-transparent' : 'bg-transparent'"
            >
              <img
                :src="job.image"
                :alt="job.imageAlt || job.title"
                class="w-full h-full object-contain p-6 opacity-70"
              />
            </div>

            <!-- MAIN CONTENT -->
            <div class="relative z-10 flex-1 flex items-center">
              <div class="px-10 py-10">
                <component
                  :is="job.titleTag || 'h3'"
                  class="text-2xl font-semibold leading-tight"
                  :class="job.variant === 'cta' ? 'text-[#161616]' : 'text-white'"
                >
                  {{ job.title }}
                </component>

                <p
                  class="mt-3 text-sm"
                  :class="job.variant === 'cta' ? 'text-[#161616]/80' : 'text-white/60'"
                >
                  {{ job.description }}
                </p>
              </div>
            </div>

            <!-- RIGHT ACTION -->
            <div
              class="relative z-10 w-[260px] flex items-center justify-center"
            >
              <span
                class="inline-flex items-center justify-center px-10 py-3 font-semibold border"
                :class="job.variant === 'cta'
                  ? 'bg-[#161616] text-white border-[#161616] group-hover:bg-[#8D35FF] group-hover:border-[#8D35FF] transition-colors duration-300'
                  : 'bg-transparent text-white border-[#636363] group-hover:border-white/40 transition-colors duration-300'"
              >
                {{ job.variant === 'cta' ? (job.linkText || 'Apply') : (job.linkText || 'View role') }}
              </span>
            </div>

            <!-- subtle inner divider line like mock -->
            <div
              class="absolute left-[190px] top-0 bottom-0 w-px bg-[#636363] z-10"
            ></div>
          </div>
        </NuxtLink>
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
  glowEffect: { type: String, default: "GlowBlue" }, // можно менять снаружи
});

// ВАЖНО: без импортов по путям — Nuxt сам зарегистрирует компоненты из /components
const glowComponent = computed(() => {
  // если компонента нет — упадёт resolveComponent. Поэтому делаем fallback:
  const name = props.glowEffect || "GlowBlue";
  try {
    return resolveComponent(name);
  } catch (e) {
    return resolveComponent("GlowEffect");
  }
});
</script>


