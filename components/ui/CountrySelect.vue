<template>
  <div class="relative w-full">
    <div
      class="w-full flex items-center gap-2 border px-3 py-2.5 cursor-pointer transition-colors"
      style="background: #1a1a1a;"
      :style="{ borderColor: isOpen ? '#8D35FF' : '#2a2a2a' }"
      @click="isOpen = !isOpen">
      <!-- Globe icon -->
      <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5 text-[#555] flex-shrink-0">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146Zm4 .708a.5.5 0 0 0-.708.708L10.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5Z"/>
      </svg>
      <!-- Country Name -->
      <span class="text-sm flex-1 truncate" :class="selectedCountry ? 'text-white' : 'text-[#333]'">
        {{ selectedCountry?.name || 'Select country' }}
      </span>

      <!-- Chevron -->
      <svg viewBox="0 0 16 16" fill="currentColor" class="w-3.5 h-3.5 text-[#555] flex-shrink-0 transition-transform" :class="{ 'rotate-180': isOpen }">
        <path d="M4.427 7.427l3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"/>
      </svg>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen"
         class="absolute top-full left-0 right-0 mt-1 border border-[#2a2a2a] z-50 max-h-64 overflow-y-auto" style="background: #1a1a1a;">
      
      <!-- Search Box -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search country..."
        class="w-full sticky top-0 border-b px-3 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none" style="background: #1a1a1a; border-color: #2a2a2a;"
      />

      <!-- Country Options -->
      <div v-for="country in filteredCountries"
           :key="country.code"
           @click="selectCountry(country)"
           :class="[
             'px-4 py-3 flex items-center gap-3 cursor-pointer transition',
             selectedCountry?.code === country.code
               ? 'bg-[#8D35FF]/20 border-l-2 border-[#8D35FF]'
               : 'hover:bg-[#232323]',
           ]">
        <span class="flex-1 text-white text-sm">{{ country.name }}</span>
        <span class="text-[#555] text-xs">{{ country.code }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchQuery = ref('')
const countries = ref([])
const selectedCountry = ref(null)

// Load countries list
onMounted(async () => {
  try {
    const response = await fetch('/api/countries')
    const data = await response.json()
    if (data.success) {
      countries.value = data.countries
      // Set initial selected country if modelValue exists
      if (props.modelValue) {
        selectedCountry.value = countries.value.find(c => c.code === props.modelValue)
      }
    }
  } catch (error) {
    console.error('Failed to load countries:', error)
  }
})

// Filter countries by search query
const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries.value
  const query = searchQuery.value.toLowerCase()
  return countries.value.filter(c =>
    c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query)
  )
})

const selectCountry = (country) => {
  selectedCountry.value = country
  emit('update:modelValue', country.code)
  isOpen.value = false
}

// Convert country code to flag emoji
const getCountryFlag = (code) => {
  if (!code || code.length !== 2) return '🌍'
  const codePoints = [...code.toUpperCase()].map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
