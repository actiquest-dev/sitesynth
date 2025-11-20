<template>
  <section class="relative bg-[#161616] text-white overflow-hidden">
    <component :is="selectedGlowEffect" />
    <ParticleEffect />

    <div class="relative max-w-[1248px] mx-auto px-6 pt-[12rem] pb-24">
      <!-- Dynamic Content -->
      <div class="text-center max-w-4xl mx-auto">
        <div
          v-for="(item, index) in content"
          :key="index"
          :class="item.margin || 'mb-6'"
        >
          <component
            :is="item.tag"
            :class="getClasses(item.tag)"
          >
            <span v-if="item.html" v-html="item.text"></span>
            <span v-else>{{ item.text }}</span>
          </component>
        </div>
      </div>

      <!-- Pills -->
      <div class="mt-12 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
        <div
          v-for="(tag, index) in tags"
          :key="index"
          :class="[
            'rounded-full',
            tag.variant === 'primary'
              ? 'bg-gradient-to-r from-[#2F46FF] via-[#8D35FF] to-[#FF7AF2] p-[1px]'
              : 'border border-[#FFFFFF22]'
          ]"
        >
          <div
            class="rounded-full bg-[#161616] px-8 py-3 text-sm font-medium text-white/90"
          >
            {{ tag.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineAsyncComponent, computed } from "vue";
import ParticleEffect from "@/components/effects/ParticleEffect.vue";

const props = defineProps({
  content: Array,
  glowEffect: {
    type: String,
    default: "GlowBlue"
  }
});

// dynamic glow component loading
const selectedGlowEffect = computed(() =>
  defineAsyncComponent(() =>
    import(`@/components/effects/${props.glowEffect}.vue`)
  )
);

// Pills
const tags = [
  { label: "Dev Handoff", variant: "primary" },
  { label: "Embedded Support", variant: "secondary" },
  { label: "Dev Handoff", variant: "pr
