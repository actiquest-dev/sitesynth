// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  ssr: true, // optional, true by default but can be explicit

  nitro: {
    preset: 'vercel', // ✅ change from 'static' to 'vercel'
  },

  app: {
    baseURL: '/', // ✅ change from '/Synth/' to '/'
    // ❌ remove `buildAssetsDir` unless you specifically need a custom one
  }
})
