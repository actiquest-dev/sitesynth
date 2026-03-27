import { z } from 'zod'
import { geminiJson } from '~~/server/utils/gemini'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { runReferenceAnalysisPipeline } from '~~/server/utils/reference-research'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) return { success: false, error: 'Unauthorized' }

  const body = await readBody(event)
  const { briefId, markdownContent } = body

  if (!briefId || !markdownContent) {
    return { success: false, error: 'Brief ID and content required' }
  }

  try {
    const db = useDatabaseClient()
    const { data: brief } = await db
      .from('briefs')
      .select('id, reference_analysis_json, reference_status')
      .eq('id', briefId)
      .eq('user_email', userEmail)
      .maybeSingle()

    let referenceAnalysis = brief?.reference_analysis_json || null
    if (!referenceAnalysis) {
      const referenceResult = await runReferenceAnalysisPipeline({
        briefId,
        userEmail,
        markdownContent,
      })
      referenceAnalysis = {
        search_queries: referenceResult.discovered.searchQueries,
        competitor_names: referenceResult.discovered.competitorNames,
        rationale: referenceResult.discovered.rationale,
        summary: referenceResult.summary,
      }
    }

    // Generate a richer design spec so the result can directly guide wireframes and Figma production.
    const schema = z.object({
        product_summary: z.object({
          vision: z.string(),
          audience: z.string(),
          primary_goal: z.string(),
          experience_principles: z.array(z.string()).min(3).max(6),
        }),
        design_direction: z.object({
          visual_style: z.string(),
          interaction_style: z.string(),
          content_tone: z.string(),
        }),
        pages: z.array(z.object({
          title: z.string(),
          path: z.string(),
          purpose: z.string(),
          primary_user_goal: z.string(),
          success_criteria: z.array(z.string()),
          key_states: z.array(z.string()),
          content_requirements: z.array(z.string()),
          ui_blocks: z.array(z.object({
            type: z.string(),
            description: z.string(),
            content: z.array(z.string()),
            interactions: z.array(z.string()),
            states: z.array(z.string()),
          })),
          notes_for_figma: z.array(z.string()),
        })),
        theme: z.object({
          colors: z.object({
            primary: z.string(),
            secondary: z.string(),
            background: z.string(),
            surface: z.string(),
            accent: z.string(),
            text: z.string(),
          }),
          typography: z.object({
            heading: z.string(),
            body: z.string(),
            accent: z.string(),
          }),
          spacing: z.array(z.string()),
          components: z.array(z.string()),
        }),
        figma_structure: z.object({
          pages: z.array(z.object({
            name: z.string(),
            purpose: z.string(),
            contents: z.array(z.string()),
          })),
          handoff_notes: z.array(z.string()),
        }),
        open_questions: z.array(z.string()),
      })

    const { data: object, model } = await geminiJson<z.infer<typeof schema>>(`
You are converting a design brief into a production-grade design specification for UX/UI and Figma work.

Return a concrete, information-dense JSON object.

Rules:
- Be materially richer than the brief's outline.
- Infer the actual product structure, critical screens, states, and UI blocks needed to design the product.
- Do not stay generic. Avoid placeholders like "Hero", "Features", "CTA" unless the brief is explicitly marketing-site oriented.
- For application products, prefer real product surfaces: dashboard, onboarding, empty states, settings, detail views, management flows, search, filters, modals, alerts, etc.
- Every page must include purpose, user goal, success criteria, states, content requirements, and actionable Figma notes.
- Every ui_block must include content, interactions, and states.
- Figma structure must describe how the file should be organized for actual delivery.
- If the brief is missing specifics, make reasonable design assumptions grounded in the brief.
- Use the competitive landscape and visual direction analysis as mandatory input.

Brief:
${markdownContent}

Competitive interface analysis:
${JSON.stringify(referenceAnalysis, null, 2)}
      `.trim())

    const parsed = schema.safeParse(object)
    if (!parsed.success) {
      console.error('[DesignSpec] Schema validation failed', parsed.error)
      return {
        success: false,
        error: 'Failed to generate design spec',
        model,
      }
    }

    // Save/Update the spec in the database
    const { error } = await db
      .from('briefs')
      .update({ design_spec_json: parsed.data, updated_at: new Date().toISOString() })
      .eq('id', briefId)
      .eq('user_email', userEmail)

    if (error) throw error

    return { success: true, data: parsed.data, model }
  } catch (error) {
    console.error('[DesignSpec] Error:', error)
    return { success: false, error: 'Failed to generate design spec' }
  }
})
