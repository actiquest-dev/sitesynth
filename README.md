# SiteSynth — Strategic Design & Development

SiteSynth is a creative and technical studio that helps organizations align product, brand, and technology to build meaningful digital experiences. This website showcases the agency's services, portfolio, and selected products.

What you can find here:

- An overview of SiteSynth's services (strategy, UX & design systems, full‑stack development, AI innovation)
- Case studies and client work
- Information about the ScoreSynth product
- Career opportunities and contact details

Where it's hosted:

- Live site: https://www.sitesynth.com

If you want to learn more or get in touch, please visit the Contact page on the site.

This README is intended for non-technical visitors and does not include developer or deployment instructions.

Google presence

- Search property: `sitesynth` — site: `sitesynth.com` (Google Search Console property; sitemap submitted)

Key files (where to find them)

- SEO:

  - Sitemap: `public/sitemap.xml` (list of site pages for search engines)
  - Robots rules: `public/robots.txt` (crawling guidance)
  - Favicons and manifest: `public/assets/favicon/` and `public/favicon.ico` (site icons and web manifest)
  - SEO guidance document: `SEO-SETUP-GUIDE.md` (how the sitemap and search submission were configured)
  - Central SEO settings: `config/seo.ts` (text used across pages)

- Config & hosting:
  - Main site configuration: `nuxt.config.js` (site-wide settings)
  - Default head/meta used site-wide: `app.vue` (page defaults like title, meta, and favicon links)
  - Deployment headers: `vercel.json` and `public/_headers` (hosting header rules)

These paths point to key files used for SEO and site configuration. If you just want to view or confirm something, open the file at the path above in the project.

Project structure (brief, non-technical)

- `assets/` — Images, styles and other static design files used across the site (visuals, CSS, fonts).
- `components/` — Reusable page parts (headers, footers, carousels, UI widgets). Organized into subfolders like `effects/`, `hero/`, `layout/`, `sections/`, and `ui/`.
- `pages/` — The site's pages (homepage, about, contact, services, careers, product pages). Each file corresponds to a public page on the website.
- `layout/` — Page layout pieces such as main header and footer used across multiple pages.
- `public/` — Publicly served files (icons, manifest, `robots.txt`, `sitemap.xml`) that are accessible directly from the website.
- `plugins/` — Small integrations that run before the site loads (third-party helpers used by the site).
- `composables/` — Small reusable logic units used by pages/components (e.g., contact form helpers).
- `config/` — Central configuration values used across the site (for example `config/seo.ts` holds shared SEO text and settings).
- `server/` — Server-side utilities and simple API endpoints used by the site (contact forms and link sending services).
- `utils/` — General helper code and utilities used across the project.

Files you may notice (already mentioned above):

- `public/sitemap.xml` — Sitemap listing site pages for search engines.
- `public/robots.txt` — Crawling rules for search engines.
- `public/assets/favicon/` and `public/favicon.ico` — Site icons used in browsers and by search engines.
- `nuxt.config.js` and `app.vue` — High-level site settings and shared page defaults (meta, title, favicon links).
- `vercel.json` and `public/_headers` — Hosting and header rules for the live site.
- `SEO-SETUP-GUIDE.md` — A short document explaining the sitemap and SEO steps taken.

This overview is aimed at non-technical readers who want to know what lives in each folder and why it matters for the website's content and appearance.

favicon 🤟
