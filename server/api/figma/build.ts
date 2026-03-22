import { defineEventHandler, readBody } from 'h3'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { issueBuildToken } from '~~/server/utils/figma-build-token'
import { getAgent, getVoltAgentInstance } from '~~/server/voltagent'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    return { success: false, error: 'Unauthorized' }
  }

  const body = await readBody(event)
  const briefId = body?.briefId
  if (!briefId) {
    return { success: false, error: 'Brief ID is required' }
  }

  try {
    const db = useDatabaseClient()
    const { data: brief, error: briefError } = await db
      .from('briefs')
      .select('id, user_email, design_spec_json')
      .eq('id', briefId)
      .eq('user_email', userEmail)
      .maybeSingle()

    if (briefError) throw briefError
    if (!brief) return { success: false, error: 'Brief not found' }
    if (!brief.design_spec_json) {
      return { success: false, error: 'Design spec not found. Generate it first.' }
    }

    const buildPlanSchema = z.object({
      project_summary: z.string(),
      design_system: z.object({
        colors: z.array(z.string()),
        typography: z.array(z.string()),
        components: z.array(z.string()),
        tokens: z.object({
          brand_primary: z.string(),
          brand_secondary: z.string(),
          background: z.string(),
          surface: z.string(),
          text_primary: z.string(),
          text_secondary: z.string(),
          accent: z.string(),
        }),
        spacing: z.array(z.string()),
      }),
      wireframes: z.array(z.object({
        name: z.string(),
        frames: z.array(z.string()),
        key_flows: z.array(z.string()),
      })),
      mockups: z.array(z.object({
        name: z.string(),
        frames: z.array(z.string()),
        visual_notes: z.array(z.string()),
      })),
      page_map: z.array(z.object({
        page: z.string(),
        sections: z.array(z.string()),
        critical_components: z.array(z.string()),
      })),
      commands: z.array(z.object({
        op: z.enum([
          'create_page',
          'create_frame',
          'create_text',
          'set_fill',
          'set_stroke',
          'set_radius',
          'resize',
          'move',
          'set_text',
          'set_font_size',
            'set_autolayout',
            'set_padding',
            'set_spacing',
            'set_alignment',
            'set_text_style',
            'create_component',
            'create_component_set',
            'set_variant_props',
            'set_image_fill',
            'insert_svg'
          ]),
        name: z.string(),
        parent: z.string().optional(),
        props: z.record(z.string(), z.any()).optional(),
      })),
      layout_rules: z.array(z.string()),
      handoff_notes: z.array(z.string()),
    })

    const commandTemplates = [
      { op: 'create_page', name: 'Design System' },
      { op: 'create_page', name: 'Wireframes' },
      { op: 'create_page', name: 'Mockups' },
      { op: 'create_frame', name: 'DS/Color Tokens', parent: 'Design System', props: { x: 40, y: 80, width: 1120, height: 300 } },
      { op: 'create_frame', name: 'DS/Components', parent: 'Design System', props: { x: 40, y: 420, width: 1120, height: 300 } },
      { op: 'create_component_set', name: 'Button/Variants', parent: 'DS/Components', props: { x: 24, y: 24 } },
      { op: 'create_component', name: 'Button/Primary', parent: 'Button/Variants', props: { x: 0, y: 0, width: 160, height: 44 } },
      { op: 'set_variant_props', name: 'Button/Primary', props: { Variant: 'Primary' } },
      { op: 'create_component', name: 'Button/Secondary', parent: 'Button/Variants', props: { x: 180, y: 0, width: 160, height: 44 } },
      { op: 'set_variant_props', name: 'Button/Secondary', props: { Variant: 'Secondary' } },
      { op: 'insert_svg', name: 'Icon/Plus', parent: 'DS/Components', props: { x: 24, y: 90, svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2V14M2 8H14" stroke="#9A9A9A" stroke-width="2" stroke-linecap="round"/></svg>' } }
    ]

    const agentPrompt = `
Design spec:
${JSON.stringify(brief.design_spec_json, null, 2)}

Command templates (extend/modify, keep names stable):
${JSON.stringify(commandTemplates, null, 2)}
    `.trim()

    const registry = getVoltAgentInstance()
    const figmaBuilderAgent = getAgent('figmaBuilderAgent')
    if (!figmaBuilderAgent || typeof (figmaBuilderAgent as any).generateObject !== 'function') {
      const available = registry?.agents ? Object.keys(registry.agents).join(', ') : 'none'
      throw new Error(`Figma builder agent is unavailable (available: ${available})`)
    }

    const agentResult = await figmaBuilderAgent.generateObject(
      agentPrompt,
      z.object({
        plan: buildPlanSchema,
      })
    )

    const candidatePlan = agentResult?.object?.plan || null
    const validatePlan = (plan: any) => {
      try {
        buildPlanSchema.parse(plan)
      } catch (validationError: any) {
        return {
          valid: false,
          reason: validationError?.issues?.[0]?.message || validationError?.message || 'Schema validation failed',
        }
      }
      const hasComponents = Array.isArray(plan?.commands)
        && plan.commands.some((cmd: any) => cmd?.op === 'create_component')
      const hasComponentSet = Array.isArray(plan?.commands)
        && plan.commands.some((cmd: any) => cmd?.op === 'create_component_set')
      if (!hasComponents) {
        return { valid: false, reason: 'Missing create_component command' }
      }
      if (!hasComponentSet) {
        return { valid: false, reason: 'Missing create_component_set command' }
      }
      return { valid: true, reason: null }
    }

    const validation = validatePlan(candidatePlan)
    if (!validation.valid) {
      console.error('[FigmaBuild] Invalid agent plan:', {
        reason: validation.reason,
        agentOutput: agentResult?.object,
      })
      throw new Error(`Figma build plan failed validation: ${validation.reason}`)
    }

    const buildPlan = candidatePlan

    const { data: job, error: jobError } = await db
      .from('figma_build_jobs')
      .insert({
        brief_id: briefId,
        requested_by: userEmail,
        source: 'cabinet',
        spec_snapshot: {
          spec: brief.design_spec_json,
          build_plan: buildPlan,
        },
        status: 'queued',
      })
      .select('id, status, created_at')
      .single()

    if (jobError) throw jobError

    return {
      success: true,
      data: {
        jobId: job.id,
        status: job.status,
        createdAt: job.created_at,
        buildPlan,
        buildToken: issueBuildToken(job.id),
      },
    }
  } catch (error: any) {
    console.error('[FigmaBuild] Error:', error)
    return { success: false, error: error?.message || 'Failed to queue Figma build' }
  }
})
