// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",

  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@zadigetvoltaire/nuxt-gtm"],

  components: [{ path: "~/components", pathPrefix: false }],

  ssr: true, // optional, true by default but can be explicit

  nitro: {
    preset: "vercel", // ✅ change from 'static' to 'vercel'
  },

  app: {
    baseURL: "/",
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "google-site-verification",
          content: "ZuM9hSt-NO7KjEYf_o5yjeiGyTbsOVekDz-R1z-4ilk",
        },
        // Additional meta tags for better SEO
        { name: "application-name", content: "SiteSynth" },
        { name: "apple-mobile-web-app-title", content: "SiteSynth" },
        { name: "apple-mobile-web-app-capable", content: "yes" },

        // Additional meta tags for better SEO
        { name: "theme-color", content: "#161616" },
        { name: "msapplication-TileColor", content: "#161616" },
      ],
      link: [
        // Favicon links for better Google recognition
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/assets/favicon/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/assets/favicon/apple-touch-icon.png",
        },
      ],
    },
  },

  runtimeConfig: {
    // The private keys which are only available on server-side
    brevoApiKey: process.env.BREVO_API_KEY,
    // Public runtime config (available on client & server)
    public: {
      siteUrl: process.env.SITE_URL || "https://www.sitesynth.com",
    },
  },

  // Sitemap configuration for proper XML generation
  site: {
    url: "https://www.sitesynth.com",
    name: "SiteSynth",
  },

  gtm: {
    id: "GTM-5N4FRNDR",
    enableRouterSync: true,
    debug: true,
  },
});
