<template>
  <!-- Header -->
  <header
    :class="[
      'w-full fixed top-0 left-0 z-50 py-4 backdrop-blur-md transition-all duration-300',
      darkBackground ? 'bg-[#161616]' : '',
      scrolled ? 'bg-[#161616] sm:bg-[#161616b3]' : ''
    ]"
  >
    <div class="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
      <!-- Logo (always visible) -->
      <div class="flex-shrink-0 w-50">
        <NuxtLink to="/"><img src="/assets/Vector.svg" alt="logo"></NuxtLink>
      </div>
      <!-- Hamburger Icon (Mobile Only) -->
      <button @click="toggleMenu" class="cursor-pointer lg:hidden text-[#6E0015] text-2xl" aria-label="Open menu">
        <div class="flex flex-col space-y-1">
          <span
            :class="['block w-8 h-[3px] bg-white transition-transform duration-300', menuOpen ? 'rotate-45 translate-y-[7px]' : '']"></span>
          <span
            :class="['block w-8 h-[3px] bg-white transition-opacity duration-300', menuOpen ? 'opacity-0' : '']"></span>
          <span
            :class="['block w-8 h-[3px] bg-white transition-transform duration-300', menuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
        </div>
      </button>
      <DesktopMenu :hoverbg="hoverbg" :hoverborder="hoverborder" />
      <MobileMenu :menuOpen="menuOpen" />

    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  darkBackground: {
    type: Boolean,
    default: false
  },
  hoverbg: {
    type: String,
    default: 'hover:bg-[#8D35FF]'
  },
  hoverborder: {
    type: String,
    default: 'hover:border-[#8D35FF]'
  }
})

const menuOpen = ref(false)
const scrolled = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function handleScroll() {
  scrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
