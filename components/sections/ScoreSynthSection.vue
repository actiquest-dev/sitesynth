<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white group overflow-hidden"
  >
    <GlowRed />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[6rem] pb-[6rem]">
      <div class="text-center px-6">
        <img
          v-if="imageSrc"
          :src="imageSrc"
          :alt="imageAlt || ''"
          class="mx-auto block w-20 pb-6"
        />

        <h2 v-if="title" class="text-4xl font-extrabold mb-10">{{ title }}</h2>
        <h3 v-if="h3" class="text-2xl font-normal mb-10">{{ h3 }}</h3>
        <p v-if="description" class="text-base sm:text-lg font-normal">
          {{ description }}
        </p>

        <!-- Call-to-Action Buttons -->
        <div
          v-if="hasAnyCta"
          class="flex flex-col sm:flex-row justify-center gap-4 mt-6"
          :style="{ '--hover': hover }"
        >
          <a
            v-if="hasPrimaryCta"
            :href="primaryLink"
            class="cta-btn cta-primary px-6 py-2 border font-semibold transition-colors duration-[1000ms] inline-flex items-center justify-center"
          >
            {{ primaryText }}
          </a>

          <a
            v-if="hasSecondaryCta"
            :href="secondaryLink"
            class="cta-btn cta-secondary px-6 py-2 border font-semibold transition-colors duration-[1000ms] inline-flex items-center justify-center"
          >
            {{ secondaryText }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  id: { type: String, default: "" },

  title: { type: String, default: "" },
  h3: { type: String, default: "" },
  description: { type: String, default: "" },

  imageSrc: { type: String, default: "" },
  imageAlt: { type: String, default: "" },

  // CTA (если не передашь — кнопки не появятся)
  primaryText: { type: String, default: "" },
  primaryLink: { type: String, default: "" },
  secondaryText: { type: String, default: "" },
  secondaryLink: { type: String, default: "" },

  // hover color for both buttons
  hover: { type: String, default: "#AA3733" },

  // вторичная кнопка фон
  secondaryBg: { type: String, default: "#FFFFFF" },

  // если вдруг захочешь скрыть кнопки принудительно
  showCtas: { type: Boolean, default: true },
});

const hasPrimaryCta = computed(() => {
  return (
    props.showCtas &&
    !!props.primaryText?.trim() &&
    !!props.primaryLink?.trim()
  );
});

const hasSecondaryCta = computed(() => {
  return (
    props.showCtas &&
    !!props.secondaryText?.trim() &&
    !!props.secondaryLink?.trim()
  );
});

const hasAnyCta = computed(() => hasPrimaryCta.value || hasSecondaryCta.value);
</script>

<style scoped>
/* Shared hover */
.cta-btn:hover {
  background: var(--hover);
  border-color: var(--hover);
  color: #ffffff;
}

/* Primary: black bg, WHITE border */
.cta-primary {
  background: #161616;
  color: #ffffff;
  border-color: #ffffff;
}

/* Secondary: WHITE bg (or #DDDDDD), BLACK border */
.cta-secondary {
  background: v-bind(secondaryBg);
  color: #161616;
  border-color: #161616;
}
</style>
