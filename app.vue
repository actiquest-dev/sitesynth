<template>
  <NuxtPage />
</template>

<script setup>
import '~/assets/tailwind.css'
import '~/assets/style.css'
import { useHead } from '#imports'

useHead({
  title: 'Synth - No silos. Just synthesis.',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { charset: 'utf-8' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/assets/favicon.svg' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap' },
    { rel: 'stylesheet', href: 'https://unpkg.com/swiper/swiper-bundle.min.css' }
  ],
  script: [
    { src: 'https://unpkg.com/swiper/swiper-bundle.min.js', body: true }
  ]
})
</script>
