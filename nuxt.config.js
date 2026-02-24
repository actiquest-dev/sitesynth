// https://nuxt.com/docs/api/configuration/nuxt-config
// Updated: Nuxt 3.21.1 with future compatibility version 4
export default defineNuxtConfig({
  compatibilityDate: "2026-01-12",

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  // Remove trailing slashes from URLs
  hooks: {
    "pages:extend"(pages) {
      // This ensures Nuxt's router handles trailing slashes consistently
    },
  },

  router: {
    options: {
      strict: true, // Ensures trailing slashes are significant
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@zadigetvoltaire/nuxt-gtm",
    "@nuxtjs/sitemap",
    "@nuxt/fonts",
    "@vesp/nuxt-fontawesome",
  ],

  fontawesome: {
    icons: {
      solid: [
        "envelope",
        "chevron-down",
        "chevron-right",
        "arrow-right",
        "spinner",
        "quote-left",
      ],
      brands: ["linkedin", "twitter"],
    },
  },

  fonts: {
    google: {
      families: {
        Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      display: "swap",
    },
  },

  css: ["swiper/css", "swiper/css/navigation"],

  components: [{ path: "~/components", pathPrefix: false }],

  ssr: true, // optional, true by default but can be explicit

  nitro: {
    preset: "vercel", // ✅ change from 'static' to 'vercel'
    routeRules: {
      // Permanent redirects (301)
      "/privacy-policy": { redirect: "/privacy-and-policy", prerender: true },
    },
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
        { name: "theme-color", content: "#161616" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "https://www.sitesynth.com/favicon.png",
        },
        // Fallback (Google still checks this)
        {
          rel: "shortcut icon",
          type: "image/x-icon",
          href: "https://www.sitesynth.com/favicon.ico",
        },
        // Modern browsers - SVG favicon (scalable, preferred)
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "https://www.sitesynth.com/assets/favicon/favicon-new.svg",
        },
        // Apple devices
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "https://www.sitesynth.com/assets/favicon/apple-touch-icon.png",
        },
        // Web app manifest (contains PWA icons)
        {
          rel: "manifest",
          href: "https://www.sitesynth.com/site.webmanifest",
        },
      ],
    },
  },

  runtimeConfig: {
    // The private keys which are only available on server-side
    brevoApiKey: process.env.BREVO_API_KEY || '',
    // Public runtime config (available on client & server)
    public: {
      siteUrl: process.env.SITE_URL || 'https://www.sitesynth.com',
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

  // Sitemap configuration
  sitemap: {
    hostname: "https://www.sitesynth.com",
    gzip: true,
    defaults: {
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString().split("T")[0],
    },
  },

  vite: {
    ssr: {
      external: ['react', 'react-dom'],
    },
  },
});
