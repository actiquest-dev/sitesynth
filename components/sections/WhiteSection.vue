<template>
  <section
    :id="id || undefined"
    :class="[bgColor, 'flex justify-center bg-cover bg-center bg-no-repeat']"
    :style="backgroundImageStyle"
  >
    <div class="relative overflow-hidden z-0 testimonial-card max-w-[1248px] mx-auto text-center px-6 group">
      <div
        :class="[
          bgInside,
          'border border-[#636363] py-14 px-6 sm:px-10 md:py-20 md:px-20 relative overflow-hidden',
        ]"
      >
        <component :is="selectedGlowEffect" />

        <div
          class="absolute inset-0 pointer-events-none opacity-100"
          :style="{
            backgroundImage: `url(${gradientImage})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }"
        ></div>

        <div class="flex flex-col items-center relative z-10">
          <h2 :class="[textColor, 'text-4xl font-bold']">{{ title }}</h2>
          <p :class="[textColor, 'my-6']">{{ description }}</p>

          <!-- Buttons: stretch on mobile -->
          <div
            class="flex flex-col sm:flex-row justify-center gap-4 mt-6 self-stretch sm:self-auto"
            :style="{ '--hover': hover }"
          >
            <a :href="primaryLink" class="cta-btn cta-primary">
              {{ primaryText }}
            </a>

            <a :href="secondaryLink" class="cta-btn cta-secondary">
              {{ secondaryText }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent, computed } from "vue"

const props = defineProps({
  id: { type: String, default: "" },
  title: String,
  description: String,
  primaryText: String,
  primaryLink: String,
  secondaryText: String,
  secondaryLink: String,
  bgColor: { type: String, default: "bg-[#161616]" },
  bgInside: { type: String, default: "bg-[#DDDDDD]" },
  textColor: { type: String, default: "text-[#161616]" },
  glowEffect: { type: String, default: "GlowEffect" },
  bgImage: { type: String, default: null },
  gradientImage: { type: String, default: "/assets/gradients/gradient-for-banner-section.svg" },
  hover: { type: String, default: "#8D35FF" },
})

const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() => import(`@/components/effects/${props.glowEffect}.vue`))
)

const backgroundImageStyle = computed(() => {
  if (props.bgImage) return { backgroundImage: `url(${props.bgImage})` }
  return {}
})
</script>

<style scoped>
.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 44px;
  padding: 0 24px;

  border-width: 1px;
  font-weight: 600;
  text-decoration: none;

  transition: color 1000ms, background-color 1000ms, border-color 1000ms;
}

@media (min-width: 640px) {
  .cta-btn {
    width: auto;
  }
}

.cta-btn:hover {
  background: var(--hover);
  border-color: var(--hover);
  color: #ffffff;
}

.cta-primary {
  background: #161616;
  color: #ffffff;
  border-color: #dddddd;
}

.cta-secondary {
  background: #dddddd;
  color: #161616;
  border-color: #161616;
}
</style>
