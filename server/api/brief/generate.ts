import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { google } from 'googleapis'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

// Helper function to read file content from Google Drive
async function readGoogleDriveFileContent(fileId: string): Promise<string> {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: 'sitesynth-llm',
        private_key_id: 'key',
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
        client_id: '1234567890',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    const driveClient = google.drive({
      version: 'v3',
      auth,
    })

    // Get file metadata
    const metadata = await driveClient.files.get({
      fileId,
      fields: 'name, mimeType, size',
    })

    // Download file content
    const file = await driveClient.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'arraybuffer' }
    )

    const buffer = Buffer.from(file.data as ArrayBuffer)
    const text = buffer.toString('utf-8').substring(0, 5000) // First 5KB

    return `### File: ${metadata.data.name}\n\`\`\`\n${text}\n\`\`\``
  } catch (error) {
    console.error(`[Brief] Could not read file ${fileId}:`, error)
    return `### File: [Unable to read]\n(File content could not be extracted)`
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { briefData, uploadedFiles, userMessage, currentBrief } = body

    // System prompt for brief generation
    const systemPrompt = `You are a professional Design Brief expert. Create a comprehensive, well-structured design brief.

IMPORTANT RULES:
- Do NOT repeat or duplicate information across sections
- Each section should contain UNIQUE information
- Be concise but thorough
- Use professional language
- Write in the same language the user provided their answers in

Generate the brief with these sections (use ## for headers):

## 1. Project Overview
Brief project summary, name, and type. One paragraph.

## 2. Business Context & Goals
Primary goals, business objectives, KPIs. What success looks like.

## 3. Target Audience
Who the users are, demographics, behaviors, needs.

## 4. Problem Statement
Key challenges and pain points to solve. What's not working today.

## 5. Scope & Deliverables
What will be delivered. List each deliverable clearly.

## 6. Brand & Visual Direction
Colors, typography preferences, style direction, existing brand guidelines.

## 7. Technical Requirements
Platforms, integrations, performance needs, accessibility standards.

## 8. Timeline & Budget
Project timeline, milestones, budget range.

## 9. Success Metrics
How to measure if the project achieved its goals.`

    // Prepare context from briefData
    const briefContext = `
BRIEF DATA:
- Project Name: ${briefData?.projectName || 'Not provided'}
- Description: ${briefData?.projectDescription || 'Not provided'}
- Category: ${briefData?.projectCategory || 'Not provided'}
- Industry: ${briefData?.industry || 'Not provided'}
- Primary Goal: ${briefData?.primaryGoal || 'Not provided'}
- Target Audience: ${briefData?.targetAudience || 'Not provided'}
- Pain Points: ${Array.isArray(briefData?.painPoints) ? briefData.painPoints.join(', ') : (briefData?.painPoints || 'Not provided')}
- Color Palette: ${briefData?.colorPalette || 'Not provided'}
- Timeline: ${briefData?.timeline || 'Not provided'}
- Budget: ${briefData?.budget || 'Not provided'}
- Deliverables: ${Array.isArray(briefData?.deliverables) ? briefData.deliverables.join(', ') : (briefData?.deliverables || 'Not provided')}
- Technical Requirements: ${Array.isArray(briefData?.technicalRequirements) ? briefData.technicalRequirements.join(', ') : (briefData?.technicalRequirements || 'Not provided')}
`

    // Read file contents if provided
    let filesContext = ''
    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log(`[Brief] Reading ${uploadedFiles.length} file(s) from Google Drive...`)
      const fileContents = await Promise.all(
        uploadedFiles.map(fileId => readGoogleDriveFileContent(fileId))
      )
      filesContext = `\n\n## REFERENCE FILES\n${fileContents.join('\n\n')}`
      console.log(`[Brief] Files read successfully`)
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      systemInstruction: systemPrompt,
    })

    // Generate brief or answer user question about brief
    let prompt = ''
    if (userMessage) {
      // User is asking a question about the brief
      prompt = `${briefContext}${filesContext}\n\nCurrent Brief:\n${currentBrief || 'No brief yet'}\n\nUser Question: ${userMessage}\n\nPlease respond to this question about the brief, staying in context.`
    } else {
      // Generate complete brief
      prompt = `${briefContext}${filesContext}\n\nBased on the above information, generate a comprehensive 8-section design brief. Format it clearly with headers for each section.`
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
