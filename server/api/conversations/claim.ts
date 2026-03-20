// POST /api/conversations/claim
// Links an anonymous presale conversation to a registered user's email.
// Called after login/registration when a presale_conversation_id is found in localStorage.

import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return { success: false, error: 'Method not allowed' }
  }

  const body = await readBody(event)
  const { conversation_id, user_email } = body

  if (!conversation_id || !user_email) {
    return { success: false, error: 'conversation_id and user_email are required' }
  }

  // Only claim if conversation exists and has no owner yet (anonymous)
  const { data: conv, error: fetchError } = await supabase
    .from('conversations')
    .select('id, user_email')
    .eq('id', conversation_id)
    .single()

  if (fetchError || !conv) {
    return { success: false, error: 'Conversation not found' }
  }

  if (conv.user_email && conv.user_email !== 'anonymous' && conv.user_email !== user_email) {
    // Already claimed by a different user — skip silently
    return { success: true, claimed: false, reason: 'already_owned' }
  }

  // Link conversation to user
  const { error: updateError } = await supabase
    .from('conversations')
    .update({ user_email, updated_at: new Date().toISOString() })
    .eq('id', conversation_id)

  if (updateError) {
    console.error('[Claim] Failed to claim conversation:', updateError)
    return { success: false, error: updateError.message }
  }

  console.log(`[Claim] ✓ Conversation ${conversation_id} claimed by ${user_email}`)
  return { success: true, claimed: true }
})
