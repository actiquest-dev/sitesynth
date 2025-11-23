<template>
  <Analytics />
  <NuxtPage />
</template>

<script setup>
import { useRoute } from "vue-router";
import "~/assets/style.scss";
import { useHead, useRuntimeConfig } from "#imports";
import { computed } from "vue";
import { Analytics } from "@vercel/analytics/nuxt";

const route = useRoute();

// Computed canonical URL that updates with route changes
const config = useRuntimeConfig();
// Default base URL (can be overridden with SITE_URL env var)
const baseUrl = config.public?.siteUrl;
const canonicalUrl = computed(() => {
  // Remove trailing slash and ensure proper formatting
  const path = route.path === "/" ? "" : route.path;
  return `${baseUrl}${path}`;
});

useHead({
  // Default title - pages can override this completely
  title:
    "SiteSynth - No silos. Just synthesis. | Strategic Design & Development",

  // Default meta tags - pages can override specific ones
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { charset: "utf-8" },
    { name: "robots", content: "index, follow" }, // Default to allow indexing
    { name: "author", content: "SiteSynth" },
    { name: "generator", content: "Nuxt 3" },

    // Default description - pages should override this
    {
      name: "description",
      content:
        "Strategic design and development company that bridges product, brand, and tech to create scalable digital solutions.",
    },

    // Default keywords - pages can extend or override
    {
      name: "keywords",
      content:
        "strategic design, product development, brand strategy, full-stack development, design systems",
    },

    // Default Open Graph - pages can override specific values
    { property: "og:site_name", content: "SiteSynth" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_US" },

    // Default Twitter Card - pages can override
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@sitesynth" },
    { name: "twitter:creator", content: "@sitesynth" },
    // Default share image (fallback) - pages can override
    { property: "og:image", content: `${baseUrl}/assets/shareimage.png` },
    { property: "og:image:alt", content: "SiteSynth - Share Image" },
    { name: "twitter:image", content: `${baseUrl}/assets/shareimage.png` },
    { name: "twitter:image:alt", content: "SiteSynth - Share Image" },
  ],
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/assets/favicon/favicon.svg" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      href: "/assets/favicon/favicon-96x96.png",
    },
    { rel: "shortcut icon", href: "/assets/favicon/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/assets/favicon/apple-touch-icon.png",
    },
    { rel: "manifest", href: "/assets/favicon/site.webmanifest" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/swiper/swiper-bundle.min.css",
    },
    { rel: "canonical", href: canonicalUrl },
  ],
  script: [
    { src: "https://unpkg.com/swiper/swiper-bundle.min.js", body: true },
    {
      src: "https://kit.fontawesome.com/960a8c2498.js",
      crossorigin: "anonymous",
    },
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "SiteSynth",
        alternateName: "SiteSynth - Strategic Design & Development",
        legalName: "SiteSynth Mayya Approsine Antwerp",
        description:
          "Strategic design and development company that bridges product, brand, and tech to create scalable digital solutions.",
        url: baseUrl,
        logo: `${baseUrl}/assets/logo.png`,
        image: `${baseUrl}/assets/shareimage.png`,
        sameAs: [
          "https://www.linkedin.com/company/sitesynth",
          "https://twitter.com/sitesynth",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "Oude Kerkstraat 14",
          addressLocality: "Puurs-Sint-Amands",
          postalCode: "2890",
          addressCountry: "BE",
        },
        vatID: "BE1022394648",
        additionalType: "https://schema.org/LocalBusiness",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          availableLanguage: ["English", "Dutch"],
        },
        founder: {
          "@type": "Person",
          name: "Mayya Aprosina",
        },
        location: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Oude Kerkstraat 14",
            addressLocality: "Puurs-Sint-Amands",
            postalCode: "2890",
            addressCountry: "BE",
          },
        },
        services: [
          "Brand-Driven Product Strategy",
          "UX & Design Systems",
          "Full-Stack Development",
          "AI-Powered Workflows",
        ],
      }),
    },
  ],
});
</script>
