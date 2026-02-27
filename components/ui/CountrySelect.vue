<template>
  <div class="relative">
    <div class="flex items-center gap-3 bg-[#1a1a1a] border border-[#333] px-4 py-3 rounded-lg cursor-pointer hover:border-[#444] transition"
         @click="isOpen = !isOpen">
      <!-- Flag + Country Code -->
      <span v-if="selectedCountry" class="text-xl">
        {{ getCountryFlag(selectedCountry.code) }}
      </span>
      <span v-else class="text-xl">🌍</span>
      
      <!-- Country Name -->
      <span class="text-white flex-1 text-sm">
        {{ selectedCountry?.name || 'Select country' }}
      </span>
      
      <!-- Chevron -->
      <font-awesome
        :icon="['fas', 'chevron-down']"
        class="text-[#999999] transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen"
         class="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-lg z-50 max-h-64 overflow-y-auto">
      
      <!-- Search Box -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search country..."
        class="w-full sticky top-0 bg-[#1a1a1a] border-b border-[#333] px-4 py-2 text-sm text-white placeholder:text-[#555] focus:outline-none"
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
        <span class="text-xl">{{ getCountryFlag(country.code) }}</span>
        <span class="flex-1 text-white text-sm">{{ country.name }}</span>
        <span class="text-[#999999] text-xs">{{ country.code }}</span>
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
