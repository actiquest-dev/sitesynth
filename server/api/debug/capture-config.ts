import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
  const baseUrl =
    process.env.REFERENCE_CAPTURE_SERVICE_URL ||
    (isProd ? 'https://mcp.sitesynth.com/reference_capture' : 'http://127.0.0.1:8890')
  const tokenPresent = !!process.env.REFERENCE_CAPTURE_TOKEN

  return {
    ok: true,
    env: {
      node_env: process.env.NODE_ENV || null,
      vercel: !!process.env.VERCEL,
      commit_sha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_REF || null,
    },
    capture: {
      baseUrl,
      tokenPresent,
    },
  }
})
