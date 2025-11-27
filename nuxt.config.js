// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",

  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/sitemap",
    "@zadigetvoltaire/nuxt-gtm",
  ],

  components: [{ path: "~/components", pathPrefix: false }],

  ssr: true, // optional, true by default but can be explicit

  nitro: {
    preset: "vercel", // ✅ change from 'static' to 'vercel'
  },

  sourcemap: {
    server: false,
    client: false
  },

  app: {
    baseURL: "/", // ✅ change from '/Synth/' to '/'
    // ❌ remove `buildAssetsDir` unless you specifically need a custom one
    // Add global head meta tags (site-wide). This includes Ahrefs verification.
    head: {
      meta: [
        {
          name: "ahrefs-site-verification",
          content:
            "0fd5ac2fe7fed2e5e1ed9880e6047013d1627cffdd552e885f66a53b170ad488",
        },
        {
          name: "google-site-verification",
          content: "ZuM9hSt-NO7KjEYf_o5yjeiGyTbsOVekDz-R1z-4ilk",
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

  // Canonical site url used by sitemap/plugins. Prefer SITE_URL env var.
  site: {
    url: process.env.SITE_URL || "https://www.sitesynth.com",
  },

  // Sitemap configuration for proper XML generation
  sitemap: {
    defaults: {
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: new Date().toISOString()
    },
    // Override specific routes with custom metadata
    routes: [
      {
        url: '/',
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        url: '/careers',
        changefreq: 'weekly',
        priority: 0.7
      },
      {
        url: '/careers/full-stack-developer',
        changefreq: 'weekly',
        priority: 0.6
      },
      {
        url: '/careers/marketing-manager',
        changefreq: 'weekly',
        priority: 0.6
      },
      {
        url: '/careers/ux-ui-designer',
        changefreq: 'weekly',
        priority: 0.6
      },
      {
        url: '/contact-us',
        changefreq: 'monthly',
        priority: 0.7
      }
    ]
  },

  gtm: {
    id: "GTM-5N4FRNDR",
    enableRouterSync: true,
    debug: true,
  },
});
