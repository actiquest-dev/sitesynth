<template>
  <VueTelInput
    v-model="phone"
    @update:modelValue="handleInput"
    :inputOptions="inputOptions"
    :dropdownOptions="dropdownOptions"
    mode="international"
  >
    <!-- Use the same FontAwesome chevron as DesktopMenu -->
    <template #arrow-icon>
      <font-awesome
        :icon="['fas', 'chevron-down']"
        class="vti__fa-arrow"
        aria-hidden="true"
      />
    </template>
  </VueTelInput>
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
        "w-full bg-[#232323] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:ring-1 focus:ring-[#8CB0FF] focus:border-[#8CB0FF] transition duration-200 hover:border-[#444]",
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
  padding-right: 12px !important;
}

.vue-tel-input .vti__dropdown:hover {
  background-color: #2a2a2a !important;
}

/* Layout inside selection */
.vue-tel-input .vti__selection {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important; /* space between flag/code and arrow */
}

/* Hide built-in arrow (we replace it with FontAwesome) */
.vue-tel-input .vti__dropdown-arrow {
  display: none !important;
}

/* FontAwesome arrow styling (same vibe as DesktopMenu) */
.vue-tel-input .vti__fa-arrow {
  color: #999999 !important;
  opacity: 0.9;
  font-size: 0.85rem; /* tweak if you want smaller/larger */
  transition: transform 0.25s ease, opacity 0.25s ease;
}

/* Rotate on open (class name varies by version, so we cover common ones) */
.vue-tel-input .vti__dropdown.open .vti__fa-arrow,
.vue-tel-input .vti__dropdown.show .vti__fa-arrow,
.vue-tel-input .vti__dropdown.active .vti__fa-arrow {
  transform: rotate(180deg);
}

/* Smaller flag (subtle) */
.vue-tel-input .vti__flag {
  transform: scale(0.85);
  transform-origin: center;
}

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
  font-size: 0.875rem !important; /* Tailwind text-sm */
  line-height: 1.25rem !important;
}

.vue-tel-input .vti__input:focus {
  outline: none !important;
  box-shadow: 0 0 0 2px #3b82f6 !important;
  border-color: #8cb0ff !important;
}

.vue-tel-input .vti__input::placeholder {
  color: #666666 !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

/* Normalize selection text size too */
.vue-tel-input .vti__selection,
.vue-tel-input .vti__dial-code {
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

/* Search inside dropdown */
.vue-tel-input .vti__search_box {
  background-color: #1a1a1a !important;
  border: 1px solid #333 !important;
  color: white !important;
  padding: 8px !important;
  margin: 8px !important;
  border-radius: 0.5rem !important;

  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.vue-tel-input .vti__search_box:focus {
  outline: none !important;
  border-color: #8cb0ff !important;
}
</style>

