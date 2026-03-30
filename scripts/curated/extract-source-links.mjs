#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'

const DEFAULT_SOURCES = [
  { id: 'awwwards', url: 'https://www.awwwards.com/websites/' },
  { id: 'landbook', url: 'https://land-book.com/' },
  { id: 'lapaninja', url: 'https://www.lapa.ninja/' },
  { id: 'cssdesignawards', url: 'https://www.cssdesignawards.com/websites/' },
]

const MAX_LINKS_PER_SOURCE = Number(process.env.CURATED_MAX_LINKS_PER_SOURCE || 200)

const SOCIAL_HOSTS = new Set([
  'facebook.com',
  'x.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'pinterest.com',
  'dribbble.com',
  'behance.net',
])

const EXTENSION_BLACKLIST = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.pdf', '.zip', '.xml', '.json',
])

function normalizeHost(host) {
  return host.replace(/^www\./i, '').toLowerCase()
}

function looksLikeAsset(url) {
  const pathname = new URL(url).pathname.toLowerCase()
  for (const ext of EXTENSION_BLACKLIST) {
    if (pathname.endsWith(ext)) return true
  }
  return false
}

function cleanupAnchorText(text) {
  return (text || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseAnchors(html, baseUrl) {
  const anchors = []
  const anchorRegex = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match
  while ((match = anchorRegex.exec(html)) !== null) {
    const href = match[1]
    const text = cleanupAnchorText(match[2])
    try {
      const absolute = new URL(href, baseUrl).toString()
      anchors.push({ href: absolute, text })
    } catch {
      // ignore invalid URLs
    }
  }
  return anchors
}

function buildCandidate(anchor, sourceHost) {
  const parsed = new URL(anchor.href)
  const host = normalizeHost(parsed.hostname)

  if (host === sourceHost) return null
  if (SOCIAL_HOSTS.has(host)) return null
  if (looksLikeAsset(anchor.href)) return null

  const pathParts = parsed.pathname.split('/').filter(Boolean)
  const nameGuess = anchor.text || pathParts[pathParts.length - 1] || host.split('.')[0]
  return {
    title: nameGuess.slice(0, 120),
    url: `${parsed.protocol}//${parsed.host}`,
    discovered_from: sourceHost,
    discovered_href: anchor.href,
  }
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; SiteSynthCuratedCrawler/1.0)',
      accept: 'text/html',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function run() {
  const outputFile = process.argv[2] || 'tmp/curated-source-candidates.json'
  const all = []
  const errors = []

  for (const source of DEFAULT_SOURCES) {
    try {
      const html = await fetchHtml(source.url)
      const sourceHost = normalizeHost(new URL(source.url).hostname)
      const anchors = parseAnchors(html, source.url)
      const seen = new Set()
      const picked = []

      for (const anchor of anchors) {
        const item = buildCandidate(anchor, sourceHost)
        if (!item) continue
        if (seen.has(item.url)) continue
        seen.add(item.url)
        picked.push({ ...item, source_id: source.id })
        if (picked.length >= MAX_LINKS_PER_SOURCE) break
      }

      all.push(...picked)
      console.log(`[${source.id}] ${picked.length} candidates`)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      errors.push({ source: source.id, url: source.url, error: message })
      console.warn(`[${source.id}] failed: ${message}`)
    }
  }

  await fs.mkdir(path.dirname(outputFile), { recursive: true })
  await fs.writeFile(
    outputFile,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        sources: DEFAULT_SOURCES,
        total_candidates: all.length,
        errors,
        candidates: all,
      },
      null,
      2
    ),
    'utf8'
  )

  console.log(`Saved ${all.length} candidates -> ${outputFile}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

