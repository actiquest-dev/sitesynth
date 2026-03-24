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

  const prompt = `
Build contract (JSON):
${JSON.stringify(job.build_contract || job.spec_snapshot?.build_contract || {}, null, 2)}

Design spec (JSON):
${JSON.stringify(job.spec_snapshot?.design_spec || job.spec_snapshot?.spec || job.spec_snapshot || {}, null, 2)}

Brief (markdown):
${job.spec_snapshot?.brief_markdown || ''}

Project context (brief JSON):
${JSON.stringify(job.spec_snapshot?.brief || {}, null, 2)}

Task:
Generate a polished, production-grade static site (HTML + CSS).
Use the design system and visual direction from the spec.
Return STRICT JSON with html and css strings only.
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
