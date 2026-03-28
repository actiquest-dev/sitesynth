import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

export const curatedReferenceEntrySchema = z.object({
  id: z.string().min(1),
  source_type: z.enum([
    'competitor_site',
    'product_reference',
    'visual_gallery',
    'client_provided',
    'internal_curated',
  ]),
  title: z.string().min(1),
  url: z.string().url(),
  domain: z.string().min(1),
  product_types: z.array(z.string()).min(1),
  surface_types: z.array(z.string()).min(1),
  platforms: z.array(z.string()).min(1),
  style_tags: z.array(z.string()).default([]),
  ux_tags: z.array(z.string()).default([]),
  market_tags: z.array(z.string()).default([]),
  quality_score: z.number().min(0).max(5),
  modernity_score: z.number().min(0).max(5),
  ux_quality_score: z.number().min(0).max(5),
  visual_quality_score: z.number().min(0).max(5),
  reference_value_score: z.number().min(0).max(5),
  good_for: z.array(z.string()).default([]),
  avoid_for: z.array(z.string()).default([]),
  notes: z.string().default(''),
  capture_targets: z.array(z.string()).default([]),
  selection_bias: z.enum(['visual_direction', 'ux_quality', 'market_fit', 'balanced']).default('balanced'),
})

export const curatedReferenceLibrarySchema = z.array(curatedReferenceEntrySchema)

export type CuratedReferenceEntry = z.infer<typeof curatedReferenceEntrySchema>

const seedPath = new URL('../data/curated-reference-library/seed.json', import.meta.url)

const loadBundledSeed = async () => {
  try {
    // Prefer bundled JSON when running in serverless environments
    const mod: any = await import('../data/curated-reference-library/seed.json', { assert: { type: 'json' } } as any)
    return mod?.default || mod
  } catch {
    return null
  }
}

const resolveSeedPath = async () => {
  try {
    await readFile(seedPath, 'utf8')
    return seedPath
  } catch {
    const moduleDir = path.dirname(fileURLToPath(import.meta.url))
    const candidates = [
      path.resolve(moduleDir, '../data/curated-reference-library/seed.json'),
      path.resolve(process.cwd(), 'server/data/curated-reference-library/seed.json'),
      path.resolve(process.cwd(), 'data/curated-reference-library/seed.json'),
    ]

    for (const candidate of candidates) {
      try {
        await readFile(candidate, 'utf8')
        return new URL(`file://${candidate}`)
      } catch {
        // try next
      }
    }

    return seedPath
  }
}

export async function loadCuratedReferenceLibrary() {
  try {
    const bundled = await loadBundledSeed()
    if (bundled) {
      return curatedReferenceLibrarySchema.parse(bundled)
    }

    const resolved = await resolveSeedPath()
    const raw = await readFile(resolved, 'utf8')
    return curatedReferenceLibrarySchema.parse(JSON.parse(raw))
  } catch (error) {
    console.warn('[curated-reference-library] seed.json not found, falling back to empty list', error)
    return curatedReferenceLibrarySchema.parse([])
  }
}

const PRIORITY_WEIGHTS = {
  market_fit:       { product: 0.8, surface: 0.5, market: 0.3, style: 0.05, quality: 0.2 },
  visual_direction: { product: 0.3, surface: 0.2, market: 0.1, style: 0.4,  quality: 0.5 },
  ux_quality:       { product: 0.4, surface: 0.4, market: 0.15, style: 0.1, quality: 0.4 },
  balanced:         { product: 0.5, surface: 0.35, market: 0.12, style: 0.08, quality: 0.3 },
} as const

export function scoreCuratedReference(params: {
  reference: CuratedReferenceEntry
  productType?: string | null
  surfaceType?: string | null
  marketTags?: string[]
  styleTags?: string[]
  excludeTags?: string[]
  scoringPriority?: string | null
}) {
  const { reference, productType, surfaceType } = params
  const marketTags = params.marketTags || []
  const styleTags = params.styleTags || []
  const excludeTags = params.excludeTags || []

  // Hard gate: exclude_tags match → skip entirely
  if (excludeTags.length > 0) {
    const refTags = [...reference.market_tags, ...reference.product_types].map(t => t.toLowerCase())
    if (excludeTags.some(t => refTags.includes(t.toLowerCase()))) return 0
  }

  // Hard gate: avoid_for match against product type
  if (productType && reference.avoid_for.some(a =>
    a.toLowerCase().includes(productType.toLowerCase())
  )) return 0

  const productHit = productType && reference.product_types.includes(productType) ? 1 : 0
  const surfaceHit = surfaceType && reference.surface_types.includes(surfaceType) ? 1 : 0
  const marketHits = marketTags.filter((tag) => reference.market_tags.includes(tag)).length
  const styleHits = styleTags.filter((tag) => reference.style_tags.includes(tag)).length

  // Require at least one relevance signal — pure quality alone is not enough
  if (productHit + surfaceHit + marketHits + styleHits === 0) return 0

  const w = PRIORITY_WEIGHTS[(params.scoringPriority as keyof typeof PRIORITY_WEIGHTS)] || PRIORITY_WEIGHTS.balanced

  const qualityBase =
    reference.reference_value_score * 0.3 +
    reference.ux_quality_score * 0.25 +
    reference.visual_quality_score * 0.2 +
    reference.modernity_score * 0.15 +
    reference.quality_score * 0.1

  return Number((qualityBase * w.quality + productHit * w.product + surfaceHit * w.surface + marketHits * w.market + styleHits * w.style).toFixed(2))
}

export async function selectCuratedReferenceShortlist(params: {
  productType?: string | null
  surfaceType?: string | null
  marketTags?: string[]
  styleTags?: string[]
  excludeTags?: string[]
  scoringPriority?: string | null
  limit?: number
}) {
  const limit = params.limit || 6
  const library = await loadCuratedReferenceLibrary()

  return library
    .map((reference) => ({
      reference,
      score: scoreCuratedReference({
        reference,
        productType: params.productType,
        surfaceType: params.surfaceType,
        marketTags: params.marketTags,
        styleTags: params.styleTags,
        excludeTags: params.excludeTags,
        scoringPriority: params.scoringPriority,
      }),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export const curatedReferenceSelectionRubric = {
  priorityOrder: [
    'client_provided',
    'competitor_site',
    'product_reference',
    'internal_curated',
    'visual_gallery',
  ],
  scoringDimensions: [
    'relevance_score',
    'ux_quality_score',
    'visual_quality_score',
    'modernity_score',
    'reference_value_score',
  ],
  trendGuardrails: [
    'Prefer references with clear hierarchy, strong spacing rhythm, and deliberate type systems.',
    'Avoid decorative showcase sites that cannot be decomposed into reusable product patterns.',
    'Do not over-index on glassmorphism, gradient noise, or motion-heavy hero treatments.',
    'Prefer references that demonstrate trust, conversion discipline, and real product structure.',
    'Use visual galleries for style direction only; use real products for IA, UX flows, and component behavior.',
  ],
} as const
