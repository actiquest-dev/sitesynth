import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    throw createError({ statusCode: 401, statusMessage: 'User email required' })
  }

  const body = await readBody(event)
  const intakePayload = body?.intakePayload
  const projectType = body?.projectType

  if (!intakePayload) {
    throw createError({ statusCode: 400, statusMessage: 'intakePayload is required' })
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

  const prompt = `
You are preparing a polished intake summary for a design brief wizard.

Write a structured working summary in plain text using exactly these sections:

Project
Client
Goals
Constraints
Design implications

Rules:
- Do not output JSON.
- Do not mention missing fields explicitly.
- Use concise, editable prose with short bullets where helpful.
- Treat the explicit project type as authoritative if provided.
- Make this suitable for a strategist or designer to refine directly in a textarea.
- In "Design implications", include 3-5 concrete implications that should influence discovery questions and later design spec generation.

Explicit project type: ${projectType || 'not provided'}

Intake payload:
${JSON.stringify(intakePayload, null, 2)}
  `.trim()

  const result = await model.generateContent(prompt)
  const summary = result.response.text().trim()

  return {
    success: true,
    data: {
      summary,
    },
  }
})
