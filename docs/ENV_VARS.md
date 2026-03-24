# Environment Variables — Complete Reference

## Vercel Deployment (sitesynth.com)

**Always set these on Vercel to avoid hardcoded domains:**

```bash
# ── Site Configuration ────────────────────────────────
SITE_URL=https://www.sitesynth.com
NUXT_PUBLIC_SITE_URL=https://www.sitesynth.com
PUBLIC_APP_URL=https://www.sitesynth.com
DEMO_BUILD_API_URL=https://www.sitesynth.com/api
```

**Why:**
- `SITE_URL` — used in `nuxt.config.js` for fallback, Figma redirects, and OAuth
- `NUXT_PUBLIC_SITE_URL` — exposed to client-side code for meta tags, sitemaps
- `PUBLIC_APP_URL` — alternative to `SITE_URL` (takes precedence)
- `DEMO_BUILD_API_URL` — used by Linux workers polling for demo build jobs

**Code locations that use these:**
- `server/utils/service-integrations.ts:getDefaultAppBaseUrl()` — reads `PUBLIC_APP_URL` → `SITE_URL` → fallback
- `nuxt.config.js:runtimeConfig.public.siteUrl` — reads `SITE_URL`
- `plugins/figma-builder/code.js` — currently hardcoded, should read env (see below)
- `workers/demo-builder.js:API_BASE` — reads `DEMO_BUILD_API_URL`

---

## Figma Plugin (hardcoded issue)

**Current code (bad):**
```typescript
const API_BASE = 'https://sitesynth-eight.vercel.app'
```

**Should be:**
The Figma plugin runs in Figma's context, not on Vercel. It can't directly access Vercel env vars.
Instead, the plugin reads the Figma file's `sharedPluginData` which is set by the server during Figma auth flow.

**Fix (future):**
1. During Figma OAuth callback, store the app URL in the Figma file as shared metadata
2. Plugin reads it from there instead of hardcoding
3. This makes the plugin domain-agnostic

---

## Linux Worker Environment (Oracle Server)

**Set on Linux server in `/etc/sitesynth/demo-builder.env`:**

```bash
DEMO_BUILD_API_URL=https://www.sitesynth.com/api
DEMO_BUILD_TOKEN=<secret_token>
DEMO_SITE_ROOT=/var/www/sitesynth/demo.sitesynth.com
DEMO_BUILD_EXECUTOR=cline      # future: 'plan' or 'cline'
CLINE_BIN=cline
CLINE_TIMEOUT_MS=1200000
```

---

## Supabase Configuration

```bash
SUPABASE_URL=https://wkxwjasgyulakiyclipb.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
```

---

## Auth & Payment Services

```bash
# Google OAuth (for login, Sheets API)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<secret>
GOOGLE_SHEETS_PRIVATE_KEY=<json-key>

# Stripe (payment)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Brevo (email)
BREVO_API_KEY=<your-api-key>
```

---

## AI & LLM Services

```bash
# Google Gemini (VoltAgent fallback, reference analysis, design spec)
GOOGLE_API_KEY=<your-api-key>

# Anthropic Claude (optional, for hybrid agents)
ANTHROPIC_API_KEY=<your-api-key>
```

---

## Reference Research Pipeline

```bash
REFERENCE_CAPTURE_SERVICE_URL=http://127.0.0.1:8890
REFERENCE_CAPTURE_TOKEN=<token>
REFERENCE_CAPTURE_STORAGE_ROOT=/home/ubuntu/design-references
REFERENCE_CAPTURE_PUBLIC_BASE_URL=https://mcp.sitesynth.com/design_references
CHROMIUM_PATH=/usr/bin/chromium-browser
```

---

## MCP Front Gateway (Oracle)

```bash
MCP_FRONT_ADDR=:8888
MCP_FRONT_BASE_URL=https://mcp.sitesynth.com
MCP_FRONT_LOG_LEVEL=info
FIGMA_MCP_URL=http://127.0.0.1:8888/figma/sse
FIGMA_MCP_ACCESS_TOKEN=<figma-oauth-token>
```

---

## Google Drive Integration

```bash
GOOGLE_DRIVE_CLIENT_ID=<from-service-account>
GOOGLE_DRIVE_CLIENT_EMAIL=<service-account-email>
GOOGLE_DRIVE_PRIVATE_KEY=<json-private-key>
```

---

## Summary: Why Env Vars Matter

| Scenario | Problem | Solution |
|----------|---------|----------|
| Deploy to new domain | Hardcoded URLs break | Set `SITE_URL` env var |
| Local dev vs Vercel | Different API endpoints | Read `PUBLIC_APP_URL` first, fallback to env |
| Worker polling | Wrong API target | Linux worker reads `DEMO_BUILD_API_URL` |
| Figma plugin domain | Can't access Vercel env | Plugin reads from Figma file metadata (future) |

All code should follow: **read env vars, use sensible fallbacks (or fail loud), never hardcode production domains**.
