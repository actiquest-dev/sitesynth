const slugifyValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60) || 'demo-site'

export const getDemoBaseUrl = () =>
  process.env.DEMO_SITE_BASE_URL || 'https://demo.sitesynth.com'

export const DEMO_DESIGN_ANTI_PATTERNS = [
  'Do not use lorem ipsum or generic filler copy unless explicitly requested in the brief',
  'Do not invent colors outside the provided color system',
  'Do not ignore section order or section composition from section_blueprints',
  'Do not use default browser typography stacks as a final design choice',
  'Do not ship low-contrast text/background combinations',
  'Do not produce placeholder-looking card grids with repetitive generic copy',
  'Do not add decorative gradients that conflict with the art direction',
]

export const DEMO_VERIFICATION_GATES = [
  'Every section uses exact copy and hierarchy from section_blueprints',
  'Colors, spacing, and typography map directly to contract tokens',
  'Primary mobile interactions meet a minimum 44px hit target',
  'No overflow clipping for primary heading and call-to-action blocks',
  'Desktop and mobile layouts are both intentional, not auto-collapsed variants',
]

export const buildDemoSlug = (projectName: string, briefId: string) =>
  slugifyValue(`${projectName}-${briefId.slice(0, 6)}`)

export const buildDemoWorkspacePath = (slug: string) =>
  `/var/www/sitesynth/demo.sitesynth.com/${slug}`

export const buildDemoTargetUrl = (slug: string) =>
  `${getDemoBaseUrl().replace(/\/+$/, '')}/${slug}/`

export const normalizeJobStatus = (status?: string | null) => {
  const value = String(status || '').trim().toLowerCase()
  if (!value) return 'queued'
  const aliases: Record<string, string> = {
    in_progress: 'running',
    complete: 'published',
    completed: 'published',
  }
  return aliases[value] || value
}

const inferAssetRequirements = (brief: any, designSpec: any, projectName: string) => {
  const existing = Array.isArray(designSpec?.asset_requirements)
    ? designSpec.asset_requirements
    : []

  if (existing.length > 0) {
    return existing
  }

  const productType =
    brief?.brief_data?.project_type
    || brief?.brief_data?.product_type
    || brief?.brief_data?.company_type
    || 'digital product'

  return [
    {
      id: 'hero_primary',
      kind: 'generated_image',
      purpose: 'Primary hero visual for the landing section',
      aspect_ratio: '4:3',
      min_width: 1600,
      model: 'nano-banana-pro-preview', // Google image generation model (supports image generation despite name)
      style_prompt: `Editorial product hero image for ${projectName}, a ${productType}. High-end web design aesthetic, strong composition, clean background, premium lighting, detailed UI-inspired forms, modern brand campaign quality.`,
      alt: `${projectName} hero visual`,
      output_path: 'assets/hero-primary.webp',
    },
    {
      id: 'feature_visual_1',
      kind: 'generated_image',
      purpose: 'Supporting product/feature visual for a mid-page section',
      aspect_ratio: '1:1',
      min_width: 1200,
      model: 'nano-banana-pro-preview', // Google image generation model
      style_prompt: `Square feature illustration for ${projectName}. Modern product marketing image with clean geometry, interface motifs, soft depth, and premium editorial composition.`,
      alt: `${projectName} feature visual`,
      output_path: 'assets/feature-visual-1.webp',
    },
  ]
}

export const buildDemoContract = (brief: any, slug: string) => {
  const references = brief?.reference_analysis || brief?.brief_data?.reference_analysis || null
  const rawDesignSpec = brief?.design_spec_json || {}
  const projectName =
    brief?.brief_data?.project_name
    || brief?.brief_data?.project_title
    || brief?.brief_data?.brand_name
    || brief?.brief_data?.company_name
    || 'SiteSynth Demo'
  const assetRequirements = inferAssetRequirements(brief, rawDesignSpec, projectName)
  const designSpec = {
    ...rawDesignSpec,
    asset_requirements: assetRequirements,
  }

  return {
    project: {
      name: projectName,
      slug,
      briefId: brief?.id,
      targetUrl: buildDemoTargetUrl(slug),
      workspacePath: buildDemoWorkspacePath(slug),
    },
    brief: brief?.brief_data || {},
    briefMarkdown: brief?.markdown_content || '',
    referenceReport: references,
    designContract: designSpec,
    assetManifest: brief?.asset_manifest || null,
    implementation: {
      framework: 'static-html',
      outputMode: 'html-css',
      workspacePath: buildDemoWorkspacePath(slug),
      targetUrl: buildDemoTargetUrl(slug),
    },
    executor: {
      builder: {
        tool: 'cline',
        provider: 'claude',
        model: 'claude',
        mode: 'act',
      },
      critic: {
        enabled: true,
        mode: 'critique-and-fix',
        maxIterations: 2,
        passThreshold: 4.2,
      },
      assetGeneration: {
        enabled: assetRequirements.length > 0,
        provider: 'google',
        model: 'nano-banana-pro-preview',
      },
    },
    rules: [
      'Responsive first',
      'Use semantic HTML',
      'Use provided design tokens exactly',
      'No lorem ipsum unless explicitly present in the brief',
      'Prefer production-grade layout and spacing over generic templates',
      ...DEMO_DESIGN_ANTI_PATTERNS.map((item) => `Avoid: ${item}`),
    ],
    antiPatterns: DEMO_DESIGN_ANTI_PATTERNS,
    qualityGates: DEMO_VERIFICATION_GATES,
  }
}

export const summarizeDemoContract = (contract: any) => {
  const designContract = contract?.designContract || {}
  const references = contract?.referenceReport || {}
  return {
    project: contract?.project?.name || null,
    slug: contract?.project?.slug || null,
    targetUrl: contract?.project?.targetUrl || null,
    workspacePath: contract?.project?.workspacePath || null,
    hasReferenceReport: Boolean(references),
    shortlistedReferences: Array.isArray(references?.shortlist) ? references.shortlist.length : 0,
    designPages: Array.isArray(designContract?.pages) ? designContract.pages.length : 0,
    components: Array.isArray(designContract?.components) ? designContract.components.length : 0,
    assetRequirements: Array.isArray(designContract?.asset_requirements) ? designContract.asset_requirements.length : 0,
  }
}
