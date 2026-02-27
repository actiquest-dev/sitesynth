import { defineEventHandler, readBody, getHeader } from 'h3'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatHistoryRequest {
  messages?: ChatMessage[]
  context?: any
  action: 'save' | 'load' | 'save-context' | 'load-context'
}

const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
const NOCO_TOKEN = process.env.NOCO_TOKEN

const nocoHeaders = {
  'Authorization': `Bearer ${NOCO_TOKEN}`,
  'Content-Type': 'application/json',
}

/**
 * Chat History endpoint
 * Saves and loads chat messages from NocoBase
 */
export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, 'authorization')
    if (!authToken) throw new Error('Authorization required')

    const body = (await readBody(event)) as ChatHistoryRequest
    const action = body.action || 'load'

    if (action === 'save') return await saveChatMessages(authToken, body.messages || [])
    if (action === 'load') return await loadChatMessages(authToken)
    if (action === 'save-context') return await saveConversationContext(authToken, body.context || {})
    if (action === 'load-context') return await loadConversationContext(authToken)

    throw new Error('Invalid action')
  } catch (error: any) {
    console.error('Chat History Error:', error)
    return { success: false, error: error.message || 'Failed to process chat history' }
  }
})

function extractEmailFromToken(token: string): string {
  try {
    // Format: base64(email:timestamp) — same as user/orders.ts
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const email = decoded.split(':')[0]
    if (email && email.includes('@')) return email
    return ''
  } catch {
    return ''
  }
}

async function saveChatMessages(authToken: string, messages: ChatMessage[]): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) throw new Error('Could not extract user email from token')

  // Delete old messages
  await fetch(`${NOCO_BASE_URL}/api/ChatHistory:destroy?filter[userEmail]=${encodeURIComponent(userEmail)}`, {
    method: 'DELETE',
    headers: nocoHeaders,
  })

  // Save new messages
  for (const message of messages) {
    const response = await fetch(`${NOCO_BASE_URL}/api/ChatHistory:create`, {
      method: 'POST',
      headers: nocoHeaders,
      body: JSON.stringify({
        userEmail,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
      }),
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to save message: ${error.message || response.statusText}`)
    }
  }

  return { success: true, saved: messages.length }
}

async function loadChatMessages(authToken: string): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) throw new Error('Could not extract user email from token')

  const response = await fetch(
    `${NOCO_BASE_URL}/api/ChatHistory:list?filter[userEmail]=${encodeURIComponent(userEmail)}&sort=timestamp&pageSize=100`,
    { headers: nocoHeaders }
  )

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(`Failed to load messages: ${error.message || response.statusText}`)
  }

  const data = await response.json()
  const messages = (data.data || []).map((row: any) => ({
    role: row.role,
    content: row.content,
    timestamp: row.timestamp,
  }))

  return { success: true, messages }
}

async function saveConversationContext(authToken: string, context: any): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) throw new Error('Could not extract user email from token')

  try {
    // Delete old context
    await fetch(`${NOCO_BASE_URL}/api/ChatContext:destroy?filter[userEmail]=${encodeURIComponent(userEmail)}`, {
      method: 'DELETE',
      headers: nocoHeaders,
    })

    // Save new context
    const response = await fetch(`${NOCO_BASE_URL}/api/ChatContext:create`, {
      method: 'POST',
      headers: nocoHeaders,
      body: JSON.stringify({
        userEmail,
        contextData: JSON.stringify(context),
        updatedAt: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to save context: ${error.message || response.statusText}`)
    }

    return { success: true, message: 'Context saved' }
  } catch (error: any) {
    console.error('Error saving conversation context:', error)
    return { success: false, message: 'Context save failed (non-critical)' }
  }
}

async function loadConversationContext(authToken: string): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) throw new Error('Could not extract user email from token')

  try {
    const response = await fetch(
      `${NOCO_BASE_URL}/api/ChatContext:list?filter[userEmail]=${encodeURIComponent(userEmail)}`,
      { headers: nocoHeaders }
    )

    if (!response.ok) return { success: true, context: null }

    const data = await response.json()
    const row = (data.data || [])[0]

    if (!row?.contextData) return { success: true, context: null }

    return { success: true, context: JSON.parse(row.contextData) }
  } catch (error: any) {
    console.error('Error loading conversation context:', error)
    return { success: true, context: null }
  }
}
