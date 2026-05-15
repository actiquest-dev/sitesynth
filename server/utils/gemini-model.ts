import { google } from '@ai-sdk/google'
import { vertex } from '@ai-sdk/google-vertex'

const useVertex = process.env.GOOGLE_GENAI_BACKEND === 'vertex' || process.env.GOOGLE_VERTEX_PROJECT || process.env.GOOGLE_CLOUD_PROJECT

export function geminiModel(model: string) {
  if (useVertex) {
    return vertex(model, {
      project: process.env.GOOGLE_VERTEX_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
      location: process.env.GOOGLE_VERTEX_LOCATION || 'us-central1',
    })
  }

  return google(model)
}

export function currentGeminiBackend() {
  return useVertex ? 'vertex' : 'api-key'
}
