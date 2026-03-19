import { defineEventHandler, readBody, getHeader } from 'h3'
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
    return { success: false, error: 'Missing user email' }
  }

  if (event.method === 'GET') {
    // Get all briefs for user
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('[Briefs] Error fetching briefs:', error)
      return { success: true, data: [] } // Return empty array on error
    }
  }

  if (event.method === 'POST') {
    // Create new brief
    try {
      const body = await readBody(event)
      const { name, briefData, content } = body
      
      // 1. Create a new conversation for this brief first (since conversation_id is required)
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .insert([{
          user_email: userEmail,
          agent_type: 'briefing',
          title: name || 'Untitled Brief',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (convError || !convData?.[0]) {
        console.error('[Briefs] Error creating conversation for brief:', convError)
        throw new Error('Failed to create conversation')
      }

      // 2. Insert the brief using the correct schema fields
      const { data, error } = await supabase
        .from('briefs')
        .insert([{
          user_email: userEmail,
          conversation_id: convData[0].id,
          agent_type: 'briefing',
          brief_data: briefData || {},
          markdown_content: content || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      console.log(`[Briefs] Brief created for ${userEmail}`)
      return { success: true, data: data?.[0] || null }
    } catch (error) {
      console.error('[Briefs] Error creating brief:', error)
      return { success: false, error: 'Failed to create brief' }
    }
  }

  return { success: false, error: 'Method not allowed' }
})
