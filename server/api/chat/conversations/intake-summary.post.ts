import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    throw createError({ statusCode: 401, statusMessage: 'User email required' })
  }

  const body = await readBody(event)
  const conversationId = body?.conversationId || body?.conversation_id
  const summary = body?.summary

  if (!conversationId || !summary) {
    throw createError({ statusCode: 400, statusMessage: 'conversationId and summary are required' })
  }

  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_email', userEmail)
    .single()

  if (conversationError || !conversation) {
    throw createError({ statusCode: 404, statusMessage: 'Conversation not found' })
  }

  await supabase
    .from('messages')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('role', 'system')
    .like('content', 'INTAKE SUMMARY:%')

  const { error: insertError } = await supabase
    .from('messages')
    .insert([{
      conversation_id: conversationId,
      role: 'system',
      content: `INTAKE SUMMARY:\n\n${summary}`,
    }])

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: insertError.message })
  }

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return { success: true }
})
