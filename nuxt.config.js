// Load .env.local variables
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env.local') })

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
      "/website-pricing": { redirect: "/pricing", prerender: true },
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
        // Google/search icon
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicongoogle.svg?v=20260324a",
        },
        // Main favicon (non-purple)
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg?v=20260317c",
        },
        // Fallback
        {
          rel: "shortcut icon",
          type: "image/svg+xml",
          href: "/favicon.svg?v=20260317c",
        },
        // Web app manifest (contains PWA icons)
        {
          rel: "manifest",
          href: "/site.webmanifest?v=20260317",
        },
      ],
    },
  },

  runtimeConfig: {
    // The private keys which are only available on server-side
    brevoApiKey: process.env.BREVO_API_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    // Public runtime config (available on client & server)
    public: {
      siteUrl: process.env.SITE_URL || 'https://www.sitesynth.com',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
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
    routes: [
      { url: "/",                                 priority: 1.0, changefreq: "weekly" },
      { url: "/ai-innovation",                    priority: 0.9 },
      { url: "/brand-driven-product-strategy",    priority: 0.9 },
      { url: "/ux-and-design-system",             priority: 0.9 },
      { url: "/full-stack-implementation",        priority: 0.9 },
      { url: "/pricing",                          priority: 0.9 },
      { url: "/scoresynth",                       priority: 0.8 },
      { url: "/about-us",                         priority: 0.7 },
      { url: "/contact-us",                       priority: 0.7 },
      { url: "/careers",                          priority: 0.6 },
      { url: "/careers/full-stack-developer",     priority: 0.5 },
      { url: "/careers/marketing-manager",        priority: 0.5 },
      { url: "/careers/ux-ui-designer",           priority: 0.5 },
    ],
  },

  vite: {
    ssr: {
      external: ['react', 'react-dom'],
      noExternal: ['vue-tel-input'],
    },
  },
});
