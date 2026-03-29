import { defineEventHandler, getQuery, setHeaders, createError } from 'h3'

/**
 * Proxy for reference screenshots stored on mcp.sitesynth.com.
 * Solves CORS: browser fetches from same Vercel domain, server fetches from mcp.
 *
 * Usage: /api/reference-image?url=https://mcp.sitesynth.com/design_references/...
 */
export default defineEventHandler(async (event) => {
  const { url } = getQuery(event) as { url?: string }

  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'Missing url parameter' })
  }

  // Only allow proxying from our own capture server
  const allowed = 'https://mcp.sitesynth.com/design_references/'
  if (!url.startsWith(allowed)) {
    throw createError({ statusCode: 403, message: 'URL not allowed' })
  }

  const upstream = await fetch(url)
  if (!upstream.ok) {
    throw createError({ statusCode: upstream.status, message: `Upstream ${upstream.status}` })
  }

  const contentType = upstream.headers.get('content-type') || 'image/png'
  const buf = Buffer.from(await upstream.arrayBuffer())

  setHeaders(event, {
    'content-type': contentType,
    'content-length': String(buf.length),
    'cache-control': 'public, max-age=31536000, immutable',
  })

  return buf
})
