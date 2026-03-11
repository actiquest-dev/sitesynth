import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { briefData, uploadedFiles, userMessage } = body

    // System prompt for brief generation
    const systemPrompt = `You are a professional Design Brief expert. Your role is to create comprehensive, high-quality design briefs based on client information.

When generating a brief, you should:
1. Analyze all provided information (data, files, conversation history)
2. Create a well-structured 8-section brief:
   - Project Overview
   - Goals & Audience
   - Pain Points & Challenges
   - Brand Guidelines
   - Deliverables & Scope
   - Timeline & Budget
   - Technical Requirements
   - Success Metrics

Keep responses professional, concise, and actionable. Focus on clarity and alignment with client needs.`

    // Prepare context from briefData
    const briefContext = `
BRIEF DATA:
- Project Name: ${briefData?.projectName || 'Not provided'}
- Description: ${briefData?.projectDescription || 'Not provided'}
- Category: ${briefData?.projectCategory || 'Not provided'}
- Industry: ${briefData?.industry || 'Not provided'}
- Primary Goal: ${briefData?.primaryGoal || 'Not provided'}
- Target Audience: ${briefData?.targetAudience || 'Not provided'}
- Pain Points: ${briefData?.painPoints?.join(', ') || 'Not provided'}
- Color Palette: ${briefData?.colorPalette || 'Not provided'}
- Timeline: ${briefData?.timeline || 'Not provided'}
- Budget: ${briefData?.budget || 'Not provided'}
- Deliverables: ${briefData?.deliverables?.join(', ') || 'Not provided'}
- Technical Requirements: ${briefData?.technicalRequirements?.join(', ') || 'Not provided'}
`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt,
    })

    // Generate brief or answer user question about brief
    let prompt = ''
    if (userMessage) {
      // User is asking a question about the brief
      prompt = `${briefContext}\n\nUser Question: ${userMessage}\n\nPlease respond to this question about the brief, staying in context.`
    } else {
      // Generate complete brief
      prompt = `${briefContext}\n\nBased on the above information, generate a comprehensive 8-section design brief. Format it clearly with headers for each section.`
    }

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    })

    const responseText = result.response.text()

    return {
      success: true,
      content: responseText,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error generating brief:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
