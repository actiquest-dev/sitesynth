import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { getDemoBuildToken } from '~~/server/utils/demo-build-token'
import { getAgent, getVoltAgentInstance } from '~~/server/voltagent'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  if (token !== getDemoBuildToken()) {
    return { success: false, error: 'Unauthorized' }
  }

  const jobId = body?.jobId
  if (!jobId) return { success: false, error: 'Job ID is required' }

  const db = useDatabaseClient()
  const { data: job, error: jobError } = await db
    .from('demo_build_jobs')
    .select('id, slug, spec_snapshot, build_contract')
    .eq('id', jobId)
    .maybeSingle()

  if (jobError) return { success: false, error: 'Failed to load job' }
  if (!job) return { success: false, error: 'Job not found' }

  const buildSchema = z.object({
    title: z.string(),
    slug: z.string().optional(),
    html: z.string(),
    css: z.string(),
    notes: z.array(z.string()).optional(),
  })

  const artDirection = job.spec_snapshot?.art_direction || {}
  const buildContract = job.build_contract || job.spec_snapshot?.build_contract || {}

  const prompt = `
🎨 ART DIRECTION CONTRACT (ONLY source of truth for design implementation):
${JSON.stringify(artDirection, null, 2)}

🧱 BUILD ENVELOPE (non-design metadata only):
${JSON.stringify({
    project: buildContract?.project || {},
    implementation: buildContract?.implementation || {},
    rules: buildContract?.rules || [],
    assetManifest: buildContract?.assetManifest || {},
  }, null, 2)}

═══════════════════════════════════════════════════════════════════════════

🚀 TASK:
Generate a polished, production-grade static site (HTML + CSS).

MANDATORY RULES:
- Use the art direction contract as the single source of truth for layout, typography, copy, spacing, color, and component styling
- Do not invent a different visual direction from brief text or design spec fragments
- Use section_blueprints verbatim for section order, copy, and composition
- Use color_system exact values with no substitutions
- Use typography and spacing values exactly as provided
- Implement component_recipes if present
- Explicitly avoid every anti_pattern listed
- Use assetManifest if assets are provided

BUILD WITH:
- semantic HTML
- CSS custom properties derived from the art direction contract
- responsive layout driven by the provided section_blueprints and spacing values
- exact copy from the contract instead of generic marketing filler

Return STRICT JSON with title, slug, html, and css strings only.
  `.trim()

  const registry = getVoltAgentInstance()
  const demoBuilderAgent = getAgent('demoBuilderAgent')
  if (!demoBuilderAgent || typeof (demoBuilderAgent as any).generateObject !== 'function') {
    const available = registry?.agents ? Object.keys(registry.agents).join(', ') : 'none'
    return { success: false, error: `Demo builder agent is unavailable (available: ${available})` }
  }

  let output
  try {
    const result = await demoBuilderAgent.generateObject(prompt, buildSchema)
    output = result?.object || null
  } catch (error: any) {
    return { success: false, error: error?.message || 'Agent failed to generate' }
  }

  if (!output?.html || !output?.css) {
    return { success: false, error: 'Invalid output from agent' }
  }

  const finalOutput = {
    ...output,
    slug: job.slug,
  }

  await db.from('demo_build_events').insert({
    job_id: job.id,
    level: 'info',
    stage: 'plan',
    message: 'Generated demo build plan',
    payload: { hasCss: Boolean(finalOutput.css), hasHtml: Boolean(finalOutput.html) },
  })

  await db.from('demo_build_jobs').update({
    output: finalOutput,
    result_json: finalOutput,
    current_stage: 'plan',
    updated_at: new Date().toISOString(),
  }).eq('id', job.id)

  return {
    success: true,
    data: finalOutput,
  }
})
