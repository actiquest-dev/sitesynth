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
const NOCO_TABLE_NAME = 'ChatHistory'

/**
 * Chat History endpoint
 * Saves and loads chat messages from NocoBase
 */
export default defineEventHandler(async (event) => {
  try {
    const authToken = getHeader(event, 'authorization')
    if (!authToken) {
      throw new Error('Authorization required')
    }

    const body = (await readBody(event)) as ChatHistoryRequest
    const action = body.action || 'load'

    if (action === 'save') {
      return await saveChatMessages(authToken, body.messages || [])
    } else if (action === 'load') {
      return await loadChatMessages(authToken)
    } else if (action === 'save-context') {
      return await saveConversationContext(authToken, body.context || {})
    } else if (action === 'load-context') {
      return await loadConversationContext(authToken)
    }

    throw new Error('Invalid action')
  } catch (error: any) {
    console.error('Chat History Error:', error)
    return {
      success: false,
      error: error.message || 'Failed to process chat history',
    }
  }
})

/**
 * Extract email from auth token
 */
function extractEmailFromToken(token: string): string {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return ''
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    return decoded.email || decoded.sub || ''
  } catch {
    return ''
  }
}

/**
 * Save chat messages to NocoBase
 */
async function saveChatMessages(
  authToken: string,
  messages: ChatMessage[]
): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) {
    throw new Error('Could not extract user email from token')
  }

  try {
    // First, delete old chat messages for this user
    const deleteUrl = `${NOCO_BASE_URL}/api/v1/db/data/noco/${NOCO_TABLE_NAME}?where=(userEmail,eq,${userEmail})`
    await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
    })

    // Save new messages
    for (const message of messages) {
      const saveUrl = `${NOCO_BASE_URL}/api/v1/db/data/noco/${NOCO_TABLE_NAME}`
      const response = await fetch(saveUrl, {
        method: 'POST',
        headers: {
          'xc-auth': NOCO_TOKEN,
          'Content-Type': 'application/json',
        },
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

    return {
      success: true,
      saved: messages.length,
    }
  } catch (error: any) {
    console.error('Error saving chat messages:', error)
    throw error
  }
}

/**
 * Load chat messages from NocoBase
 */
async function loadChatMessages(authToken: string): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) {
    throw new Error('Could not extract user email from token')
  }

  try {
    const url = `${NOCO_BASE_URL}/api/v1/db/data/noco/${NOCO_TABLE_NAME}?where=(userEmail,eq,${userEmail})&sort=-timestamp`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Failed to load messages: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    const messages = (data.list || []).map((row: any) => ({
      role: row.role,
      content: row.content,
      timestamp: row.timestamp,
    }))

    return {
      success: true,
      messages,
    }
  } catch (error: any) {
    console.error('Error loading chat messages:', error)
    throw error
  }
}

/**
 * Save conversation context to NocoBase
 */
async function saveConversationContext(authToken: string, context: any): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) {
    throw new Error('Could not extract user email from token')
  }

  try {
    // Store context as JSON string in a simple key-value table
    const contextTableName = 'ChatContext'
    const url = `${NOCO_BASE_URL}/api/v1/db/data/noco/${contextTableName}`

    // First delete old context for this user
    const deleteUrl = `${NOCO_BASE_URL}/api/v1/db/data/noco/${contextTableName}?where=(userEmail,eq,${userEmail})`
    await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
    })

    // Save new context
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
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

    return {
      success: true,
      message: 'Context saved',
    }
  } catch (error: any) {
    console.error('Error saving conversation context:', error)
    // Don't throw - context saving is non-critical
    return {
      success: false,
      message: 'Context save failed (non-critical)',
    }
  }
}

/**
 * Load conversation context from NocoBase
 */
async function loadConversationContext(authToken: string): Promise<any> {
  const userEmail = extractEmailFromToken(authToken.replace('Bearer ', ''))
  if (!userEmail) {
    throw new Error('Could not extract user email from token')
  }

  try {
    const contextTableName = 'ChatContext'
    const url = `${NOCO_BASE_URL}/api/v1/db/data/noco/${contextTableName}?where=(userEmail,eq,${userEmail})`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // Context table might not exist yet, that's okay
      return {
        success: true,
        context: null,
      }
    }

    const data = await response.json()
    const row = data.list?.[0]

    if (!row || !row.contextData) {
      return {
        success: true,
        context: null,
      }
    }

    const context = JSON.parse(row.contextData)
    return {
      success: true,
      context,
    }
  } catch (error: any) {
    console.error('Error loading conversation context:', error)
    // Return null context on error, don't fail
    return {
      success: true,
      context: null,
    }
  }
}
