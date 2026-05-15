import { GoogleAuth } from 'google-auth-library'

export type GeminiPart = { text: string } | { inlineData: { data: string; mimeType: string } }

const DEFAULT_SCOPE = 'https://www.googleapis.com/auth/generative-language'

function parseServiceAccountJsonFromEnv() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!raw) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    throw new Error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON / GOOGLE_APPLICATION_CREDENTIALS_JSON JSON')
  }
}

let cachedToken: { token: string; exp: number } | null = null

async function getOAuthToken(): Promise<string | null> {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) return process.env.GOOGLE_OAUTH_ACCESS_TOKEN

  const now = Date.now()
  if (cachedToken && cachedToken.exp - now > 60_000) return cachedToken.token

  try {
    const auth = new GoogleAuth({
      credentials: parseServiceAccountJsonFromEnv(),
      scopes: [process.env.GOOGLE_GENERATIVE_AI_SCOPE || DEFAULT_SCOPE],
    })
    const client = await auth.getClient()
    const token = await client.getAccessToken()
    if (!token.token) return null
    cachedToken = { token: token.token, exp: now + 45 * 60_000 }
    return token.token
  } catch {
    return null
  }
}

async function buildAuth(): Promise<{ urlSuffix: string; headers: Record<string, string> }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY || process.env.LLM_API_KEY
  if (apiKey) return { urlSuffix: `?key=${encodeURIComponent(apiKey)}`, headers: {} }

  const token = await getOAuthToken()
  if (token) return { urlSuffix: '', headers: { Authorization: `Bearer ${token}` } }

  throw new Error('Gemini auth not configured. Set GOOGLE_GENERATIVE_AI_API_KEY (or GOOGLE_API_KEY/LLM_API_KEY) or OAuth credentials (GOOGLE_SERVICE_ACCOUNT_JSON/GOOGLE_APPLICATION_CREDENTIALS_JSON or GOOGLE_OAUTH_ACCESS_TOKEN).')
}

export async function geminiGenerateContent(params: {
  model: string
  contents: Array<{ role: 'user' | 'model'; parts: GeminiPart[] }>
  generationConfig?: Record<string, unknown>
}): Promise<any> {
  const { urlSuffix, headers: authHeaders } = await buildAuth()
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent${urlSuffix}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({
      contents: params.contents,
      ...(params.generationConfig ? { generationConfig: params.generationConfig } : {}),
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = data?.error?.message || response.statusText
    throw new Error(`Gemini API error (${response.status}): ${message}`)
  }

  return data
}

export async function geminiTextFromPrompt(model: string, prompt: string): Promise<string> {
  const data = await geminiGenerateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  })
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}
