import { Readable } from 'node:stream'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')
const GEMINI_MODELS = ['gemini-2.5-pro', 'gemini-pro-latest']
const DEFAULT_TIMEOUT_MS = 120000

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string) => {
  let timeoutId: NodeJS.Timeout
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timeoutId!)
  }
}

async function geminiJson<T>(prompt: string): Promise<T> {
  let lastError: any
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await withTimeout(model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.5 },
      }), DEFAULT_TIMEOUT_MS, `geminiJson(${modelName})`)
      return JSON.parse(result.response.text()) as T
    } catch (err: any) {
      console.warn(`[reference-research] ${modelName} failed:`, err?.message)
      lastError = err
    }
  }
  throw lastError
}

async function geminiText(parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }>): Promise<string> {
  let lastError: any
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await withTimeout(model.generateContent({ contents: [{ role: 'user', parts }] }), DEFAULT_TIMEOUT_MS, `geminiText(${modelName})`)
      return result.response.text()
    } catch (err: any) {
      console.warn(`[reference-research] ${modelName} failed:`, err?.message)
      lastError = err
    }
  }
  throw lastError
}
import { useDatabaseClient } from './supabase'
import { getDriveClient, getOrCreateChildFolder, getOrCreateUserRootFolder } from './google-drive'
import { selectCuratedReferenceShortlist } from './curated-reference-library'
import {
  briefSignalSchema,
  buildSearchQueryPack,
  buildSourceExclusionSet,
  diversifyCandidateWeights,
  inferCandidateQuotas,
} from './reference-source-enrichment'
import { extractClientUrls, getReferenceSourcePack, loadRecentReferenceHistory } from './reference-source-packs'
import { getAgent, generateWithFallback } from '../mastra'

const competitorSchema = z.object({
  product_type: z.string(),
  surface_type: z.string(),
  market_tags: z.array(z.string()).min(2).max(8),
  style_tags: z.array(z.string()).min(2).max(8),
  search_queries: z.array(z.string()).min(2).max(6),
  competitor_names: z.array(z.string()).min(3).max(8),
  competitor_urls: z.array(z.string()).min(3).max(8),
  rationale: z.string(),
  scoring_priority: z.enum(['market_fit', 'visual_direction', 'ux_quality', 'balanced']).default('balanced'),
  exclude_tags: z.array(z.string()).default([]),
})

const relevanceRankingSchema = z.object({
  ranked: z.array(z.object({
    url: z.string(),
    relevance_score: z.number().min(1).max(5),
    reason: z.string(),
  })),
})

const referenceSummarySchema = z.object({
  recommended_direction: z.string().default(''),
  style_keywords: z.array(z.string()).default([]),
  market_patterns: z.array(z.string()).default([]),
  opportunities_to_differentiate: z.array(z.string()).default([]),
  recommended_references: z.array(z.object({
    source_url: z.string().default(''),
    title: z.string().default(''),
    reason: z.string().default(''),
  })).default([]),
  do: z.array(z.string()).default([]),
  avoid: z.array(z.string()).default([]),
})

const REFERENCE_SECTION_START = '<!-- REFERENCE_ANALYSIS_START -->'
const REFERENCE_SECTION_END = '<!-- REFERENCE_ANALYSIS_END -->'

function escapeHtml(value: string) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function stripExistingReferenceSection(content: string) {
  if (!content) return ''
  const pattern = new RegExp(`${REFERENCE_SECTION_START}[\\s\\S]*?${REFERENCE_SECTION_END}`, 'g')
  return content.replace(pattern, '').trim()
}

function buildReferenceSectionHtml(summary: any, assets: any[]) {
  const shortlist = Array.isArray(summary?.recommended_references) ? summary.recommended_references : []
  const styleKeywords = Array.isArray(summary?.style_keywords) ? summary.style_keywords : []
  const doItems = Array.isArray(summary?.do) ? summary.do : []
  const avoidItems = Array.isArray(summary?.avoid) ? summary.avoid : []
  const screenshots = assets.slice(0, 6)

  const tagHtml = styleKeywords.length
    ? `<p><strong>Style Keywords:</strong> ${styleKeywords.map((item: string) => escapeHtml(item)).join(', ')}</p>`
    : ''

  const shortlistHtml = shortlist.length
    ? `<h3>Selected References</h3><ul>${shortlist.map((item: any) => `<li><a href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a> — ${escapeHtml(item.reason)}</li>`).join('')}</ul>`
    : ''

  const screenshotsHtml = screenshots.length
    ? `<h3>Reference Screenshots</h3><ul>${screenshots.map((asset: any) => `<li><a href="${escapeHtml(asset.public_url)}" target="_blank" rel="noopener">${escapeHtml(asset.title || asset.competitor || asset.source_url || 'Screenshot')}</a> (${escapeHtml(asset.page_kind || 'page')} · ${escapeHtml(asset.viewport || 'view')})</li>`).join('')}</ul>`
    : ''

  const doHtml = doItems.length
    ? `<h3>Recommended Visual Direction</h3><p>${escapeHtml(summary.recommended_direction || '')}</p>${tagHtml}<p><strong>Do:</strong></p><ul>${doItems.map((item: string) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : `<h3>Recommended Visual Direction</h3><p>${escapeHtml(summary.recommended_direction || '')}</p>${tagHtml}`

  const avoidHtml = avoidItems.length
    ? `<p><strong>Avoid:</strong></p><ul>${avoidItems.map((item: string) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''

  return `${REFERENCE_SECTION_START}
<section data-reference-analysis="true">
<h2>Competitive Landscape</h2>
${shortlistHtml}
${screenshotsHtml}
${doHtml}
${avoidHtml}
</section>
${REFERENCE_SECTION_END}`
}

function buildReferenceSectionMarkdown(summary: any, assets: any[]) {
  const shortlist = Array.isArray(summary?.recommended_references) ? summary.recommended_references : []
  const styleKeywords = Array.isArray(summary?.style_keywords) ? summary.style_keywords : []
  const doItems = Array.isArray(summary?.do) ? summary.do : []
  const avoidItems = Array.isArray(summary?.avoid) ? summary.avoid : []
  const screenshots = assets.slice(0, 6)
  const clean = [
    '## Competitive Landscape',
    '',
    '### Selected References',
    ...shortlist.map((item: any) => `- [${item.title}](${item.source_url}) — ${item.reason}`),
    '',
    '### Reference Screenshots',
    ...screenshots.map((asset: any) => `- [${asset.title || asset.competitor || asset.source_url || 'Screenshot'}](${asset.public_url}) (${asset.page_kind || 'page'} · ${asset.viewport || 'view'})`),
    '',
    '### Recommended Visual Direction',
    summary?.recommended_direction || '',
    '',
    ...(styleKeywords.length ? [`- Style keywords: ${styleKeywords.join(', ')}`] : []),
    ...(doItems.length ? ['', '### Do', ...doItems.map((item: string) => `- ${item}`)] : []),
    ...(avoidItems.length ? ['', '### Avoid', ...avoidItems.map((item: string) => `- ${item}`)] : []),
  ]
  return `${REFERENCE_SECTION_START}\n${clean.join('\n')}\n${REFERENCE_SECTION_END}`
}

function mergeReferenceSectionIntoBrief(content: string, summary: any, assets: any[]) {
  const clean = stripExistingReferenceSection(content || '')
  const section = clean.trim().startsWith('<')
    ? buildReferenceSectionHtml(summary, assets)
    : buildReferenceSectionMarkdown(summary, assets)
  return [clean, section].filter(Boolean).join('\n\n').trim()
}

async function searchDuckDuckGo(query: string) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; SiteSynthReferenceBot/1.0)',
    },
  })
  const html = await response.text()
  const matches = [...html.matchAll(/<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"/g)]
  const urls = matches
    .map((match) => match[1])
    .filter(Boolean)
    .map((href) => {
      try {
        const decoded = href.replace(/&amp;/g, '&')
        if (decoded.startsWith('//duckduckgo.com/l/?')) {
          const u = new URL(`https:${decoded}`)
          return u.searchParams.get('uddg') || ''
        }
        return decoded
      } catch {
        return ''
      }
    })
    .filter((href) => href.startsWith('http'))

  return Array.from(new Set(urls)).slice(0, 8)
}

async function discoverReferences(
  markdownContent: string,
  params?: { briefId?: string; userEmail?: string; referenceLinks?: string[] }
) {
  const briefSignalsRaw = await geminiJson<z.infer<typeof briefSignalSchema>>(`
You are extracting design-strategy signals from a project brief.

Return only JSON with:
{
  "product_archetype": "consumer_finance" | "b2b_saas" | "dashboard_analytics" | "marketplace" | "mobile_app" | "marketing_site" | "internal_tool" | "content_platform" | "other",
  "business_model": "string",
  "audience_summary": "string",
  "primary_job_to_be_done": "string",
  "product_stage": "idea" | "mvp" | "growth" | "mature" | "enterprise",
  "visual_direction": "trustworthy_minimal" | "premium_editorial" | "dense_product_led" | "bold_expressive" | "technical_enterprise" | "mobile_first" | "conversion_focused" | "mixed",
  "source_mix": {
    "competitor_site": 0-5,
    "adjacent_product": 0-5,
    "visual_gallery": 0-5,
    "trend_source": 0-5,
    "client_provided": 0-5
  },
  "source_priorities": ["string"],
  "source_exclusions": ["string"],
  "must_avoid_patterns": ["string"],
  "reference_angle": "string"
}

Brief:
${markdownContent}
  `.trim())
  const briefSignals = briefSignalSchema.parse(briefSignalsRaw)
  const sourcePack = getReferenceSourcePack(briefSignals.product_archetype, buildSearchQueryPack(briefSignals))
  const clientUrls = Array.from(new Set([
    ...extractClientUrls(markdownContent),
    ...((params?.referenceLinks || []).filter(Boolean)),
  ]))
  const db = useDatabaseClient()
  const recentHistory = params?.userEmail
    ? await loadRecentReferenceHistory({ db, userEmail: params.userEmail, currentBriefId: params.briefId, limit: 12 })
    : { urls: new Set<string>(), domains: new Set<string>() }
  const explicitReferenceMode = clientUrls.length >= 3

  const raw = await geminiJson<z.infer<typeof competitorSchema>>(`
You are identifying competitor product references for design research.

From the brief below:
- infer the product archetype,
- infer the main surface type,
- infer likely market tags (array of 2-8 strings),
- infer likely style tags (array of 2-8 strings),
- propose strong search queries (array of 2-6 strings),
- list likely competitors or adjacent products worth studying (array of 3-8 names),
- for each competitor, provide the REAL homepage URL (array of 3-8 URLs, same order as competitor_names),
- decide what matters most for reference selection: "market_fit", "visual_direction", "ux_quality", or "balanced",
- list tags that should EXCLUDE references (e.g. if the brief is B2B fintech, exclude "consumer", "travel", "gaming").

IMPORTANT: competitor_urls must be real, working homepage URLs (e.g. "https://www.rocketmoney.com").
Each URL must correspond to the competitor at the same index in competitor_names.

Return ONLY valid JSON matching this shape:
{
  "product_type": "string",
  "surface_type": "string",
  "market_tags": ["string"],
  "style_tags": ["string"],
  "search_queries": ["string"],
  "competitor_names": ["string"],
  "competitor_urls": ["string"],
  "rationale": "string",
  "scoring_priority": "market_fit" | "visual_direction" | "ux_quality" | "balanced",
  "exclude_tags": ["string"]
}

Brief:
${markdownContent}
  `.trim())
  const object = competitorSchema.parse(raw)
  const sourceExclusions = buildSourceExclusionSet(briefSignals)
  const searchQueries = Array.from(new Set([
    ...sourcePack.queryPacks,
    ...buildSearchQueryPack(briefSignals),
  ]))
  const quotas = inferCandidateQuotas({
    ...briefSignals,
    source_mix: {
      ...briefSignals.source_mix,
      ...sourcePack.sourceMix,
    },
  })
  const weights = diversifyCandidateWeights(briefSignals)

  const curatedShortlist = await selectCuratedReferenceShortlist({
    productType: object.product_type,
    surfaceType: object.surface_type,
    marketTags: object.market_tags,
    styleTags: object.style_tags,
    excludeTags: [...object.exclude_tags, ...Array.from(sourceExclusions), ...Array.from(recentHistory.domains)],
    scoringPriority: object.scoring_priority,
    limit: Math.max(8, quotas.competitor + quotas.visual + quotas.adjacent + quotas.trend),
  })

  const discovered = []
  const combinedQueries = explicitReferenceMode
    ? searchQueries.slice(0, 2)
    : Array.from(new Set([
        ...searchQueries,
        ...object.search_queries,
      ]))
  for (const query of combinedQueries) {
    const urls = await searchDuckDuckGo(query)
    discovered.push(...urls.map((url) => ({ url, query, source: 'web_discovery' })))
  }

  const uniqueWeb = Array.from(new Map(discovered.map((item) => [item.url, item])).values())
    .filter((item) => {
      try {
        const hostname = new URL(item.url).hostname.replace(/^www\./, '').toLowerCase()
        return !sourceExclusions.has(hostname) && !recentHistory.domains.has(hostname) && !recentHistory.urls.has(item.url)
      } catch {
        return true
      }
    })
    .slice(0, explicitReferenceMode ? 4 : 18)
  const curatedUrls = curatedShortlist.map(({ reference, score }) => ({
    url: reference.url,
    query: 'curated_library',
    source: reference.source_type,
    curated_score: score,
    title: reference.title,
    capture_targets: reference.capture_targets,
    notes: reference.notes,
  }))

  // Gemini competitor_urls as structured fallback (not hallucinated ranking — explicit discovery output)
  const geminiUrls = object.competitor_urls.map((url, i) => ({
    url,
    query: 'gemini_discovery',
    source: 'gemini_competitor',
    title: object.competitor_names[i] || '',
  }))

  const clientCandidates = clientUrls.map((url) => ({
    url,
    query: 'client_provided',
    source: 'client_provided',
    title: url,
  }))

  const allCandidates = [...clientCandidates, ...curatedUrls, ...uniqueWeb, ...geminiUrls]
  const dedupedCandidates = Array.from(new Map(allCandidates.map((item) => [item.url, item])).values())

  const sourceWeight = (item: any) => {
    if (item.source === 'competitor_site' || item.source === 'gemini_competitor') return weights.competitorWeight
    if (item.source === 'product_reference') return weights.adjacentWeight
    if (item.source === 'visual_gallery') return weights.visualWeight
    return weights.trendWeight
  }

  // Prefer a mixed portfolio: curated/competitor + web discovery + Gemini fallbacks
  const buckets = {
    competitor: dedupedCandidates.filter((item) => item.source === 'competitor_site' || item.source === 'gemini_competitor').sort((a, b) => sourceWeight(b) - sourceWeight(a)),
    adjacent: dedupedCandidates.filter((item) => item.source === 'product_reference').sort((a, b) => sourceWeight(b) - sourceWeight(a)),
    visual: dedupedCandidates.filter((item) => item.source === 'visual_gallery').sort((a, b) => sourceWeight(b) - sourceWeight(a)),
    trend: dedupedCandidates.filter((item) => item.source === 'web_discovery').sort((a, b) => sourceWeight(b) - sourceWeight(a)),
  }
  const candidatePriorityList = [
    ...clientCandidates,
    ...buckets.competitor.slice(0, explicitReferenceMode ? Math.max(clientCandidates.length, 6) : quotas.competitor),
    ...buckets.adjacent.slice(0, explicitReferenceMode ? 1 : quotas.adjacent),
    ...buckets.visual.slice(0, explicitReferenceMode ? 1 : quotas.visual),
    ...buckets.trend.slice(0, explicitReferenceMode ? 1 : quotas.trend),
    ...buckets.competitor.slice(explicitReferenceMode ? Math.max(clientCandidates.length, 6) : quotas.competitor),
    ...buckets.adjacent.slice(explicitReferenceMode ? 1 : quotas.adjacent),
    ...buckets.visual.slice(explicitReferenceMode ? 1 : quotas.visual),
    ...buckets.trend.slice(explicitReferenceMode ? 1 : quotas.trend),
  ]
  const dedupedByUrl = new Map(candidatePriorityList.map((item) => [item.url, item]))
  const urls = Array.from(dedupedByUrl.values()).slice(0, explicitReferenceMode ? Math.max(clientCandidates.length + 3, 12) : 20)

  return {
    productType: object.product_type,
    surfaceType: object.surface_type,
    marketTags: object.market_tags,
    styleTags: object.style_tags,
    searchQueries: object.search_queries,
    competitorNames: object.competitor_names,
    competitorUrls: object.competitor_urls,
    rationale: object.rationale,
    scoringPriority: object.scoring_priority,
    excludeTags: object.exclude_tags,
    briefSignals,
    sourcePack,
    explicitReferenceMode,
    clientUrls,
    sourceWeights: weights,
    recentHistory: {
      urls: Array.from(recentHistory.urls),
      domains: Array.from(recentHistory.domains),
    },
    curatedShortlist,
    urls,
  }
}

async function rankCandidatesByRelevance(
  candidates: Array<{ url: string; source?: string; title?: string; notes?: string }>,
  briefContext: { productType: string; surfaceType: string; marketTags: string[] },
  limit: number = 5
) {
  if (candidates.length === 0) return []

  const candidateList = candidates.map((c, i) =>
    `${i + 1}. ${c.url}${c.title ? ` (${c.title})` : ''}${c.notes ? ` — ${c.notes}` : ''}`
  ).join('\n')

  const result = await geminiJson<z.infer<typeof relevanceRankingSchema>>(`
You are selecting the most relevant competitor references for a design research project.

Project context:
- Product type: ${briefContext.productType}
- Surface type: ${briefContext.surfaceType}
- Market tags: ${briefContext.marketTags.join(', ')}

Candidate URLs:
${candidateList}

Rank each URL by relevance (1-5) to THIS specific project.
Only include URLs with relevance_score >= 3.
Explain in one sentence WHY each is useful for this project.
Return the top ${limit} most relevant.

Return JSON: { "ranked": [{ "url": "...", "relevance_score": 1-5, "reason": "..." }] }
  `.trim())

  const parsed = relevanceRankingSchema.parse(result)
  return parsed.ranked
    .filter(r => r.relevance_score >= 3)
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, limit)
}

async function callCaptureService(params: {
  briefId: string
  competitor: string
  pages: Array<{ url: string; kind: string; label: string; viewport?: string; waitFor?: string }>
}) {
  const envBaseUrl = process.env.REFERENCE_CAPTURE_SERVICE_URL
  const token = process.env.REFERENCE_CAPTURE_TOKEN || ''
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL || !!process.env.REFERENCE_WORKER_ID
  const baseUrl = envBaseUrl || (isProd ? 'https://mcp.sitesynth.com/reference_capture' : 'http://127.0.0.1:8890')

  if (isProd && !token) {
    throw new Error(`Reference capture token missing (baseUrl=${baseUrl})`)
  }

  const CAPTURE_TIMEOUT = 60000 // 60 seconds per capture attempt
  const maxAttempts = 2 // Reduced from 3 to avoid long waits
  let lastError: any
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), CAPTURE_TIMEOUT)
      const response = await fetch(`${baseUrl}/capture`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(`Reference capture HTTP ${response.status} from ${baseUrl}`)
      }
      if (!data.success) {
        throw new Error(data.error ? `${data.error} (${baseUrl})` : `Reference capture failed (${baseUrl})`)
      }
      return data.data
    } catch (err: any) {
      lastError = err
      const isTimeout = err.name === 'AbortError' || err.message?.includes('timed out') || err.message?.includes('timeout')
      if (isTimeout && attempt === 1) {
        // On first timeout, skip retry to avoid long waits - move to next URL
        throw new Error(`Capture timeout (${CAPTURE_TIMEOUT}ms) - skipping URL`)
      }
      if (attempt < maxAttempts && !isTimeout) {
        await sleep(1000 * attempt)
        continue
      }
    }
  }
  throw lastError
}

async function uploadScreenshotToDrive(params: {
  userEmail: string
  briefId: string
  competitor: string
  asset: any
}): Promise<{ driveFileId: string | null; driveUrl: string | null }> {
  try {
    const driveClient = await getDriveClient()
    const userRoot = await getOrCreateUserRootFolder(params.userEmail, driveClient)
    const briefFolder = await getOrCreateChildFolder({
      driveClient,
      parentId: userRoot,
      folderName: `Brief_${params.briefId}`,
    })
    const refFolder = await getOrCreateChildFolder({
      driveClient,
      parentId: briefFolder,
      folderName: 'Competitor_References',
    })
    const competitorFolder = await getOrCreateChildFolder({
      driveClient,
      parentId: refFolder,
      folderName: params.competitor,
    })

    const imageResponse = await fetch(params.asset.publicUrl)
    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const upload = await driveClient.files.create({
      requestBody: {
        name: params.asset.fileName,
        parents: [competitorFolder],
        mimeType: 'image/png',
      },
      media: {
        mimeType: 'image/png',
        body: Readable.from(buffer),
      },
      fields: 'id, webViewLink',
      supportsAllDrives: true,
    })

    return {
      driveFileId: upload.data.id || null,
      driveUrl: upload.data.webViewLink || null,
    }
  } catch (err: any) {
    console.warn('[drive-upload] skipped:', err?.message)
    return { driveFileId: null, driveUrl: null }
  }
}

async function analyzeAsset(asset: any, briefContext?: { productType: string; surfaceType: string; primaryGoal?: string }) {
  const imageResponse = await fetch(asset.publicUrl)
  const buffer = Buffer.from(await imageResponse.arrayBuffer())

  const contextLine = briefContext
    ? `You are analyzing a competitor screenshot for a ${briefContext.productType} (${briefContext.surfaceType}) project.${briefContext.primaryGoal ? ` Primary goal: ${briefContext.primaryGoal}.` : ''}
Focus on what is transferable to THIS project type. Ignore patterns irrelevant to ${briefContext.productType}.`
    : `Analyze this competitor screenshot for UI reference research.`

  const text = await geminiText([
    {
      text: `${contextLine}

Return compact structured prose with:
- page purpose
- section order and layout architecture
- navigation pattern
- card/layout pattern
- CTA treatment
- typography mood
- visual density
- transferable patterns for ${briefContext?.productType || 'this project'}
- what to avoid from this reference
- relevance score (1-5) for this specific project type`,
    },
    {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: 'image/png',
      },
    },
  ])

  return {
    summary: text,
  }
}

const referenceStrategistAgent = getAgent('referenceStrategistAgent')
const referenceStrategistAgentFallback = getAgent('referenceStrategistAgentFallback')

async function buildReferenceSummary(markdownContent: string, assets: any[]) {
  const context = assets.map((asset) => {
    const analysis = asset.analysis_json?.summary || ''
    return `URL: ${asset.source_url}
Title: ${asset.title || ''}
Viewport: ${asset.viewport || ''}
Analysis: ${analysis}`
  }).join('\n\n---\n\n')

  const prompt = `
You are SiteSynth's reference strategist.

Given the brief and competitor screenshots analysis, produce a structured visual direction recommendation.

Brief:
${markdownContent}

Reference analyses:
${context}

What matters:
- infer the actual product story from the brief
- separate UX / IA patterns from visual style
- call out the market position and design direction explicitly
- explain what should be copied, adapted, and avoided
    `.trim()

  const result = await generateWithFallback(
    referenceStrategistAgent,
    referenceStrategistAgentFallback,
    prompt
  )
  const rawText = typeof result === 'string'
    ? result
    : (result?.text || result?.response?.text || result?.content || '')

  const jsonText = rawText.trim().startsWith('{') ? rawText : rawText.replace(/^[\s\S]*?(\{[\s\S]*\})[\s\S]*$/, '$1')
  const object = JSON.parse(jsonText) as z.infer<typeof referenceSummarySchema>
  return referenceSummarySchema.parse(object)
}

export async function runReferenceAnalysisPipeline(params: {
  briefId: string
  userEmail: string
  markdownContent: string
  referenceLinks?: string[]
}) {
  const { briefId, userEmail, markdownContent, referenceLinks = [] } = params
  const db = useDatabaseClient()
  const logs: Array<{ ts: string; level: 'info' | 'warn' | 'error'; message: string; phase?: string; payload?: any }> = []
  const startedAt = Date.now()
  const mergeLogs = (existing: typeof logs, incoming: typeof logs) => {
    const seen = new Set<string>()
    const combined = [...existing, ...incoming]
    return combined.filter((entry) => {
      const key = `${entry.ts}|${entry.level}|${entry.message}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const persistLogs = async () => {
    try {
      const { data: brief } = await db
        .from('briefs')
        .select('reference_analysis_json')
        .eq('id', briefId)
        .eq('user_email', userEmail)
        .maybeSingle()
      const existingLogs = Array.isArray(brief?.reference_analysis_json?.logs)
        ? brief?.reference_analysis_json?.logs
        : []
      const mergedLogs = mergeLogs(existingLogs, logs)
      await db
        .from('briefs')
        .update({
          reference_analysis_json: { ...(brief?.reference_analysis_json || {}), logs: mergedLogs },
          updated_at: new Date().toISOString(),
        })
        .eq('id', briefId)
        .eq('user_email', userEmail)
    } catch (err: any) {
      console.warn('[reference-research] log persist failed:', err?.message || err)
    }
  }
  const log = async (
    message: string,
    level: 'info' | 'warn' | 'error' = 'info',
    meta?: { phase?: string; payload?: any }
  ) => {
    logs.push({ ts: new Date().toISOString(), level, message, ...(meta?.phase ? { phase: meta.phase } : {}), ...(meta?.payload ? { payload: meta.payload } : {}) })
    await persistLogs()
  }

  await log('Reference analysis started', 'info', { phase: 'discovery' })
  await db
    .from('briefs')
    .update({ reference_status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', briefId)
    .eq('user_email', userEmail)

  await log('Starting reference discovery', 'info', { phase: 'discovery' })
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL || !!process.env.REFERENCE_WORKER_ID
  const captureBaseUrl = process.env.REFERENCE_CAPTURE_SERVICE_URL || (isProd ? 'https://mcp.sitesynth.com/reference_capture' : 'http://127.0.0.1:8890')
  const tokenPresent = !!process.env.REFERENCE_CAPTURE_TOKEN
  await log(`Capture service config: baseUrl=${captureBaseUrl} token=${tokenPresent ? 'present' : 'missing'}`, 'info', {
    phase: 'discovery',
    payload: { baseUrl: captureBaseUrl, tokenPresent },
  })
  // Load already-captured source URLs for this brief to avoid duplicates on re-run
  const { data: existingAssets } = await db
    .from('brief_reference_assets')
    .select('source_url')
    .eq('brief_id', briefId)
    .eq('user_email', userEmail)
  const alreadyCapturedUrls = new Set(
    (existingAssets || []).map((a: any) => {
      try { return new URL(a.source_url).hostname.replace(/^www\./, '') } catch { return a.source_url }
    }).filter(Boolean)
  )

  const discovered = await discoverReferences(markdownContent, { briefId, userEmail, referenceLinks })

  // Filter out already-captured domains so re-runs discover fresh references
  const freshCandidates = alreadyCapturedUrls.size > 0
    ? discovered.urls.filter((c) => {
        if ((c as any).source === 'client_provided') return true
        try {
          const hostname = new URL(c.url).hostname.replace(/^www\./, '')
          return !alreadyCapturedUrls.has(hostname)
        } catch { return true }
      })
    : discovered.urls

  const candidatePool = freshCandidates.length >= 3 ? freshCandidates : discovered.urls

  await log(`Discovered ${discovered.urls.length} candidate URLs (priority=${discovered.scoringPriority}, exclude=${discovered.excludeTags.join(',') || 'none'}, skipped=${discovered.urls.length - candidatePool.length} already captured)`, 'info', {
    phase: 'discovery',
    payload: {
      candidates: candidatePool.length,
      curated: discovered.curatedShortlist?.length || 0,
      scoringPriority: discovered.scoringPriority,
      excludeTags: discovered.excludeTags,
      alreadyCaptured: alreadyCapturedUrls.size,
      archetype: discovered.briefSignals?.product_archetype || null,
      visualDirection: discovered.briefSignals?.visual_direction || null,
      sourcePack: discovered.sourcePack?.archetype || null,
      clientUrls: Array.isArray(discovered.recentHistory?.urls) ? discovered.recentHistory.urls.length : 0,
    },
  })

  const briefContext = {
    productType: discovered.productType,
    surfaceType: discovered.surfaceType,
    marketTags: discovered.marketTags,
  }

  const explicitClientCandidates = candidatePool.filter((c: any) => c.source === 'client_provided')
  const maxCandidates = discovered.explicitReferenceMode
    ? Math.min(Math.max(explicitClientCandidates.length, 5), 15)
    : 5

  await log(`Ranking ${candidatePool.length} candidates by relevance`, 'info', { phase: 'discovery' })
  const ranked = await rankCandidatesByRelevance(candidatePool, briefContext, maxCandidates)
  const rankedUrls = new Set(ranked.map(r => r.url))

  // Always keep client-provided URLs first when present.
  const candidatePages = [...explicitClientCandidates]
  for (const rankedItem of ranked) {
    const match = discovered.urls.find(c => c.url === rankedItem.url)
    if (!match) continue
    if (candidatePages.some((item) => item.url === match.url)) continue
    candidatePages.push(match)
    if (candidatePages.length >= maxCandidates) break
  }

  // If ranking filtered too aggressively, fall back to top candidates
  if (candidatePages.length < 3) {
    const fallbackCandidates = discovered.urls
      .filter(c => !rankedUrls.has(c.url))
      .slice(0, maxCandidates - candidatePages.length)
    candidatePages.push(...fallbackCandidates)
    await log(`Relevance filter too strict, added ${fallbackCandidates.length} fallback candidates`, 'warn', { phase: 'discovery' })
  }

  await log(`Selected ${candidatePages.length} capture candidates after relevance ranking`, 'info', {
    phase: 'capture',
    payload: {
      selected: candidatePages.length,
      ranked: ranked.map(r => ({ url: r.url, score: r.relevance_score, reason: r.reason })),
    },
  })

  const capturedAssets = []
  const failedUrls = new Map<string, string[]>()
  for (const candidate of candidatePages) {
    const hostname = new URL(candidate.url).hostname.replace(/^www\./, '')
    const competitor = hostname.split('.')[0] || 'reference'
    const pageKinds = Array.isArray((candidate as any).capture_targets) && (candidate as any).capture_targets.length
      ? (candidate as any).capture_targets.slice(0, 3)
      : ['homepage']

    await log(`Requesting capture for ${candidate.url} (kinds=${pageKinds.join(', ')})`, 'info', {
      phase: 'capture',
      payload: { url: candidate.url, kinds: pageKinds, competitor },
    })
    try {
      // Capture each page kind in both mobile and desktop viewports
      const viewports = [
        { width: 390, height: 844, name: 'mobile' },  // iPhone 14
        { width: 1440, height: 900, name: 'desktop' }, // Standard desktop
      ]

      const pages = pageKinds.flatMap((kind: string, index: number) =>
        viewports.map((viewport) => ({
          url: candidate.url,
          kind,
          label: index === 0 ? `${hostname}-${viewport.name}` : `${hostname}-${kind}-${viewport.name}`,
          viewport: `${viewport.width}x${viewport.height}`,
          waitFor: 'networkidle2', // Wait for page to fully load (max 2 concurrent requests)
        }))
      )

      const capture = await callCaptureService({
        briefId,
        competitor,
        pages,
      })
      await log(`Captured ${capture.assets.length} screenshots for ${candidate.url}`, 'info', {
        phase: 'capture',
        payload: { url: candidate.url, count: capture.assets.length },
      })
      capturedAssets.push(...capture.assets.map((asset: any) => ({ ...asset, competitor, sourceType: (candidate as any).source || 'web_discovery' })))
    } catch (error: any) {
      const errorMsg = error?.message || 'unknown error'
      failedUrls.set(candidate.url, [competitor, errorMsg])

      const isTimeoutError = errorMsg.includes('timeout') || errorMsg.includes('Timeout') || errorMsg.includes('AbortError')
      const logLevel = isTimeoutError ? 'warn' : 'warn'
      await log(`Capture failed for ${candidate.url}: ${errorMsg}`, logLevel, {
        phase: 'capture',
        payload: { url: candidate.url, error: errorMsg, timeout: isTimeoutError },
      })
    }
  }

  // Log summary of failed URLs
  if (failedUrls.size > 0) {
    const timeoutUrls = Array.from(failedUrls.entries())
      .filter(([_, [__, msg]]) => msg.includes('timeout') || msg.includes('Timeout'))
      .map(([url]) => url)

    if (timeoutUrls.length > 0) {
      await log(`${timeoutUrls.length} URL(s) skipped due to capture timeout`, 'info', {
        phase: 'capture',
        payload: { skipped_urls: timeoutUrls },
      })
    }
  }

  if (capturedAssets.length === 0) {
    await db
      .from('briefs')
      .update({
        reference_status: 'failed',
        reference_analysis_json: { logs },
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)
      .eq('user_email', userEmail)
    await log('No screenshots returned from capture service', 'error', { phase: 'capture' })
    throw new Error('Reference capture returned no screenshots')
  }

  await log(`Processing ${capturedAssets.length} captured assets`, 'info', {
    phase: 'upload',
    payload: { count: capturedAssets.length },
  })
  const insertedAssets: any[] = []
  const concurrencyLimit = 3
  const queue = [...capturedAssets]
  const workers: Promise<void>[] = []

  const processAsset = async (asset: any) => {
    try {
      // Drive upload always returns silently on failure — never throws
      const drive = await uploadScreenshotToDrive({
        userEmail,
        briefId,
        competitor: asset.competitor,
        asset,
      })
      if (drive.driveFileId) {
        await log(`Uploaded ${asset.fileName} to Drive`, 'info', {
          phase: 'upload',
          payload: { file: asset.fileName, competitor: asset.competitor },
        })
      }

      await log(`Analyzing screenshot ${asset.fileName}`, 'info', {
        phase: 'analyze',
        payload: { file: asset.fileName, competitor: asset.competitor },
      })
      const analysis = await analyzeAsset(asset, briefContext)

      const row = {
        brief_id: briefId,
        source_url: asset.sourceUrl,
        final_url: asset.finalUrl,
        competitor: asset.competitor,
        page_kind: asset.kind,
        viewport: asset.viewport,
        title: asset.title,
        public_url: asset.publicUrl,
        local_path: asset.fileName,
        drive_file_id: drive.driveFileId,
        drive_url: drive.driveUrl,
        analysis_json: {
          ...analysis,
          source_type: asset.sourceType || 'web_discovery',
        },
        selected: true,
        updated_at: new Date().toISOString(),
      }

      const { data } = await db
        .from('brief_reference_assets')
        .insert(row)
        .select('*')
        .single()

      insertedAssets.push(data || row)
      await log(`Stored asset ${asset.fileName} (drive=${drive.driveFileId ? 'ok' : 'skipped'})`, 'info', {
        phase: 'upload',
        payload: { file: asset.fileName, driveFileId: drive.driveFileId || null },
      })
    } catch (assetErr: any) {
      await log(`Skipped asset ${asset.fileName}: ${assetErr?.message}`, 'warn', {
        phase: 'upload',
        payload: { file: asset.fileName, error: assetErr?.message },
      })
    }
  }

  for (let i = 0; i < concurrencyLimit; i += 1) {
    workers.push((async () => {
      while (queue.length) {
        const asset = queue.shift()
        if (!asset) return
        await processAsset(asset)
      }
    })())
  }

  await Promise.all(workers)

  await log('Building reference summary', 'info', { phase: 'summary' })
  const summary = await buildReferenceSummary(markdownContent, insertedAssets)
  await log('Reference summary generated', 'info', { phase: 'summary' })

  const referenceAnalysisPayload = {
    product_type: discovered.productType,
    surface_type: discovered.surfaceType,
    market_tags: discovered.marketTags,
    style_tags: discovered.styleTags,
    search_queries: discovered.searchQueries,
    competitor_names: discovered.competitorNames,
    competitor_urls: discovered.competitorUrls,
    rationale: discovered.rationale,
    scoring_priority: discovered.scoringPriority,
    exclude_tags: discovered.excludeTags,
    brief_signals: discovered.briefSignals,
    source_pack: discovered.sourcePack,
    recent_history: discovered.recentHistory,
    curated_shortlist: discovered.curatedShortlist.map((entry: any) => ({
      id: entry.reference.id,
      title: entry.reference.title,
      url: entry.reference.url,
      source_type: entry.reference.source_type,
      score: entry.score,
      notes: entry.reference.notes,
    })),
    summary,
    logs,
  }

  const mergedBriefContent = mergeReferenceSectionIntoBrief(markdownContent, summary, insertedAssets)

  await db
    .from('briefs')
    .update({
      markdown_content: mergedBriefContent,
      reference_analysis_json: referenceAnalysisPayload,
      reference_status: 'completed',
      reference_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', briefId)
    .eq('user_email', userEmail)

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1)
  await log(`Reference analysis finished in ${elapsedSec}s`, 'info', { phase: 'summary', payload: { durationSec: Number(elapsedSec) } })
  return {
    discovered,
    assets: insertedAssets,
    summary,
  }
}
