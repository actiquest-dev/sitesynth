/**
 * Generate Art Direction Contract from Design Spec + Reference Analysis
 *
 * This bridges the gap between design spec (requirements) and implementation (art direction).
 * Art Direction Contract contains:
 * - Exact color hex values
 * - Specific font names and sizes using clamp()
 * - Exact copy for each section (headlines, body, CTAs)
 * - Component recipes (nav, hero, cards, etc.)
 * - Anti-patterns to explicitly avoid
 * - Reference translations (what to adopt/avoid from competitors)
 *
 * Output feeds directly to demoBuilderAgent for implementation.
 */

import { defineEventHandler, readBody, getHeader } from 'h3'
import { generateObject } from 'ai'
import { z } from 'zod'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { artDirectorAgent } from '~~/server/agents'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    return { success: false, error: 'Unauthorized' }
  }

  const body = await readBody(event)
  const { briefId } = body

  if (!briefId) {
    return { success: false, error: 'Brief ID required' }
  }

  try {
    const db = useDatabaseClient()

    // Fetch brief with all necessary data
    const { data: brief, error: briefError } = await db
      .from('briefs')
      .select(
        `id,
         user_email,
         brief_data,
         markdown_content,
         design_spec_json,
         reference_analysis_json
        `
      )
      .eq('id', briefId)
      .eq('user_email', userEmail)
      .maybeSingle()

    if (briefError) {
      return { success: false, error: 'Failed to fetch brief' }
    }

    if (!brief) {
      return { success: false, error: 'Brief not found' }
    }

    if (!brief.design_spec_json) {
      return { success: false, error: 'Design spec not found. Generate it first.' }
    }

    // Build comprehensive context for art direction
    const designSpec = brief.design_spec_json
    const briefData = brief.brief_data || {}
    const referenceAnalysis = brief.reference_analysis_json || {}
    const briefMarkdown = brief.markdown_content || ''

    // Build the prompt for artDirectorAgent
    // Include brief, design spec, and reference analysis
    const systemPrompt = `You are generating an art direction contract for a professional website project.

BRIEF:
${briefMarkdown}

DESIGN SPEC:
${JSON.stringify(designSpec, null, 2)}

REFERENCE ANALYSIS:
${JSON.stringify(referenceAnalysis, null, 2)}

BRIEF DATA:
${JSON.stringify(briefData, null, 2)}

Generate a comprehensive Art Direction Contract that:
1. Translates the brief + design spec into visual decisions
2. Incorporates insights from the reference analysis
3. Provides exact hex colors, fonts, sizes, and copy
4. Defines component recipes the developer can follow
5. Lists anti-patterns to explicitly avoid
6. Explains what to adopt/avoid from each reference

The output must be valid JSON matching the Art Direction Contract schema.`

    // Call artDirectorAgent via AI generation
    // We use generateObject to ensure valid JSON output
    const artDirectionSchema = z.object({
      style_manifesto: z.string().describe('2-3 sentences defining exact visual identity'),
      mood: z.array(z.string()).describe('3-5 mood keywords'),
      color_system: z.object({
        background: z.string().describe('Hex color'),
        surface: z.string().describe('Hex color'),
        surface_elevated: z.string().describe('Hex color'),
        text_primary: z.string().describe('Hex color'),
        text_secondary: z.string().describe('Hex color'),
        text_muted: z.string().describe('Hex color'),
        accent: z.string().describe('Hex color'),
        accent_hover: z.string().describe('Hex color'),
        accent_subtle: z.string().describe('Hex color with transparency'),
        border: z.string().describe('Hex color'),
        gradient_hero: z.string().optional().describe('linear-gradient(...)'),
        gradient_card: z.string().optional().describe('linear-gradient(...)'),
      }).describe('Exact color values'),
      typography: z.object({
        heading_font: z.string().describe('Font family from Google Fonts'),
        body_font: z.string().describe('Font family from Google Fonts'),
        accent_font: z.string().optional(),
        scale: z.object({
          hero: z.object({
            size: z.string().describe('clamp() value'),
            weight: z.number(),
            line_height: z.number(),
            letter_spacing: z.string().optional(),
          }),
          h1: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
            letter_spacing: z.string().optional(),
          }),
          h2: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
            letter_spacing: z.string().optional(),
          }),
          h3: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
          }),
          body_large: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
          }),
          body: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
          }),
          small: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
          }),
          caption: z.object({
            size: z.string(),
            weight: z.number(),
            line_height: z.number(),
            letter_spacing: z.string().optional(),
            text_transform: z.string().optional(),
          }),
        }),
      }),
      spacing: z.object({
        section_gap: z.string().describe('clamp() value'),
        content_max_width: z.string(),
        content_padding: z.string().describe('clamp() value'),
        component_gap: z.string().describe('clamp() value'),
        card_padding: z.string().describe('clamp() value'),
      }),
      effects: z.object({
        border_radius_small: z.string(),
        border_radius_medium: z.string(),
        border_radius_large: z.string(),
        shadow_card: z.string(),
        shadow_elevated: z.string(),
        blur_glass: z.string().optional(),
        transition_default: z.string(),
        transition_bounce: z.string().optional(),
      }),
      section_blueprints: z.array(z.object({
        id: z.string(),
        role: z.string().describe('hero | features | social_proof | pricing | cta | footer | etc'),
        headline: z.string().describe('Exact headline text'),
        subheadline: z.string().optional(),
        composition: z.string().describe('Visual layout pattern'),
        visual_weight: z.enum(['heavy', 'medium', 'light']),
        background_treatment: z.string(),
        content_density: z.enum(['sparse', 'balanced', 'dense']),
        key_elements: z.array(z.string()),
        interactions: z.array(z.string()).optional(),
        copy: z.object({
          headline: z.string(),
          body: z.string().optional(),
          cta_label: z.string().optional(),
          supporting_items: z.array(z.string()).optional(),
        }),
      })).describe('Full page sections from nav to footer'),
      component_recipes: z.object({
        nav: z.object({
          style: z.string(),
          items: z.array(z.string()),
          cta_label: z.string().optional(),
        }),
        hero: z.object({
          layout: z.string(),
          has_image: z.boolean(),
          image_treatment: z.string().optional(),
        }),
        feature_card: z.object({
          style: z.string(),
          icon_style: z.string(),
          has_hover: z.boolean(),
        }),
        cta_button: z.object({
          style: z.string(),
          size: z.string(),
          radius: z.string(),
        }),
        footer: z.object({
          style: z.string(),
        }),
      }).optional(),
      anti_patterns: z.array(z.string()).describe('Explicit things to AVOID'),
      reference_translation: z.array(z.object({
        reference: z.string().describe('Competitor name or URL'),
        adopt: z.array(z.string()).describe('What to take'),
        avoid: z.array(z.string()).describe('What NOT to take'),
      })).optional(),
      asset_direction: z.array(z.object({
        slot: z.string(),
        description: z.string(),
        style: z.string(),
        mood: z.string(),
      })).optional(),
    })

    // Generate art direction using the agent's context
    const { object: artDirection } = await generateObject({
      model: google('gemini-2.5-pro'),
      schema: artDirectionSchema,
      system: artDirectorAgent.instructions,
      prompt: systemPrompt,
      temperature: 0.7,
    })

    // Save art direction contract to database
    const { error: updateError } = await db
      .from('briefs')
      .update({
        art_direction_json: artDirection,
        updated_at: new Date().toISOString(),
      })
      .eq('id', briefId)

    if (updateError) {
      console.error('Failed to save art direction:', updateError)
      return { success: false, error: 'Failed to save art direction' }
    }

    return {
      success: true,
      data: {
        briefId,
        artDirection,
        summary: {
          mood: artDirection.mood,
          colors: Object.keys(artDirection.color_system).length,
          sections: artDirection.section_blueprints?.length || 0,
          antiPatterns: artDirection.anti_patterns?.length || 0,
          fonts: [artDirection.typography.heading_font, artDirection.typography.body_font],
        },
      },
    }
  } catch (error: any) {
    console.error('Art direction generation error:', error)
    return {
      success: false,
      error: error?.message || 'Failed to generate art direction',
    }
  }
})
