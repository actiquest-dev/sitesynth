import { defineEventHandler, readBody, getHeader, getQuery, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  // GET /api/chat/conversations - Get user conversations
  if (method === 'GET') {
    const userEmail = getHeader(event, 'x-user-email')
    const agentType = getQuery(event).agentType as string

    if (!userEmail) {
      return createError({ statusCode: 401, statusMessage: 'User email required' })
    }

    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_email', userEmail)

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

  // POST /api/chat/conversations - Create new conversation
  if (method === 'POST') {
    const userEmail = getHeader(event, 'x-user-email')
    const body = await readBody(event)

    if (!userEmail) {
      return createError({ statusCode: 401, statusMessage: 'User email required' })
    }

    if (!body.agentType || !['briefing', 'presale'].includes(body.agentType)) {
      return createError({ statusCode: 400, statusMessage: 'Invalid agent type' })
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert([
        {
          user_email: userEmail,
          agent_type: body.agentType,
          workflow_id: body.workflowId || null,
          title: body.title || `Chat - ${new Date().toLocaleDateString()}`,
        },
      ])
      .select()

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      message: 'Conversation created',
      data: data?.[0],
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
