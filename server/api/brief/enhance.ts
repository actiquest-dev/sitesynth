import { geminiGenerateContent } from '~~/server/utils/gemini-client'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { questionText, userAnswer } = body

    if (!userAnswer || userAnswer.trim().length < 5) {
      return { success: false, error: 'Answer is too short to enhance' }
    }

    const prompt = `You are a professional brief writing assistant. The user is filling out a project brief questionnaire. Your job is to take their rough answer and rewrite it to be more professional, detailed, and clear. Keep the original meaning and intent. Return ONLY the improved text, nothing else. Do not add any prefixes like "Here's the improved version:" - just return the text. Write in the same language the user used.\n\nQuestion: "${questionText}"\n\nUser's answer: "${userAnswer}"\n\nRewrite this answer to be more professional and detailed:`
    const data = await geminiGenerateContent({
      model: 'gemini-2.5-pro',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const enhanced = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    return { success: true, enhanced }
  } catch (error) {
    console.error('[Enhance] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Enhancement failed',
    }
  }
})
