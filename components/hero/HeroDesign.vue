<template>
  <section :id="id || undefined" class="bg-[#161616]">
    <div class="max-w-[1248px] mx-auto px-6 py-24 text-center">
      <h2 class="text-white text-4xl sm:text-5xl font-extrabold">
        {{ title }}
      </h2>

      <p class="text-white/80 text-base sm:text-lg font-medium mt-6">
        {{ description }}
      </p>

      <!-- Input row -->
      <div class="mt-12 flex items-center justify-center">
        <div class="w-full max-w-[900px] flex items-stretch gap-6">
          <!-- Left icon (можешь заменить на свой SVG/картинку) -->
          <div class="flex items-center justify-center w-14">
            <img
              v-if="leftIconSrc"
              :src="leftIconSrc"
              alt=""
              class="w-10 h-10"
            />
          </div>

          <!-- Input + Button -->
          <div class="flex-1 flex items-stretch">
            <input
              v-model="value"
              :placeholder="placeholder"
              class="flex-1 h-16 px-6 bg-white/10 text-white placeholder:text-white/40
                     border border-white/20 focus:outline-none focus:border-white/40"
              type="text"
            />

            <!-- Purple button with arrow -->
            <button
              type="button"
              class="h-16 w-20 bg-[#6B3FA6] flex items-center justify-center
                     text-white transition-colors duration-300 hover:bg-[#7a49bf]"
              @click="onClick"
              aria-label="Submit link"
            >
              <font-awesome
                :icon="['fas', 'arrow-right']"
                class="text-lg"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- optional helper -->
      <p v-if="helperText" class="mt-4 text-white/50 text-sm">
        {{ helperText }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  title: { type: String, default: "Design that’s consistent, scalable, and ready to ship." },
  description: {
    type: String,
    default:
      "We build design systems and UX architecture that grow with your product — enabling your teams to move faster, stay on-brand, and deliver with confidence.",
  },
  placeholder: { type: String, default: "Enter a link" },
  modelValue: { type: String, default: "" },
  leftIconSrc: { type: String, default: "" }, // сюда можешь поставить Figma иконку
  helperText: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const value = ref(props.modelValue);

watch(
  () => props.modelValue,
  (v) => {
    value.value = v;
  }
);

watch(value, (v) => emit("update:modelValue", v));

function onClick() {
  emit("submit", value.value);
}
</script>

