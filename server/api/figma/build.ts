import { defineEventHandler, readBody } from 'h3'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { useDatabaseClient } from '~~/server/utils/supabase'

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

    const { object: buildPlan } = await generateObject({
      model: google('gemini-2.5-pro'),
      schema: z.object({
        project_summary: z.string(),
        design_system: z.object({
          colors: z.array(z.string()),
          typography: z.array(z.string()),
          components: z.array(z.string()),
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
        layout_rules: z.array(z.string()),
        handoff_notes: z.array(z.string()),
      }),
      prompt: `
You are preparing a precise Figma build plan for a design system, wireframes, and mockups.
Use the design spec below and expand it into a step-by-step build plan.
Be concrete: name pages, frames, component groups, and flows.

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
      },
    }
  } catch (error: any) {
    console.error('[FigmaBuild] Error:', error)
    return { success: false, error: 'Failed to queue Figma build' }
  }
})
