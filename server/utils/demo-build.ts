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

export const buildDemoContract = (brief: any, slug: string) => {
  const references = brief?.reference_analysis || brief?.brief_data?.reference_analysis || null
  const designSpec = brief?.design_spec_json || null
  const projectName =
    brief?.brief_data?.project_name
    || brief?.brief_data?.project_title
    || brief?.brief_data?.brand_name
    || brief?.brief_data?.company_name
    || 'SiteSynth Demo'

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
