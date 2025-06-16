<template>
  <!-- Header -->
  <header class="w-full bg-[#161616] shadow-sm fixed top-0 left-0 z-50 py-4">
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
      <DesktopMenu />
      <!-- Mobile Menu -->
      <div
        :class="['fixed top-[112px] left-0 w-full h-[calc(100vh-5rem)] bg-[#161616] flex flex-col items-center pt-[5rem] space-y-6 text-white transition-transform duration-300', menuOpen ? '' : '-translate-x-full']">
        <nav class="flex flex-col space-y-4 text-center">
          <a href="#" class="hover:text-[#A620FF] font-medium transition-colors duration-1000">Product</a>
          <NuxtLink to="/solution" class="hover:text-[#A620FF] font-medium transition-colors duration-1000">Solutions
          </NuxtLink>
          <a href="#" class="hover:text-[#A620FF] font-medium transition-colors duration-1000">Resources</a>
          <a href="#" class="hover:text-[#A620FF] font-medium transition-colors duration-1000">Company</a>
          <a href="#" class="hover:text-[#A620FF] font-medium transition-colors duration-1000">Pricing</a>
        </nav>
        <div class="flex flex-col items-center space-y-4">
          <a href="#" class="text-white font-medium hover:text-[#8CB0FF] transition-colors duration-1000">Sign up</a>
          <a href="#" class="button btn-2 px-4 py-2 text-white font-semibold"><span>Get started</span></a>
        </div>
        <div class="flex space-x-6">
          <!-- LinkedIn -->
          <a href="#" aria-label="LinkedIn"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#0A66C2] hover:text-white transition duration-1000">
            <i class="fab fa-linkedin text-xl text-white"></i>
          </a>
          <!-- Instagram -->
          <a href="#" aria-label="Instagram"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#E4405F] hover:text-white transition duration-1000 text-white">
            <i class="fab fa-instagram text-xl"></i>
          </a>
          <!-- YouTube -->
          <a href="#" aria-label="YouTube"
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#FF0000] hover:text-white transition duration-1000 text-white">
            <i class="fab fa-youtube text-xl"></i>
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { NuxtLink } from '#components'

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>
