<template>
  <NuxtPage />
</template>

<script setup>
import { useRoute } from 'vue-router'
import '~/assets/style.scss'
import { useHead } from '#imports'
import { computed } from 'vue'

const route = useRoute()

// Computed canonical URL that updates with route changes
const canonicalUrl = computed(() => {
  const baseUrl = 'https://synth-phi.vercel.app'
  // Remove trailing slash and ensure proper formatting
  const path = route.path === '/' ? '' : route.path
  return `${baseUrl}${path}`
})

useHead({
  title: 'Synth - No silos. Just synthesis.',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { charset: 'utf-8' }
  ],
  meta: [
    {
      name: 'google-site-verification',
      content: 'ObW9imC_xGfEY6gSafAumvQEcun2jsxue36sq8U6yME'
    }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/assets/favicon.svg' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@100..900&display=swap' },
    { rel: 'stylesheet', href: 'https://unpkg.com/swiper/swiper-bundle.min.css' },
    { rel: 'canonical', href: canonicalUrl }
  ],
  script: [
    { src: 'https://unpkg.com/swiper/swiper-bundle.min.js', body: true },
    { src: 'https://kit.fontawesome.com/960a8c2498.js', crossorigin: 'anonymous' },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "SiteSynth Mayya Approsine Antwerp",
        "alternateName": "SiteSynth",
        "url": "https://synth-phi.vercel.app",
        "logo": "https://synth-phi.vercel.app/logo.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Oude Kerkstraat 14",
          "addressLocality": "Puurs-Sint-Amands",
          "postalCode": "2890",
          "addressCountry": "BE"
        },
        "vatID": "BE1022394648",
        "legalName": "SiteSynth Mayya Approsine Antwerp",
        "additionalType": "https://schema.org/LocalBusiness",
        "founder": {
          "@type": "Person",
          "name": "Mayya Approsine"
        },
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Oude Kerkstraat 14",
            "addressLocality": "Puurs-Sint-Amands",
            "postalCode": "2890",
            "addressCountry": "BE"
          }
        }
      })
    }
  ]
})
</script>
