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
You are preparing a polished project narrative for a design brief wizard.

Write a detailed but concise summary in plain text.

Rules:
- Write as a strong working summary for a strategist or designer.
- Do not output JSON.
- Do not mention missing fields explicitly.
- Organize the summary into short paragraphs or bullet points.
- Cover: what is being built, business context, likely users, goals, constraints, deliverables, signals from the client intake.
- If explicit project type is provided, treat it as authoritative.
- End with 2-4 concrete design considerations that should influence discovery questions.

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
