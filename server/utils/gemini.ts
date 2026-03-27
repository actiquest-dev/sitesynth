import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

const DEFAULT_MODELS = ['gemini-2.5-pro', 'gemini-pro-latest']

export type GeminiResult<T> = {
  data: T
  model: string
}

export async function geminiJson<T>(
  prompt: string,
  models: string[] = DEFAULT_MODELS
): Promise<GeminiResult<T>> {
  let lastError: unknown = null

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      })

      const result = await model.generateContent(prompt)
      const text = result.response.text()
      const data = JSON.parse(text) as T
      return { data, model: modelName }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Gemini JSON generation failed')
}

export async function geminiText(
  prompt: string,
  models: string[] = DEFAULT_MODELS,
  options?: { temperature?: number; maxOutputTokens?: number }
): Promise<GeminiResult<string>> {
  let lastError: unknown = null

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxOutputTokens ?? 2500,
        },
      })

      const result = await model.generateContent(prompt)
      return { data: result.response.text(), model: modelName }
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Gemini text generation failed')
}
