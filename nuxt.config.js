// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",

  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@zadigetvoltaire/nuxt-gtm",
    "@nuxtjs/sitemap",
  ],

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
          rel: "shortcut icon",
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
      siteUrl: process.env.SITE_URL,
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
      changefreq: "monthly",
      priority: 0.8,
      lastmod: new Date().toISOString().split("T")[0],
    },
    urls: [
      {
        loc: "/",
        changefreq: "weekly",
        priority: 1.0,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/about-us",
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/contact-us",
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/ai-innovation",
        changefreq: "monthly",
        priority: 0.9,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/brand-driven-product-strategy",
        changefreq: "monthly",
        priority: 0.9,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/ux-and-design-system",
        changefreq: "monthly",
        priority: 0.9,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/full-stack-implementation",
        changefreq: "monthly",
        priority: 0.9,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/scoresynth",
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/privacy-and-policy",
        changefreq: "yearly",
        priority: 0.3,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/careers",
        changefreq: "weekly",
        priority: 0.7,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/careers/full-stack-developer",
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/careers/marketing-manager",
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date().toISOString().split("T")[0],
      },
      {
        loc: "/careers/ux-ui-designer",
        changefreq: "weekly",
        priority: 0.6,
        lastmod: new Date().toISOString().split("T")[0],
      },
    ],
  },
});
