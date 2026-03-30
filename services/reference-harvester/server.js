import http from 'node:http'

const HOST = process.env.REFERENCE_HARVESTER_HOST || '127.0.0.1'
const PORT = Number(process.env.REFERENCE_HARVESTER_PORT || 8891)
const TOKEN = process.env.REFERENCE_HARVESTER_TOKEN || ''
const DEFAULT_SOURCES = [
  'https://www.awwwards.com/websites/',
  'https://land-book.com/',
  'https://www.lapa.ninja/',
  'https://www.cssdesignawards.com/websites/',
]

const SOCIAL_HOSTS = new Set([
  'facebook.com', 'x.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'tiktok.com',
])

const ok = (res, payload) => {
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(payload))
}

const fail = (res, code, message) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify({ success: false, error: message }))
}

const authorized = (req) => {
  if (!TOKEN) return true
  return req.headers.authorization === `Bearer ${TOKEN}`
}

const parseBody = async (req) => {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

const cleanText = (value) => String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const normalizeHost = (host) => host.replace(/^www\./i, '').toLowerCase()
const looksBadBrand = (name) => {
  if (!name) return true
  if (name.length < 2 || name.length > 80) return true
  if (/visit-count|count\"|<|>|#|\{|\}/i.test(name)) return true
  return false
}

const parseAnchors = (html, baseUrl) => {
  const out = []
  const regex = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const href = new URL(match[1], baseUrl).toString()
      out.push({ href, text: cleanText(match[2]) })
    } catch {
      // ignore
    }
  }
  return out
}

const toCandidate = (sourceUrl, anchor) => {
  const sourceHost = normalizeHost(new URL(sourceUrl).hostname)
  const url = new URL(anchor.href)
  const host = normalizeHost(url.hostname)
  if (host === sourceHost) return null
  if (SOCIAL_HOSTS.has(host)) return null
  const hostBrand = host.split('.')[0]
  const candidateBrand = (anchor.text || '').replace(/\s+/g, ' ').trim()
  const brand = looksBadBrand(candidateBrand) ? hostBrand : candidateBrand
  return { brand, url: `${url.protocol}//${url.host}`, host, source: sourceHost }
}

const harvest = async (sources) => {
  const candidates = []
  const errors = []
  for (const source of sources) {
    try {
      const response = await fetch(source, {
        headers: { 'user-agent': 'Mozilla/5.0 (compatible; SiteSynthReferenceHarvester/1.0)' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const html = await response.text()
      const anchors = parseAnchors(html, source)
      for (const anchor of anchors) {
        const candidate = toCandidate(source, anchor)
        if (candidate) candidates.push(candidate)
      }
    } catch (err) {
      errors.push({ source, error: err instanceof Error ? err.message : String(err) })
    }
  }
  const byUrl = new Map()
  for (const c of candidates) if (!byUrl.has(c.url)) byUrl.set(c.url, c)
  return { total: byUrl.size, candidates: Array.from(byUrl.values()), errors }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return ok(res, { status: 'ok' })
  if (req.method !== 'POST' || req.url !== '/harvest') return fail(res, 404, 'Not found')
  if (!authorized(req)) return fail(res, 401, 'Unauthorized')

  try {
    const body = await parseBody(req)
    const sources = Array.isArray(body.sources) && body.sources.length ? body.sources : DEFAULT_SOURCES
    const result = await harvest(sources)
    return ok(res, { success: true, ...result })
  } catch (err) {
    return fail(res, 500, err instanceof Error ? err.message : String(err))
  }
})

server.listen(PORT, HOST, () => {
  console.log(`[reference-harvester] listening on http://${HOST}:${PORT}`)
})
