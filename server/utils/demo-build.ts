const slugifyValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60) || 'demo-site'

export const getDemoBaseUrl = () =>
  process.env.DEMO_SITE_BASE_URL || 'https://demo.sitesynth.com'

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
      model: 'nano-banana-pro-preview',
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
      model: 'nano-banana-pro-preview',
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
        enabled: false,
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
    ],
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
