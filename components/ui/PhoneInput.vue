<template>
  <VueTelInput
    v-model="phone"
    @update:modelValue="handleInput"
    :inputOptions="inputOptions"
    :dropdownOptions="dropdownOptions"
    mode="international"
  />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { VueTelInput } from "vue-tel-input";
// import "vue-tel-input/vue-tel-input.css";

onMounted(async () => {
  // Load CSS only on client (SSR-friendly)
  await import("vue-tel-input/vue-tel-input.css");
});

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  inputOptions: {
    type: Object,
    default: () => ({
      placeholder: "Enter phone",
      styleClasses:
        "w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8CB0FF]",
    }),
  },
  dropdownOptions: {
    type: Object,
    default: () => ({
      showDialCodeInSelection: true,
      showFlags: true,
      showSearchBox: true,
    }),
  },
});

const emit = defineEmits(["update:modelValue"]);

const phone = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    phone.value = newVal;
  }
);

const handleInput = (value, phoneObject) => {
  // NOTE: emits value + phoneObject (2 args)
  emit("update:modelValue", value, phoneObject);
};
</script>

<style>
/* Root wrapper */
.vue-tel-input {
  border: none !important;
  background-color: transparent !important;
}

.vue-tel-input:focus-within {
  box-shadow: none !important;
  border: none !important;
}

/* Left dropdown (flag + dial code + arrow) */
.vue-tel-input .vti__dropdown {
  background-color: #232323 !important;
  border: 1px solid #333 !important;
  border-radius: 0.5rem 0 0 0.5rem !important;
  padding-left: 10px !important;
  padding-right: 12px !important; /* gives the arrow some air */
}

.vue-tel-input .vti__dropdown:hover {
  background-color: #2a2a2a !important;
}

/* ---- Fix: flag too close to arrow ---- */
/* In many versions, .vti__selection wraps flag + dialCode + arrow */
.vue-tel-input .vti__selection {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important; /* adjust: 6–10px */
}

/* Fallback: push arrow away if gap isn't applied */
.vue-tel-input .vti__dropdown-arrow {
  color: #999999 !important;
  margin-left: 8px !important;
  transform: scale(0.85);
  transform-origin: center;
}

/* Smaller flag (subtle) */
.vue-tel-input .vti__flag {
  transform: scale(0.85);
  transform-origin: center;
}

/* If flags are rendered via <img> */
.vue-tel-input .vti__flag img {
  width: 16px !important;
  height: 12px !important;
}

/* Dropdown list */
.vue-tel-input .vti__dropdown-list {
  background-color: #232323 !important;
  border: 1px solid #333 !important;
  border-radius: 0.5rem !important;
  max-height: 200px !important;
  overflow-y: auto !important;
}

.vue-tel-input .vti__dropdown-item {
  color: #999999 !important;
  padding: 8px 12px !important;
}

.vue-tel-input .vti__dropdown-item:hover {
  background-color: #2a2a2a !important;
}

.vue-tel-input .vti__dropdown-item.highlighted {
  background-color: #3b82f6 !important;
  color: white !important;
}

/* Right input */
.vue-tel-input .vti__input {
  background-color: #232323 !important;
  border: 1px solid #333 !important;
  border-radius: 0 0.5rem 0.5rem 0 !important;
  color: white !important;
  padding: 0.75rem 1rem !important;
}

.vue-tel-input .vti__input:focus {
  outline: none !important;
  box-shadow: 0 0 0 2px #3b82f6 !important;
  border-color: #8cb0ff !important;
}

.vue-tel-input .vti__input::placeholder {
  color: #666666 !important;
}

/* Search inside dropdown */
.vue-tel-input .vti__search_box {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;
  color: white !important;
  padding: 8px !important;
  margin: 8px !important;
  border-radius: 0.5rem !important;
}

.vue-tel-input .vti__search_box:focus {
  outline: none !important;
  border-color: #8cb0ff !important;
}
</style>
