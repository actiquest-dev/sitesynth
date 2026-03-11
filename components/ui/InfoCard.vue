<template>
  <div class="border border-[#333] bg-[#161616]/70 p-8">
    <div class="flex items-start gap-4">
      <div class="mt-1 shrink-0">
        <slot name="icon" />
      </div>

      <div>
        <h3 class="text-white text-xl font-semibold leading-tight">
          {{ title }}
        </h3>

        <p v-if="description" class="mt-3 text-[#999999] text-sm leading-relaxed max-w-[460px]">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
});
</script>
