import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const directTextTypes = new Set([
  'text/plain',
  'text/html',
  'text/csv',
  'text/markdown',
  'application/json',
])

const aiExtractableTypes = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

async function getDriveClient() {
  let credentials: any

  if (process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) {
    credentials = JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON)
  } else if (process.env.GOOGLE_DRIVE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL) {
    credentials = {
      type: 'service_account',
      project_id: 'sitesynth-llm',
      private_key_id: 'key',
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
      client_id: '1234567890',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    }
  } else {
    throw new Error('Google Drive credentials not configured')
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  })

  return google.drive({ version: 'v3', auth })
}

async function downloadDriveFile(fileId: string) {
  const driveClient = await getDriveClient()
  const metadata = await driveClient.files.get({
    fileId,
    fields: 'id,name,mimeType,size',
    supportsAllDrives: true,
  })

  const mimeType = metadata.data.mimeType || 'application/octet-stream'

  // Export Google Docs to plain text if needed.
  if (mimeType === 'application/vnd.google-apps.document') {
    const exported = await driveClient.files.export(
      { fileId, mimeType: 'text/plain' },
      { responseType: 'arraybuffer' }
    )
    return {
      name: metadata.data.name || fileId,
      mimeType: 'text/plain',
      buffer: Buffer.from(exported.data as ArrayBuffer),
    }
  }

  const file = await driveClient.files.get(
    {
      fileId,
      alt: 'media',
      supportsAllDrives: true,
    },
    { responseType: 'arraybuffer' }
  )

  return {
    name: metadata.data.name || fileId,
    mimeType,
    buffer: Buffer.from(file.data as ArrayBuffer),
  }
}

async function extractTextWithModel(buffer: Buffer, mimeType: string, fileName: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [
        {
          text: `Extract the useful textual content from this file for design and product strategy work.

Return plain text only.
Preserve headings and bullets when possible.
Do not summarize away important constraints, brand rules, requirements, or deliverables.
File name: ${fileName}`,
        },
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType,
          },
        },
      ],
    }],
  })

  return result.response.text().trim()
}

async function extractTextFromDriveFile(fileId: string) {
  const file = await downloadDriveFile(fileId)

  if (directTextTypes.has(file.mimeType)) {
    return {
      fileName: file.name,
      mimeType: file.mimeType,
      text: file.buffer.toString('utf8'),
    }
  }

  if (aiExtractableTypes.has(file.mimeType)) {
    return {
      fileName: file.name,
      mimeType: file.mimeType,
      text: await extractTextWithModel(file.buffer, file.mimeType, file.name),
    }
  }

  return {
    fileName: file.name,
    mimeType: file.mimeType,
    text: '',
  }
}

function chunkText(text: string, chunkSize = 1200, overlap = 200) {
  const normalized = text.replace(/\r/g, '').trim()
  if (!normalized) return [] as string[]

  const chunks: string[] = []
  let start = 0
  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length)
    chunks.push(normalized.slice(start, end))
    if (end >= normalized.length) break
    start = Math.max(end - overlap, start + 1)
  }
  return chunks
}

export async function ensureFileChunks(fileIds: string[], userEmail: string) {
  const uniqueIds = Array.from(new Set(fileIds.filter(Boolean)))
  if (uniqueIds.length === 0) return

  const { data: existing } = await supabase
    .from('file_chunks')
    .select('file_id')
    .eq('user_email', userEmail)
    .in('file_id', uniqueIds)

  const existingIds = new Set((existing || []).map((row: any) => row.file_id))
  const missingIds = uniqueIds.filter((id) => !existingIds.has(id))

  for (const fileId of missingIds) {
    try {
      const extracted = await extractTextFromDriveFile(fileId)
      const chunks = chunkText(extracted.text)
      if (chunks.length === 0) continue

      await supabase
        .from('file_chunks')
        .upsert(chunks.map((content, index) => ({
          user_email: userEmail,
          file_id: fileId,
          file_name: extracted.fileName,
          mime_type: extracted.mimeType,
          chunk_index: index,
          content,
        })), {
          onConflict: 'file_id,chunk_index',
        })
    } catch (error) {
      console.error('[File RAG] Failed to ingest file:', fileId, error)
    }
  }
}

export async function retrieveRelevantFileChunks(params: {
  fileIds: string[]
  userEmail: string
  query: string
  limit?: number
}) {
  const { fileIds, userEmail, query, limit = 6 } = params
  const uniqueIds = Array.from(new Set(fileIds.filter(Boolean)))
  if (uniqueIds.length === 0) return [] as Array<{ file_name: string; content: string }>

  await ensureFileChunks(uniqueIds, userEmail)

  const { data } = await supabase
    .from('file_chunks')
    .select('file_name, content')
    .eq('user_email', userEmail)
    .in('file_id', uniqueIds)
    .limit(500)

  const rows = data || []
  const queryTerms = query
    .toLowerCase()
    .split(/[^a-zA-Zа-яА-Я0-9]+/)
    .filter((term) => term.length > 2)

  const scored = rows
    .map((row: any) => {
      const haystack = `${row.file_name} ${row.content}`.toLowerCase()
      const score = queryTerms.reduce((acc, term) => acc + (haystack.includes(term) ? 1 : 0), 0)
      return { ...row, score }
    })
    .sort((a: any, b: any) => b.score - a.score || b.content.length - a.content.length)

  const picked = scored.slice(0, limit)
  return picked.map((row: any) => ({
    file_name: row.file_name,
    content: row.content.slice(0, 1600),
  }))
}
