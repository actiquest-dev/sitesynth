import { Readable } from 'node:stream'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')
const GEMINI_MODELS = ['gemini-2.5-pro', 'gemini-pro-latest']

async function geminiJson<T>(prompt: string): Promise<T> {
  let lastError: any
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.5 },
      })
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
      const result = await model.generateContent({ contents: [{ role: 'user', parts }] })
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

const competitorSchema = z.object({
  product_type: z.string(),
  surface_type: z.string(),
  market_tags: z.array(z.string()).min(2).max(8),
  style_tags: z.array(z.string()).min(2).max(8),
  search_queries: z.array(z.string()).min(2).max(6),
  competitor_names: z.array(z.string()).min(3).max(8),
  rationale: z.string(),
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

function stripHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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

async function discoverReferences(markdownContent: string) {
  const object = await geminiJson<z.infer<typeof competitorSchema>>(`
You are identifying competitor product references for design research.

From the brief below:
- infer the product archetype,
- infer the main surface type,
- infer likely market tags (array of 2-8 strings),
- infer likely style tags (array of 2-8 strings),
- propose strong search queries (array of 2-6 strings),
- list likely competitors or adjacent products worth studying (array of 3-8 strings).

Return ONLY valid JSON matching this shape:
{
  "product_type": "string",
  "surface_type": "string",
  "market_tags": ["string"],
  "style_tags": ["string"],
  "search_queries": ["string"],
  "competitor_names": ["string"],
  "rationale": "string"
}

Brief:
${markdownContent}
  `.trim())

  const curatedShortlist = await selectCuratedReferenceShortlist({
    productType: object.product_type,
    surfaceType: object.surface_type,
    marketTags: object.market_tags,
    styleTags: object.style_tags,
    limit: 5,
  })

  const discovered = []
  for (const query of object.search_queries) {
    const urls = await searchDuckDuckGo(query)
    discovered.push(...urls.map((url) => ({ url, query, source: 'web_discovery' })))
  }

  const uniqueWeb = Array.from(new Map(discovered.map((item) => [item.url, item])).values()).slice(0, 8)
  const curatedUrls = curatedShortlist.map(({ reference, score }) => ({
    url: reference.url,
    query: 'curated_library',
    source: reference.source_type,
    curated_score: score,
    title: reference.title,
    capture_targets: reference.capture_targets,
    notes: reference.notes,
  }))

  const urls = Array.from(new Map([...curatedUrls, ...uniqueWeb].map((item) => [item.url, item])).values()).slice(0, 10)

  return {
    productType: object.product_type,
    surfaceType: object.surface_type,
    marketTags: object.market_tags,
    styleTags: object.style_tags,
    searchQueries: object.search_queries,
    competitorNames: object.competitor_names,
    rationale: object.rationale,
    curatedShortlist,
    urls,
  }
}

async function callCaptureService(params: {
  briefId: string
  competitor: string
  pages: Array<{ url: string; kind: string; label: string; viewport?: string }>
}) {
  const envBaseUrl = process.env.REFERENCE_CAPTURE_SERVICE_URL
  const token = process.env.REFERENCE_CAPTURE_TOKEN || ''
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
  const baseUrl = envBaseUrl || (isProd ? 'https://mcp.sitesynth.com/reference_capture' : 'http://127.0.0.1:8890')

  if (isProd && !token) {
    throw new Error(`Reference capture token missing (baseUrl=${baseUrl})`)
  }

  const response = await fetch(`${baseUrl}/capture`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(params),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(`Reference capture HTTP ${response.status} from ${baseUrl}`)
  }
  if (!data.success) {
    throw new Error(data.error ? `${data.error} (${baseUrl})` : `Reference capture failed (${baseUrl})`)
  }
  return data.data
}

async function uploadScreenshotToDrive(params: {
  userEmail: string
  briefId: string
  competitor: string
  asset: any
}) {
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
}

async function analyzeAsset(asset: any) {
  const imageResponse = await fetch(asset.publicUrl)
  const buffer = Buffer.from(await imageResponse.arrayBuffer())

  const text = await geminiText([
    {
      text: `Analyze this competitor screenshot for UI reference research.

Return compact structured prose with:
- page purpose
- section order
- navigation pattern
- card/layout pattern
- CTA treatment
- typography mood
- visual density
- notable strengths
- notable weaknesses`,
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
    `.trim()

  const object = await geminiJson<z.infer<typeof referenceSummarySchema>>(prompt)
  return referenceSummarySchema.parse(object)
}

export async function runReferenceAnalysisPipeline(params: {
  briefId: string
  userEmail: string
  markdownContent: string
}) {
  const { briefId, userEmail, markdownContent } = params
  const db = useDatabaseClient()
  const logs: Array<{ ts: string; level: 'info' | 'warn' | 'error'; message: string }> = []
  const persistLogs = async () => {
    await db
      .from('briefs')
      .update({
        reference_analysis_json: { logs },
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)
      .eq('user_email', userEmail)
  }
  const log = async (message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    logs.push({ ts: new Date().toISOString(), level, message })
    await persistLogs()
  }

  await db
    .from('briefs')
    .update({ reference_status: 'processing', updated_at: new Date().toISOString() })
    .eq('id', briefId)
    .eq('user_email', userEmail)

  await log('Starting reference discovery')
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL
  const captureBaseUrl = process.env.REFERENCE_CAPTURE_SERVICE_URL || (isProd ? 'https://mcp.sitesynth.com/reference_capture' : 'http://127.0.0.1:8890')
  const tokenPresent = !!process.env.REFERENCE_CAPTURE_TOKEN
  await log(`Capture service config: baseUrl=${captureBaseUrl} token=${tokenPresent ? 'present' : 'missing'}`)
  const discovered = await discoverReferences(markdownContent)
  await log(`Discovered ${discovered.urls.length} candidate URLs`)
  const candidatePages = discovered.urls.slice(0, 5)

  const capturedAssets = []
  for (const candidate of candidatePages) {
    const hostname = new URL(candidate.url).hostname.replace(/^www\./, '')
    const competitor = hostname.split('.')[0] || 'reference'
    const pageKinds = Array.isArray((candidate as any).capture_targets) && (candidate as any).capture_targets.length
      ? (candidate as any).capture_targets.slice(0, 3)
      : ['homepage']
    await log(`Requesting capture for ${candidate.url}`)
    try {
      const capture = await callCaptureService({
        briefId,
        competitor,
        pages: pageKinds.map((kind: string, index: number) => ({
          url: candidate.url,
          kind,
          label: index === 0 ? hostname : `${hostname}-${kind}`,
        })),
      })
      await log(`Captured ${capture.assets.length} screenshots for ${candidate.url}`)
      capturedAssets.push(...capture.assets.map((asset: any) => ({ ...asset, competitor, sourceType: (candidate as any).source || 'web_discovery' })))
    } catch (error: any) {
      await log(`Capture failed for ${candidate.url}: ${error?.message || 'unknown error'}`, 'warn')
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
    await log('No screenshots returned from capture service', 'error')
    throw new Error('Reference capture returned no screenshots')
  }

  const insertedAssets = []
  for (const asset of capturedAssets) {
    await log(`Uploading ${asset.fileName} to Drive`)
    const drive = await uploadScreenshotToDrive({
      userEmail,
      briefId,
      competitor: asset.competitor,
      asset,
    })
    await log(`Analyzing screenshot ${asset.fileName}`)
    const analysis = await analyzeAsset(asset)

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
  }

  const summary = await buildReferenceSummary(markdownContent, insertedAssets)
  await log('Reference summary generated')

  const referenceAnalysisPayload = {
    product_type: discovered.productType,
    surface_type: discovered.surfaceType,
    market_tags: discovered.marketTags,
    style_tags: discovered.styleTags,
    search_queries: discovered.searchQueries,
    competitor_names: discovered.competitorNames,
    rationale: discovered.rationale,
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

  return {
    discovered,
    assets: insertedAssets,
    summary,
  }
}
