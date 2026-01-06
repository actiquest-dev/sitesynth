<template>
  <Analytics />
  <NuxtPage />
</template>

<script setup>
import { useRoute } from "vue-router";
import { useHead, useRuntimeConfig } from "#imports";
import { computed } from "vue";
import { Analytics } from "@vercel/analytics/nuxt";
import "~/assets/style.scss";

const route = useRoute();
const config = useRuntimeConfig();
const baseUrl = config.public?.siteUrl;

// Use the canonical URL composable for consistency
const canonicalUrl = useCanonicalUrl();

useHead({
  // Default meta tags - pages can override specific ones
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { charset: "utf-8" },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "SiteSynth" },
    { name: "generator", content: "Nuxt 3" },

    // Default Open Graph - pages can override specific values
    { property: "og:site_name", content: "SiteSynth" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_US" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: `${baseUrl}/assets/shareimage.png` },
    { property: "og:image:alt", content: "SiteSynth - Share Image" },

    // Default Twitter Card - pages can override
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@sitesynth" },
    { name: "twitter:creator", content: "@sitesynth" },
    { name: "twitter:url", content: canonicalUrl },
    { name: "twitter:image", content: `${baseUrl}/assets/shareimage.png` },
    { name: "twitter:image:alt", content: "SiteSynth - Share Image" },
  ],
  link: [
    // Canonical URL (dynamically updated per route)
    { rel: "canonical", href: canonicalUrl },
    // {
    //   rel: "stylesheet",
    //   href: "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap",
    // },
  ],
  script: [
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
        // Use makesOffer with Offer->itemOffered(Service) to represent offered services correctly
        makesOffer: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Brand-Driven Product Strategy",
            },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "UX & Design Systems" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "Full-Stack Development" },
          },
          {
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: "AI-Powered Workflows" },
          },
        ],
      }),
    },
  ],
});
</script>
