import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export interface DynamicQuestion {
  id: string
  section: number
  sectionTitle: string
  text: string
  type: 'text_input' | 'textarea' | 'single_select' | 'multi_select'
  options?: { id: string; label: string }[]
  hint?: string
  branching?: {
    condition: string
    followUp: DynamicQuestion
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { productDescription } = body

    if (!productDescription || productDescription.trim().length < 20) {
      return {
        success: false,
        error: 'Product description too short. Provide at least 20 characters.',
      }
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
    })

    const systemPrompt = `You are a senior product strategist. Generate a branching discovery questionnaire as a JSON object.

CRITICAL: You MUST output ONLY valid, parseable JSON. Do NOT:
- Wrap JSON in markdown code blocks (no triple backticks)
- Add any text before or after the JSON
- Include explanations or comments
- Return anything except the JSON object itself

Start your response with { and end with }

Analyze the product description and:
1. Classify: product type, business model, stage, complexity
2. Generate 12-15 questions mixing core + domain-specific + stage-specific
3. Include hints and branching logic where relevant
4. Adapt wording to the product context

JSON Schema:
{
  "productName": "string",
  "productType": "string (e.g., SaaS, Marketplace, E-commerce, etc.)",
  "stage": "string (Idea, MVP, Redesign, Scale)",
  "questions": [
    {
      "id": "Q1",
      "section": 1,
      "sectionTitle": "Product Overview",
      "text": "Main question",
      "type": "text_input|textarea|single_select|multi_select",
      "hint": "optional guidance",
      "options": [{"id": "opt1", "label": "Option 1"}],
      "branching": {
        "condition": "if user selects X",
        "followUpText": "Follow-up question text"
      }
    }
  ]
}

Core sections:
1. Product Overview
2. Business Goal
3. Users & Segments
4. Core Problem
5. Core Use Cases
6. Features & Scope
7. UX Complexity
8. Metrics & Success
9. Market & Competitors
10. Content / Data / Operations
11. Technical Constraints
12. Brand & Design Direction
13. Team / Workflow
14. Timeline & Budget
15. Risks & Unknowns

Domain branches (add only if relevant):
- SaaS: onboarding, retention, roles, integrations
- Marketplace: supply/demand, matching, trust, moderation
- E-commerce: catalog, filters, checkout, returns
- FinTech: KYC, payments, compliance, security
- AI product: quality, hallucination, explainability, privacy
- Dashboard: metrics, drill-down, alerts, exports
- Mobile: context, offline, notifications
- Branding: positioning, tone, differentiation

Output valid JSON ONLY.`

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nGenerate a questionnaire for this product:\n\n${productDescription}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4000,
      },
    })

    const responseText = result.response.text()
    console.log('[Questionnaire] Raw response (first 300 chars):', responseText.substring(0, 300))

    // Parse JSON with multiple strategies
    let questionsData

    // Strategy 1: Direct parse
    try {
      questionsData = JSON.parse(responseText)
      console.log('[Questionnaire] Successfully parsed as direct JSON')
    } catch {
      // Strategy 2: Extract from ```json...```
      let match = responseText.match(/```json\s*([\s\S]*?)\s*```/)
      if (match) {
        try {
          questionsData = JSON.parse(match[1].trim())
          console.log('[Questionnaire] Successfully parsed from ```json block')
        } catch {
          console.error('[Questionnaire] Failed to parse extracted json block')
        }
      }
    }

    // Strategy 3: Extract from ```...```
    if (!questionsData) {
      const match = responseText.match(/```\s*([\s\S]*?)\s*```/)
      if (match) {
        try {
          questionsData = JSON.parse(match[1].trim())
          console.log('[Questionnaire] Successfully parsed from ``` block')
        } catch {
          console.error('[Questionnaire] Failed to parse extracted ``` block')
        }
      }
    }

    // Strategy 4: Find JSON object by braces
    if (!questionsData) {
      const jsonStart = responseText.indexOf('{')
      const jsonEnd = responseText.lastIndexOf('}')
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        try {
          questionsData = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1))
          console.log('[Questionnaire] Successfully parsed from brace extraction')
        } catch {
          console.error('[Questionnaire] Failed to parse brace-extracted JSON')
        }
      }
    }

    if (!questionsData) {
      console.error('[Questionnaire] All parsing strategies failed. Raw response:', responseText.substring(0, 500))
      throw new Error('Response was not valid JSON format')
    }

    // Validate the response has expected structure
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      console.error('[Questionnaire] Invalid response structure:', JSON.stringify(questionsData).substring(0, 300))
      throw new Error('Response missing questions array')
    }

    return {
      success: true,
      data: questionsData,
    }
  } catch (error) {
    console.error('[Questionnaire] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate questionnaire',
    }
  }
})
