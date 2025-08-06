# 🎯 **Simplified SEO System - Template Guide**

## How it works:

### `app.vue` = Global Defaults

- Common meta tags that apply to ALL pages
- Default title, description, keywords
- Default Open Graph & Twitter settings
- All external scripts and global structured data

### Individual Pages = Only Override What's Unique

- Page-specific title, description, keywords
- Page-specific Open Graph images and URLs
- Page-specific structured data (if needed)

---

## 📝 **Template for Any New Page:**

```vue
<template>
  <!-- Your page content -->
</template>

<script setup>
// SEO - Only override what's unique to this page
useSeoMeta({
  // Page-specific title (follows the format: "Page Name - SiteSynth | Brief Description")
  title: "Service Name - SiteSynth | What This Page Does",

  // Page-specific description (150-160 characters)
  description:
    "Compelling description that explains what this page offers and includes target keywords naturally.",

  // Page-specific keywords (5-10 relevant keywords)
  keywords:
    "page specific, keywords, that relate, to this, content, target audience",

  // Open Graph - Only the unique values (others inherit from app.vue)
  ogTitle: "Shorter Social Media Title",
  ogDescription:
    "Social media optimized description (can be different from meta description)",
  ogImage: "https://synth-phi.vercel.app/assets/og-image-this-page.jpg",
  ogImageAlt: "Description of the social sharing image",
  ogUrl: "https://synth-phi.vercel.app/this-page-url",

  // Twitter - Only the unique values (others inherit from app.vue)
  twitterTitle: "Twitter optimized title",
  twitterDescription: "Twitter optimized description",
  twitterImage:
    "https://synth-phi.vercel.app/assets/twitter-card-this-page.jpg",

  // Page-specific canonical URL
  canonical: "https://synth-phi.vercel.app/this-page-url",
});

// Optional: Page-specific structured data (only if needed)
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage", // or "Service", "Product", etc.
        name: "Page Name",
        description: "Page description",
        url: "https://synth-phi.vercel.app/page-url",
      }),
    },
  ],
});
</script>
```

---

## 🚀 **Quick Examples:**

### Service Page:

```vue
useSeoMeta({ title: "Brand-Driven Product Strategy - SiteSynth | Align Product
with Brand Identity", description: "Strategic product development that aligns
with your brand's purpose and goals. We help companies bridge strategy, design,
and engineering.", keywords: "brand strategy, product strategy, strategic
design, brand alignment, product development", ogTitle: "Brand-Driven Product
Strategy - SiteSynth", ogDescription: "Strategic product development that aligns
with your brand's purpose and goals.", ogImage:
"https://synth-phi.vercel.app/assets/og-brand-strategy.jpg", ogUrl:
"https://synth-phi.vercel.app/brand-driven-product-strategy", canonical:
"https://synth-phi.vercel.app/brand-driven-product-strategy", })
```

### Product Page:

```vue
useSeoMeta({ title: "ScoreSynth - AI Music Composition Tool | SiteSynth
Product", description: "Transform piano sketches into full orchestrations in
minutes. AI-powered music composition tool for composers, educators, and
musicians.", keywords: "ai music composition, scoresynth, orchestration
software, music ai, composition tool, ai orchestration", ogTitle: "ScoreSynth -
AI-Powered Music Composition", ogDescription: "Transform piano sketches into
full orchestrations in minutes with AI.", ogImage:
"https://synth-phi.vercel.app/assets/og-scoresynth.jpg", ogUrl:
"https://synth-phi.vercel.app/scoresynth", canonical:
"https://synth-phi.vercel.app/scoresynth", })
```

---

## ✅ **What's Already Set Up Globally (in app.vue):**

- `og:site_name: "SiteSynth"`
- `og:type: "website"`
- `og:locale: "en_US"`
- `twitter:card: "summary_large_image"`
- `twitter:site: "@sitesynth"`
- `twitter:creator: "@sitesynth"`
- `robots: "index, follow"`
- **Organization structured data** - Company info, address, services, etc.
- Canonical URL system
- All external scripts and fonts

**Note:** The Organization schema is global, so individual pages don't need to duplicate it. Only add page-specific structured data if needed (like WebPage, Article, Product, etc.).

---

## 🎯 **Benefits of This System:**

1. **No Duplication** - Common settings are only in app.vue
2. **Easy Maintenance** - Update global settings in one place
3. **Clean Page Code** - Pages only contain what's unique
4. **Consistent Branding** - Global settings ensure consistency
5. **SEO Optimized** - Each page has unique, relevant meta data

---

## 📋 **Next Steps for Implementation:**

1. ✅ **app.vue** - Set up global defaults
2. ✅ **index.vue** - Homepage specific SEO
3. ✅ **about-us.vue** - About page specific SEO
4. 🔲 **Service pages** - Use template above
5. 🔲 **Product pages** - Use template above
6. 🔲 **Create social images** - og-image-\*.jpg files
7. 🔲 **Test with tools** - Facebook Debugger, Twitter Card Validator

This system makes SEO management much easier and ensures consistency across your entire site! 🚀
