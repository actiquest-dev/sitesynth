import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { useDatabaseClient } from '~~/server/utils/supabase'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) return { success: false, error: 'Unauthorized' }

  const body = await readBody(event)
  const { briefId, markdownContent } = body

  if (!briefId || !markdownContent) {
    return { success: false, error: 'Brief ID and content required' }
  }

  try {
    // Generate structured Design Spec JSON from Markdown brief
    const { object } = await generateObject({
      model: google('gemini-2.5-pro'),
      schema: z.object({
        pages: z.array(z.object({
          title: z.string(),
          path: z.string(),
          ui_blocks: z.array(z.object({
            type: z.string(), // e.g., 'Hero', 'Features', 'Pricing'
            description: z.string()
          }))
        })),
        theme: z.object({
          colors: z.object({ primary: z.string(), secondary: z.string(), background: z.string() }),
          typography: z.object({ heading: z.string(), body: z.string() })
        })
      }),
      prompt: `Analyze this design brief and convert it into a structured technical design specification for Figma components: \n\n${markdownContent}`
    })

    // Save/Update the spec in the database
    const db = useDatabaseClient()
    const { error } = await db
      .from('briefs')
      .update({ design_spec_json: object, updated_at: new Date().toISOString() })
      .eq('id', briefId)
      .eq('user_email', userEmail)

    if (error) throw error

    return { success: true, data: object }
  } catch (error) {
    console.error('[DesignSpec] Error:', error)
    return { success: false, error: 'Failed to generate design spec' }
  }
})
