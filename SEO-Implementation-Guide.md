# SEO Implementation Guide for SiteSynth

## ✅ **What We've Set Up:**

### 1. **Global SEO (app.vue)**

- Default meta tags for all pages
- Canonical URLs that update per route
- Global structured data for the organization
- Default robots directive: `index, follow`

### 2. **Home Page SEO (index.vue)**

- Complete meta tags with title, description, keywords
- Open Graph tags for Facebook/LinkedIn sharing
- Twitter Card meta tags
- Structured data for Organization
- Custom robots directive to allow indexing

### 3. **About Page SEO (about-us.vue)**

- Page-specific meta tags
- Team-focused structured data
- About page specific Open Graph/Twitter tags

## 🎯 **How to Add SEO to Other Pages:**

### Template for any page:

```vue
<template>
  <!-- Your page content -->
</template>

<script setup>
// SEO Configuration
useSeoMeta({
  title: "Page Title - SiteSynth | Brief Description",
  description:
    "Compelling 150-160 character description that includes target keywords and explains the page value.",
  keywords: "relevant, keywords, for, this, specific, page",

  // Open Graph (Facebook, LinkedIn, WhatsApp, etc.)
  ogTitle: "Shorter, punchy title for social sharing",
  ogDescription:
    "Description optimized for social sharing (different from meta description if needed)",
  ogImage: "https://synth-phi.vercel.app/assets/og-image-specific-page.jpg",
  ogImageAlt: "Alt text for social sharing image",
  ogUrl: "https://synth-phi.vercel.app/page-url",
  ogType: "website", // or 'article' for blog posts

  // Twitter Card
  twitterCard: "summary_large_image",
  twitterTitle: "Twitter-optimized title",
  twitterDescription: "Twitter-optimized description",
  twitterImage: "https://synth-phi.vercel.app/assets/twitter-card-specific.jpg",

  // Page control
  robots: "index, follow", // or 'noindex, nofollow' for private pages
  canonical: "https://synth-phi.vercel.app/page-url",
});

// Optional: Page-specific structured data
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage", // or "Service", "Product", "Article", etc.
        name: "Page Name",
        description: "Page description",
        url: "https://synth-phi.vercel.app/page-url",
      }),
    },
  ],
});
</script>
```

## 📋 **Quick Implementation Checklist for Each Page:**

### Service Pages (brand-driven-product-strategy.vue, ux-and-design-system.vue, etc.):

```vue
useSeoMeta({ title: 'Service Name - SiteSynth | Brief Benefit Statement',
description: 'What this service does, who it's for, and the main benefit in
150-160 chars.', keywords: 'service-related, keywords, target, audience, needs',
ogTitle: 'Service Name - Strategic Design & Development', ogDescription: 'Social
media optimized description', ogImage:
'https://synth-phi.vercel.app/assets/og-service-specific.jpg', ogUrl:
'https://synth-phi.vercel.app/service-url', // Use "@type": "Service" in
structured data })
```

### Product Pages (scoresynth.vue):

```vue
useSeoMeta({ title: 'ScoreSynth - AI-Powered Music Composition | SiteSynth
Product', description: 'Transform piano sketches into full orchestrations in
minutes with ScoreSynth, our AI-powered music composition tool.', keywords: 'ai
music composition, scoresynth, orchestration software, music ai, composition
tool', // Use "@type": "SoftwareApplication" in structured data })
```

### Content Pages (careers.vue):

```vue
useSeoMeta({ title: 'Careers at SiteSynth - Join Our Strategic Design Team |
Belgium', description: 'Join SiteSynth\'s small but dedicated team of designers,
strategists, and developers. Remote-first opportunities in strategic design and
development.', keywords: 'sitesynth careers, design jobs belgium, remote design
jobs, strategic design careers', // Use "@type": "JobPosting" in structured data
for individual job listings })
```

## 🖼️ **Image Requirements:**

Create these social sharing images:

- **og-image-home.jpg** (1200x630px) - Homepage
- **og-image-about.jpg** (1200x630px) - About page
- **og-image-services.jpg** (1200x630px) - Services pages
- **twitter-card-\*.jpg** (1200x600px) - Twitter versions

## 🔍 **SEO Best Practices:**

### Title Tags:

- 50-60 characters max
- Include primary keyword
- Format: "Primary Keyword - SiteSynth | Secondary Benefit"

### Meta Descriptions:

- 150-160 characters max
- Include target keywords naturally
- Write compelling copy that encourages clicks
- Each page should have unique description

### Keywords:

- 5-10 relevant keywords per page
- Include primary and secondary keywords
- Don't keyword stuff

### Open Graph Images:

- 1200x630px for Facebook/LinkedIn
- 1200x600px for Twitter
- Include your logo and page-relevant imagery
- Keep text readable at small sizes

## 🚀 **Quick Pages to Prioritize:**

1. **All service pages** - These drive business
2. **ScoreSynth product page** - Unique value proposition
3. **Careers page** - Talent acquisition
4. **Contact/Get Started pages** - Conversion focused

Would you like me to implement SEO for any specific page next?
