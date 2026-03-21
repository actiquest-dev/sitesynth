import { defineEventHandler, readBody } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'

const getPluginSecret = () =>
  process.env.FIGMA_PLUGIN_SECRET || process.env.NUXT_SESSION_PASSWORD || 'local-figma-plugin-secret'

const getGemini = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_GENERATIVE_AI_API_KEY not configured')
  return new GoogleGenerativeAI(apiKey)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body?.token
  if (token !== getPluginSecret()) {
    return { success: false, error: 'Unauthorized' }
  }

  const jobId = body?.jobId
  const stage = body?.stage
  const imageBase64 = body?.imageBase64
  const structure = body?.structure || []
  if (!jobId || !imageBase64) {
    return { success: false, error: 'Missing jobId or image' }
  }

  try {
    const genAI = getGemini()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
    const prompt = `
You are a senior UI designer reviewing a Figma build snapshot.
Return only JSON with suggested global fixes in this schema:
{
  "notes": string,
  "fixes": {
    "text_size_delta": number,
    "radius_delta": number,
    "brightness_delta": number
  }
}
Rules:
- Provide small deltas (text_size_delta between -2 and +4, radius_delta between -2 and +6, brightness_delta between -0.1 and +0.1).
- If no changes needed, set all deltas to 0.
- Notes should be concise.

Stage: ${stage || 'unknown'}
Structure: ${JSON.stringify(structure).slice(0, 4000)}
    `.trim()

    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { data: imageBase64, mimeType: 'image/png' } },
    ])
    const text = result.response.text().trim()
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      parsed = { notes: text, fixes: { text_size_delta: 0, radius_delta: 0, brightness_delta: 0 } }
    }

    return { success: true, data: parsed }
  } catch (error: any) {
    return { success: false, error: error.message || 'Critique failed' }
  }
})
