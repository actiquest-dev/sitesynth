import { defineEventHandler, readBody } from 'h3'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { issueBuildToken } from '~~/server/utils/figma-build-token'
import { figmaBuilderAgent } from '~~/server/agents'

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
          'set_text_style'
        ]),
        name: z.string(),
        parent: z.string().optional(),
        props: z.record(z.any()).optional(),
      })),
      layout_rules: z.array(z.string()),
      handoff_notes: z.array(z.string()),
    })

    const agentPrompt = `
Design spec:
${JSON.stringify(brief.design_spec_json, null, 2)}
    `.trim()

    const agentResponse = await figmaBuilderAgent.execute(agentPrompt)
    let parsedAgent: any = null
    try {
      parsedAgent = JSON.parse(String(agentResponse || '{}'))
    } catch {
      parsedAgent = null
    }

    const { object: buildPlan } = parsedAgent?.plan
      ? { object: parsedAgent.plan }
      : await generateObject({
        model: google('gemini-2.5-pro'),
        schema: buildPlanSchema,
        prompt: `
You are preparing a precise Figma build plan for a design system, wireframes, and mockups.
Use the design spec below and expand it into a step-by-step build plan.
Be concrete: name pages, frames, component groups, and flows.
Include a minimal Design System with color tokens and core components (buttons, inputs, cards, badges).
Also output a command list for the plugin to execute (create pages/frames/text and apply styles). 
Use stable node names and parent references by name.

Design spec:
${JSON.stringify(brief.design_spec_json, null, 2)}
        `.trim(),
      })

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
    return { success: false, error: 'Failed to queue Figma build' }
  }
})
