<template>
  <section
    :id="id || undefined"
    class="relative bg-[#161616] text-white overflow-hidden"
  >
    <!-- optional: твой фон/паттерн можно оставить как есть -->

    <div class="relative max-w-[1248px] mx-auto px-6 pt-24 pb-24 text-center">
      <h2 class="text-4xl sm:text-6xl font-extrabold">
        {{ title }}
      </h2>

      <p class="text-white/80 text-base sm:text-lg font-medium mt-6 max-w-[980px] mx-auto">
        {{ description }}
      </p>

      <!-- INPUT ROW -->
      <div class="mt-12 flex justify-center">
        <div class="w-full max-w-[980px] flex items-center gap-6">
          <!-- left icon (как у тебя) -->
          <div class="shrink-0">
            <img
              v-if="leftIconSrc"
              :src="leftIconSrc"
              alt=""
              class="w-12 h-12"
            />
          </div>

          <!-- input + purple square -->
          <div class="flex-1 flex items-stretch">
            <input
              v-model="value"
              :placeholder="placeholder"
              class="flex-1 h-16 px-6 bg-white/10 text-white placeholder:text-white/40
                     border border-white/15 focus:outline-none focus:border-white/30"
              type="text"
            />

            <!-- ✅ purple square (вот тут стрелка) -->
            <button
              type="button"
              class="h-16 w-20 bg-[#6B3FA6] flex items-center justify-center text-white"
              @click="submit"
              aria-label="Submit"
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
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  id: { type: String, default: "" },
  title: { type: String, default: "Design that’s consistent, scalable, and ready to ship." },
  description: { type: String, default: "" },
  placeholder: { type: String, default: "Enter a link" },
  leftIconSrc: { type: String, default: "" }, // например "/assets/figma.svg"
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const value = ref(props.modelValue);

watch(
  () => props.modelValue,
  (v) => (value.value = v)
);

watch(value, (v) => emit("update:modelValue", v));

function submit() {
  emit("submit", value.value);
}
</script>


