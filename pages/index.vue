<template>
  <HeaderSection />
  <HeroIndex :title="hero.title" :subtitle="hero.subtitle" />
  <Carousel :images="carouselImages" />
  <BannerSection :sectionTitle="banner.sectionTitle" />
  <WhatWeOfferSection :offers="offers" />
  <ProcessSection
    :imageSrc="process.imageSrc"
    :imageAlt="process.imageAlt"
    :sections="process.sections"
  />
   <AiToolSection />
  <ConsultancySection
    :leftTitle="consultancy.leftTitle"
    :leftItems="consultancy.leftItems"
    :rightTitle="consultancy.rightTitle"
    :rightItems="consultancy.rightItems"
  />
  <StoriesSection
    :storiesText="stories.storiesText"
    :storiesLink="stories.storiesLink"
    :blogText="stories.blogText"
    :blogLink="stories.blogLink"
  />
  <Testimonial
    :imageSrc="testimonial.imageSrc"
    :personName="testimonial.personName"
    :personTitle="testimonial.personTitle"
    :quoteTitle="testimonial.quoteTitle"
    :quoteText="testimonial.quoteText"
    :ctaText="testimonial.ctaText"
    :ctaLink="testimonial.ctaLink"
    :class="testimonial.class"
  />
  <FooterSection />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const hero = ref({})
const carouselImages = ref([])
const banner = ref({})
const offers = ref([])
const process = ref({})
const consultancy = ref({})
const stories = ref({})
const testimonial = ref({})

onMounted(async () => {
  // Always use absolute path for dev (npm run dev), baseURL only for SSG/subfolder
  let jsonPath = '/assets/json/index.json'
  // Only use baseURL if running in production and baseURL is set and not '/'
  // Fix: in dev, ignore baseURL completely
  // Fix for Nuxt 3: useFetch must be called outside onMounted for SSR hydration!
  if (import.meta.env.MODE === 'production' && import.meta.env.SSR === false) {
    const config = useRuntimeConfig()
    if (config.app.baseURL && config.app.baseURL !== '/') {
      jsonPath = config.app.baseURL.replace(/\/$/, '') + '/assets/json/index.json'
    }
  }
  // Use fetch instead of useFetch for client-only fetch in onMounted
  try {
    const response = await fetch(jsonPath)
    if (!response.ok) throw new Error('Network response was not ok')
    const pageData = await response.json()
    hero.value = pageData.hero || {}
    carouselImages.value = pageData.carouselImages || []
    banner.value = pageData.banner || {}
    offers.value = pageData.offers || []
    process.value = pageData.process || {}
    consultancy.value = pageData.consultancy || {}
    stories.value = pageData.stories || {}
    testimonial.value = pageData.testimonial || {}
  } catch (error) {
    console.error('Error fetching index.json:', error)
  }
})
</script>
