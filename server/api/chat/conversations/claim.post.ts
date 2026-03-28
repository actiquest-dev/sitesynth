import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
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
})
