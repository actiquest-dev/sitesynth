import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { questionText, userAnswer } = body

    if (!userAnswer || userAnswer.trim().length < 5) {
      return { success: false, error: 'Answer is too short to enhance' }
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      systemInstruction: `You are a professional brief writing assistant. The user is filling out a project brief questionnaire. Your job is to take their rough answer and rewrite it to be more professional, detailed, and clear. Keep the original meaning and intent. Return ONLY the improved text, nothing else. Do not add any prefixes like "Here's the improved version:" - just return the text. Write in the same language the user used.`,
    })

    const result = await model.generateContent(
      `Question: "${questionText}"\n\nUser's answer: "${userAnswer}"\n\nRewrite this answer to be more professional and detailed:`
    )

    const enhanced = result.response.text()

    return { success: true, enhanced }
  } catch (error) {
    console.error('[Enhance] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Enhancement failed',
    }
  }
})
