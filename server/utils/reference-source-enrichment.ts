import { z } from 'zod'

export const briefSignalSchema = z.object({
  product_archetype: z.enum([
    'consumer_finance',
    'b2b_saas',
    'dashboard_analytics',
    'marketplace',
    'mobile_app',
    'marketing_site',
    'internal_tool',
    'content_platform',
    'other',
  ]),
  business_model: z.string(),
  audience_summary: z.string(),
  primary_job_to_be_done: z.string(),
  product_stage: z.enum(['idea', 'mvp', 'growth', 'mature', 'enterprise']),
  visual_direction: z.enum([
    'trustworthy_minimal',
    'premium_editorial',
    'dense_product_led',
    'bold_expressive',
    'technical_enterprise',
    'mobile_first',
    'conversion_focused',
    'mixed',
  ]),
  source_mix: z.object({
    competitor_site: z.number().min(0).max(5),
    adjacent_product: z.number().min(0).max(5),
    visual_gallery: z.number().min(0).max(5),
    trend_source: z.number().min(0).max(5),
    client_provided: z.number().min(0).max(5),
  }),
  source_priorities: z.array(z.string()).min(2).max(8),
  source_exclusions: z.array(z.string()).default([]),
  must_avoid_patterns: z.array(z.string()).default([]),
  reference_angle: z.string(),
})

export type BriefSignals = z.infer<typeof briefSignalSchema>

export function inferCandidateQuotas(signals: BriefSignals) {
  const competitor = Math.max(2, signals.source_mix.competitor_site || 0)
  const adjacent = Math.max(1, signals.source_mix.adjacent_product || 0)
  const visual = Math.max(1, signals.source_mix.visual_gallery || 0)
  const trend = Math.max(1, signals.source_mix.trend_source || 0)
  const client = Math.max(0, signals.source_mix.client_provided || 0)

  return {
    competitor,
    adjacent,
    visual,
    trend,
    client,
    total: competitor + adjacent + visual + trend + client,
  }
}

export function buildSearchQueryPack(signals: BriefSignals) {
  const archetypeMap: Record<string, string[]> = {
    consumer_finance: [
      'best consumer finance app design',
      'finance app dashboard onboarding trust ux',
      'money management app ui patterns',
      'subscription cancellation product design',
    ],
    b2b_saas: [
      'b2b saas dashboard ux design',
      'enterprise product interface patterns',
      'workflow management web app design',
      'admin console product design system',
    ],
    dashboard_analytics: [
      'analytics dashboard ux patterns',
      'data platform interface design',
      'product analytics dashboard ui',
      'reporting app interface design',
    ],
    marketplace: [
      'marketplace ux design homepage search listing',
      'transactional web app trust patterns',
      'platform product interface design',
      'search and browse product design',
    ],
    mobile_app: [
      'mobile app onboarding ux patterns',
      'ios app interface design trust patterns',
      'mobile product design inspiration',
      'mobile first product ui',
    ],
    marketing_site: [
      'marketing website design inspiration',
      'conversion focused landing page design',
      'brand led product marketing site',
      'homepage hero and pricing patterns',
    ],
    internal_tool: [
      'internal tool dashboard ux',
      'admin interface design patterns',
      'ops platform product design',
      'dense workflow software interface',
    ],
    content_platform: [
      'content platform product design',
      'editorial web app design',
      'publishing product interface patterns',
      'media platform dashboard design',
    ],
    other: [
      'modern product interface design inspiration',
      'high quality web app ux patterns',
      'digital product design reference',
      'product interface research',
    ],
  }

  const directionMap: Record<string, string[]> = {
    trustworthy_minimal: ['trustworthy minimalist product design', 'clear hierarchy fintech ux'],
    premium_editorial: ['premium editorial interface design', 'high end brand and product design'],
    dense_product_led: ['dense product led dashboard design', 'complex workflow interface patterns'],
    bold_expressive: ['bold expressive web product design', 'high contrast modern interface'],
    technical_enterprise: ['technical enterprise interface design', 'system heavy product ux'],
    mobile_first: ['mobile first product interface design', 'responsive app onboarding patterns'],
    conversion_focused: ['conversion focused landing page design', 'pricing and signup conversion ux'],
    mixed: ['balanced product and marketing design', 'modern product interface research'],
  }

  return Array.from(new Set([
    ...(archetypeMap[signals.product_archetype] || archetypeMap.other),
    ...(directionMap[signals.visual_direction] || directionMap.mixed),
    signals.primary_job_to_be_done,
    signals.audience_summary,
  ].flat().filter(Boolean))).slice(0, 8)
}

export function buildSourceExclusionSet(signals: BriefSignals) {
  return new Set([
    ...signals.source_exclusions.map((s) => s.toLowerCase()),
    ...(signals.must_avoid_patterns || []).map((s) => s.toLowerCase()),
  ])
}

export function diversifyCandidateWeights(signals: BriefSignals) {
  if (signals.visual_direction === 'premium_editorial') {
    return { competitorWeight: 3, adjacentWeight: 1, visualWeight: 3, trendWeight: 1 }
  }
  if (signals.product_archetype === 'consumer_finance') {
    return { competitorWeight: 4, adjacentWeight: 1, visualWeight: 1, trendWeight: 1 }
  }
  if (signals.product_archetype === 'marketing_site') {
    return { competitorWeight: 2, adjacentWeight: 1, visualWeight: 3, trendWeight: 2 }
  }
  return { competitorWeight: 3, adjacentWeight: 1, visualWeight: 2, trendWeight: 1 }
}
