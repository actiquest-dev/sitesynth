import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { google } from 'googleapis'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

// Helper function to read file content from Google Drive
async function readGoogleDriveFile(fileId: string): Promise<{ mimeType: string; data: string } | null> {
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
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.readonly'],
    })

    const driveClient = google.drive({
      version: 'v3',
      auth,
    })

    // Get file metadata
    const metadata = await driveClient.files.get({
      fileId,
      fields: 'name, mimeType, size',
      supportsAllDrives: true,
    })

    // Download file content
    const file = await driveClient.files.get(
      {
        fileId,
        alt: 'media',
        supportsAllDrives: true,
      },
      { responseType: 'arraybuffer' }
    )

    const buffer = Buffer.from(file.data as ArrayBuffer)
    const base64Data = buffer.toString('base64')

    console.log(`[Brief] ✓ File read successfully: ${metadata.data.name} (${metadata.data.size} bytes, type: ${metadata.data.mimeType})`)

    // Ensure we send a valid mime type for Gemini
    let mimeType = metadata.data.mimeType || 'application/octet-stream'
    
    // Gemini supports PDF, images, and text. Fallback to plain text for unknown types.
    const supportedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif', 'text/plain', 'text/html', 'text/csv', 'text/markdown']
    if (!supportedTypes.includes(mimeType)) {
      if (mimeType.includes('image/')) mimeType = 'image/jpeg'
      else if (mimeType.includes('text/')) mimeType = 'text/plain'
      else mimeType = 'text/plain' // Fallback
    }

    return {
      mimeType,
      data: base64Data
    }
  } catch (error) {
    console.error(`[Brief] ✗ Could not read file ${fileId}:`, error instanceof Error ? error.message : String(error))
    return null
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { briefData, uploadedFiles, storageFileIds, userMessage, currentBrief } = body

    // System prompt for brief generation
    const systemPrompt = `You are a professional Design Brief expert. Create a comprehensive, well-structured design brief.

IMPORTANT RULES:
- Do NOT repeat or duplicate information across sections
- Each section should contain UNIQUE information
- Be concise but thorough
- Use professional language
- Write in the same language the user provided their answers in

Generate the brief with these sections (use ## for headers):

## 1. Product Type & Platform
State clearly whether this is a website, mobile app, web app, catalog, landing page, or another product type. Name the primary platform(s), core surfaces, and the product format assumptions.

## 2. Project Overview
Brief project summary, name, and type. One paragraph.

## 3. Business Context & Goals
Primary goals, business objectives, KPIs. What success looks like.

## 4. Target Audience
Who the users are, demographics, behaviors, needs.

## 5. Problem Statement
Key challenges and pain points to solve. What's not working today.

## 6. Scope & Deliverables
What will be delivered. List each deliverable clearly.

## 7. Brand & Visual Direction
Colors, typography preferences, style direction, existing brand guidelines.

## 8. Technical Requirements
Platforms, integrations, performance needs, accessibility standards.

## 9. Timeline & Budget
Project timeline, milestones, budget range.

## 10. Success Metrics
How to measure if the project achieved its goals.`

    // Prepare context from briefData
    const briefContext = `
BRIEF DATA:
- Project Name: ${briefData?.projectName || 'Not provided'}
- Project Type: ${briefData?.projectType || 'Not provided'}
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
    const allFileIds = [...(uploadedFiles || []), ...(storageFileIds || [])]
    const totalFiles = allFileIds.length
    
    // Array to hold the parts for the Gemini API call (text + files)
    const promptParts: any[] = []

    if (totalFiles > 0) {
      console.log(`[Brief] 📁 Reading ${totalFiles} file(s) from Google Drive: ${uploadedFiles?.length || 0} uploaded + ${storageFileIds?.length || 0} from storage`)
      try {
        const filesData = await Promise.all(
          allFileIds.map(fileId => readGoogleDriveFile(fileId))
        )
        
        let validFilesCount = 0
        for (const file of filesData) {
          if (file) {
            promptParts.push({
              inlineData: {
                data: file.data,
                mimeType: file.mimeType
              }
            })
            validFilesCount++
          }
        }
        console.log(`[Brief] ✓ All files read successfully (${validFilesCount} files ready for Gemini)`)
      } catch (error) {
        console.error(`[Brief] ✗ Error reading files:`, error instanceof Error ? error.message : String(error))
      }
    } else {
      console.log(`[Brief] ℹ No files provided for this brief`)
    }

    // Model fallback chain for brief generation
    const modelNames = ['gemini-2.5-pro', 'gemini-2.0-pro', 'gemini-1.5-pro']
    let result: any = null
    let usedModel = ''

    // Generate brief or answer user question about brief
    let prompt = ''
    if (userMessage) {
      // User is asking a question about the brief
      prompt = `${briefContext}\n\nCurrent Brief:\n${currentBrief || 'No brief yet'}\n\nUser Question: ${userMessage}\n\nPlease respond to this question about the brief, staying in context.`
      console.log(`[Brief] 💬 Generating response to user question...`)
    } else {
      // Generate complete brief
      prompt = `${briefContext}\n\nBased on the above information, generate a comprehensive 10-section design brief. The first section must explicitly define Product Type & Platform. Format it clearly with headers for each section. If the user provided any reference files, use them as additional context.`
      console.log(`[Brief] 🚀 Generating comprehensive brief...`)
      console.log(`[Brief] 📋 Prompt length: ${prompt.length} characters, Files included: ${totalFiles}, Data fields: ${Object.keys(briefData || {}).length}`)
    }

    // Add the text prompt as the first part
    promptParts.unshift({ text: prompt })

    // Try each model in order
    for (const modelName of modelNames) {
      try {
        console.log(`[Brief] Trying model: ${modelName}`)
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        })

        result = await model.generateContent({
          contents: [
            {
              role: 'user',
              parts: promptParts,
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
        usedModel = modelName
        console.log(`[Brief] ✓ Success with model: ${modelName}`)
        break
      } catch (modelError: any) {
        console.warn(`[Brief] Model ${modelName} failed:`, modelError?.message || modelError)
        if (modelName === modelNames[modelNames.length - 1]) throw modelError
      }
    }

    const responseText = result.response.text()
    console.log(`[Brief] ✓ Brief generated successfully with ${usedModel} (${responseText.length} characters)`)

    return {
      success: true,
      content: responseText,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[Brief] ✗ Error generating brief:', error instanceof Error ? error.message : String(error))
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
