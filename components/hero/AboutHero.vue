<template>
  <section class="relative bg-[#161616] text-white overflow-hidden">
    <component :is="selectedGlowEffect" />
    <ParticleEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-48 pb-24">
      <div class="text-center max-w-4xl mx-auto">
        <div
          v-for="(item, index) in content"
          :key="index"
          :class="item.margin || 'mb-6'"
        >
          <component :is="item.tag" :class="getClasses(item.tag)">
            <span v-if="item.html" v-html="item.text"></span>
            <span v-else>{{ item.text }}</span>
          </component>
        </div>
      </div>

      <!-- Таблетки -->
      <div class="mt-10 sm:mt-12 flex flex-wrap justify-center gap-[10px] max-w-3xl mx-auto">
        <div
          v-for="(tag, index) in tags"
          :key="index"
          :style="{ '--i': index }"
          class="pill-wrap"
        >
          <div class="pill-body">{{ tag.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, defineAsyncComponent } from "vue"
import ParticleEffect from "@/components/effects/ParticleEffect.vue"

const props = defineProps({
  content: { type: Array, required: true },
  glowEffect: { type: String, default: "GlowBlue" },
})

const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() => import(`@/components/effects/${props.glowEffect}.vue`))
)

const tags = [
  { label: "Product-First" },
  { label: "Design-Led" },
  { label: "Senior-Only Team" },
  { label: "Tech & Brand Aligned" },
  { label: "Docs Included" },
  { label: "Transparent Scope" },
  { label: "Clean Handoff" },
  { label: "AI-Ready Stack" },
]

const getClasses = (tag) => {
  switch (tag) {
    case "h1": return "text-4xl sm:text-5xl font-extrabold leading-tight"
    case "h2": return "text-3xl sm:text-4xl font-bold"
    case "p":  return "text-base sm:text-lg text-[#d4d4d4]"
    default:   return "text-white"
  }
}
</script>

<style scoped>
.pill-wrap {
  opacity: 0;
  animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i) * 70ms);
}

.pill-body {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid #444444;
  background: transparent;
  padding: 5px 14px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  color: #888888;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.pill-wrap:hover .pill-body {
  color: #aaaaaa;
  border-color: #666666;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .pill-wrap { animation: none; opacity: 1; }
}
</style>
