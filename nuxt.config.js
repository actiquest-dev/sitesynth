// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2025-05-15',

  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/sitemap', '@nuxtjs/robots'],

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
  },

  runtimeConfig: {
    // The private keys which are only available on server-side
    brevoApiKey: process.env.BREVO_API_KEY,
  },

  sitemap: {
    siteUrl: 'https://synth-phi.vercel.app',
    autoLastmod: true,
  },

})