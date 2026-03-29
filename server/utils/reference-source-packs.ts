import { z } from 'zod'

export const referenceSourcePackSchema = z.object({
  archetype: z.string(),
  clientUrlsFirst: z.boolean().default(true),
  queryPacks: z.array(z.string()).default([]),
  sourceMix: z.object({
    competitor_site: z.number().min(0).max(5),
    adjacent_product: z.number().min(0).max(5),
    visual_gallery: z.number().min(0).max(5),
    trend_source: z.number().min(0).max(5),
  }),
})

export type ReferenceSourcePack = z.infer<typeof referenceSourcePackSchema>

const PACKS: Record<string, ReferenceSourcePack> = {
  consumer_finance: referenceSourcePackSchema.parse({
    archetype: 'consumer_finance',
    clientUrlsFirst: true,
    queryPacks: [
      'consumer finance app ui patterns',
      'money management app design inspiration',
      'subscription cancellation flow product design',
      'budget app onboarding trust patterns',
    ],
    sourceMix: {
      competitor_site: 4,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  b2b_saas: referenceSourcePackSchema.parse({
    archetype: 'b2b_saas',
    clientUrlsFirst: true,
    queryPacks: [
      'b2b saas product design patterns',
      'workflow management web app ux',
      'enterprise dashboard interface design',
      'admin console product design inspiration',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  dashboard_analytics: referenceSourcePackSchema.parse({
    archetype: 'dashboard_analytics',
    clientUrlsFirst: true,
    queryPacks: [
      'analytics dashboard ux patterns',
      'product analytics interface design',
      'data platform dashboard inspiration',
      'reporting interface design',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  marketplace: referenceSourcePackSchema.parse({
    archetype: 'marketplace',
    clientUrlsFirst: true,
    queryPacks: [
      'marketplace interface design trust patterns',
      'listing browse search product ux',
      'platform onboarding conversion design',
      'transactional web app inspiration',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  mobile_app: referenceSourcePackSchema.parse({
    archetype: 'mobile_app',
    clientUrlsFirst: true,
    queryPacks: [
      'mobile app onboarding design inspiration',
      'ios app ux patterns',
      'mobile product interface design',
      'app trust and activation flow design',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  marketing_site: referenceSourcePackSchema.parse({
    archetype: 'marketing_site',
    clientUrlsFirst: true,
    queryPacks: [
      'conversion focused landing page design',
      'marketing website inspiration',
      'homepage hero and pricing design',
      'brand led product website',
    ],
    sourceMix: {
      competitor_site: 2,
      adjacent_product: 1,
      visual_gallery: 2,
      trend_source: 1,
    },
  }),
  internal_tool: referenceSourcePackSchema.parse({
    archetype: 'internal_tool',
    clientUrlsFirst: true,
    queryPacks: [
      'admin dashboard ux patterns',
      'internal tool interface design',
      'dense workflow software ui',
      'operations platform product design',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  content_platform: referenceSourcePackSchema.parse({
    archetype: 'content_platform',
    clientUrlsFirst: true,
    queryPacks: [
      'editorial web app design',
      'publishing platform ux patterns',
      'content management interface design',
      'media product inspiration',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
  other: referenceSourcePackSchema.parse({
    archetype: 'other',
    clientUrlsFirst: true,
    queryPacks: [
      'modern product interface design inspiration',
      'high quality web app ux patterns',
      'product design reference',
      'visual direction research',
    ],
    sourceMix: {
      competitor_site: 3,
      adjacent_product: 1,
      visual_gallery: 1,
      trend_source: 1,
    },
  }),
}

const urlPattern = /\bhttps?:\/\/[^\s)<>"']+/gi

export function extractClientUrls(markdownContent: string) {
  const matches = markdownContent.match(urlPattern) || []
  return Array.from(new Set(matches.map((url) => url.replace(/[.,]$/, ''))))
}

export function getReferenceSourcePack(archetype: string, fallback?: string[]): ReferenceSourcePack {
  const key = archetype in PACKS ? archetype : 'other'
  const pack = PACKS[key] || PACKS.other
  if (fallback && fallback.length > 0 && key === 'other') {
    return {
      ...pack,
      queryPacks: Array.from(new Set([...fallback, ...pack.queryPacks])),
    }
  }
  return pack
}

export async function loadRecentReferenceHistory(params: {
  db: any
  userEmail: string
  currentBriefId?: string
  limit?: number
}) {
  const limit = params.limit || 12
  const { data: briefs } = await params.db
    .from('briefs')
    .select('id, reference_analysis_json')
    .eq('user_email', params.userEmail)
    .order('updated_at', { ascending: false })
    .limit(limit * 2)

  const urls = new Set<string>()
  const domains = new Set<string>()

  for (const brief of (briefs || []) as Array<{ id: string; reference_analysis_json?: any }>) {
    if (!brief || brief.id === params.currentBriefId) continue
    const analysis = brief.reference_analysis_json || {}
    const shortlist = Array.isArray(analysis.curated_shortlist) ? analysis.curated_shortlist : []
    const references = Array.isArray(analysis.summary?.recommended_references) ? analysis.summary.recommended_references : []
    const assets = Array.isArray(analysis.assets) ? analysis.assets : []

    for (const item of [...shortlist, ...references, ...assets]) {
      const url = item?.url || item?.source_url || item?.public_url
      if (!url) continue
      urls.add(url)
      try {
        domains.add(new URL(url).hostname.replace(/^www\./, '').toLowerCase())
      } catch {
        // ignore invalid URLs
      }
    }
    if (urls.size >= limit) break
  }

  return { urls, domains }
}
