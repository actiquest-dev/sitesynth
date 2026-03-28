import { defineEventHandler, readBody, getHeader, getQuery, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Generate cryptographically secure token for conversation claims
 * Used to link anonymous conversations to authenticated users
 */
function generateSecureToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const path = event.node.req.url || ''

  // POST /api/chat/conversations/claim - Claim anonymous conversation for authenticated user
  if (method === 'POST' && path.includes('/claim')) {
    const userEmail = getHeader(event, 'x-user-email') || null
    const body = await readBody(event)
    const conversationId = body?.conversation_id || body?.conversationId
    const claimToken = body?.claim_token || body?.claimToken

    if (!userEmail) {
      return createError({ statusCode: 401, statusMessage: 'User email required' })
    }
    if (!conversationId || !claimToken) {
      return createError({ statusCode: 400, statusMessage: 'conversation_id and claim_token required' })
    }

    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, claim_token, user_email')
      .eq('id', conversationId)
      .maybeSingle()

    if (convError || !conversation) {
      return createError({ statusCode: 404, statusMessage: 'Conversation not found' })
    }
    if (conversation.user_email && conversation.user_email !== userEmail) {
      return createError({ statusCode: 403, statusMessage: 'Conversation already claimed' })
    }
    if (conversation.claim_token !== claimToken) {
      return createError({ statusCode: 403, statusMessage: 'Invalid claim token' })
    }

    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        user_email: userEmail,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', conversationId)

    if (updateError) {
      return createError({ statusCode: 500, statusMessage: updateError.message })
    }

    return {
      status: 'success',
      message: 'Conversation claimed',
      data: { id: conversationId },
    }
  }

  // GET /api/chat/conversations - Get conversations for user (authenticated or anonymous)
  if (method === 'GET') {
    const userEmail = getHeader(event, 'x-user-email') || null
    const deviceId = getHeader(event, 'x-device-id') || null
    const agentType = getQuery(event).agentType as string

    if (!userEmail && !deviceId) {
      return createError({ statusCode: 401, statusMessage: 'x-user-email or x-device-id required' })
    }

    let query = supabase
      .from('conversations')
      .select('*')

    // Filter by ownership: email for authenticated, device_id for anonymous
    if (userEmail) {
      query = query.eq('user_email', userEmail)
    } else {
      query = query.eq('device_id', deviceId)
    }

    if (agentType) {
      query = query.eq('agent_type', agentType)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      data: data || [],
    }
  }

  // POST /api/chat/conversations - Create new conversation (anonymous or authenticated)
  if (method === 'POST') {
    const userEmail = getHeader(event, 'x-user-email') || null
    const deviceId = getHeader(event, 'x-device-id') || null
    const body = await readBody(event)

    // ✅ Must have either device_id (anonymous) OR user_email (authenticated)
    if (!deviceId && !userEmail) {
      return createError({
        statusCode: 401,
        statusMessage: 'Either x-device-id (anonymous) or x-user-email (authenticated) required',
      })
    }

    if (!body.agentType || !['briefing', 'presale'].includes(body.agentType)) {
      return createError({ statusCode: 400, statusMessage: 'Invalid agent type' })
    }

    // Generate secure claim token for anonymous conversations
    const claimToken = generateSecureToken()

    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          device_id: deviceId || null,
          user_email: userEmail || null,
          agent_type: body.agentType,
          workflow_id: body.workflowId || null,
          title: body.title || `Chat - ${new Date().toLocaleDateString()}`,
          claim_token: claimToken,
          claimed_at: null,
        },
      ])
      .select()

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    const conversation = data?.[0]

    return {
      status: 'success',
      message: 'Conversation created',
      data: {
        id: conversation?.id,
        device_id: conversation?.device_id,
        user_email: conversation?.user_email,
        agent_type: conversation?.agent_type,
        claim_token: claimToken, // ← Return token to client for later registration
      },
    }
  }

  // DELETE /api/chat/conversations - Delete conversation
  if (method === 'DELETE') {
    const userEmail = getHeader(event, 'x-user-email')
    const body = await readBody(event)
    const conversationId = body?.conversationId || body?.conversation_id

    if (!userEmail) {
      return createError({ statusCode: 401, statusMessage: 'User email required' })
    }

    if (!conversationId) {
      return createError({ statusCode: 400, statusMessage: 'Conversation ID required' })
    }

    const { data: existing, error: checkError } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_email', userEmail)
      .single()

    if (checkError || !existing) {
      return createError({ statusCode: 404, statusMessage: 'Conversation not found' })
    }

    const { error: deleteMessagesError } = await supabase
      .from('messages')
      .delete()
      .eq('conversation_id', conversationId)

    if (deleteMessagesError) {
      return createError({ statusCode: 500, statusMessage: deleteMessagesError.message })
    }

    const { error: deleteConversationError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_email', userEmail)

    if (deleteConversationError) {
      return createError({ statusCode: 500, statusMessage: deleteConversationError.message })
    }

    return {
      status: 'success',
      message: 'Conversation deleted',
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
