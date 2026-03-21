import { defineEventHandler, getRouterParam, getHeader, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const userEmail = getHeader(event, 'x-user-email')

  if (!id || !userEmail) {
    return createError({ statusCode: 400, statusMessage: 'Missing id or user email' })
  }

  if (event.method !== 'GET') {
    return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  try {
    const { data: brief, error: briefError } = await supabase
      .from('briefs')
      .select('id, name, brief_data, markdown_content, updated_at, created_at')
      .eq('id', id)
      .eq('user_email', userEmail)
      .single()

    if (briefError || !brief) throw briefError || new Error('Brief not found')

    const { data: versions, error: versionsError } = await supabase
      .from('brief_versions')
      .select('*')
      .eq('brief_id', id)
      .eq('user_email', userEmail)
      .order('version', { ascending: false })

    if (versionsError) throw versionsError

    const currentVersion = {
      id: `current-${brief.id}`,
      brief_id: brief.id,
      name: brief.name || 'Untitled Brief',
      brief_data: brief.brief_data || {},
      markdown_content: brief.markdown_content || '',
      version: (versions?.[0]?.version || 0) + 1,
      source: 'current',
      created_at: brief.updated_at || brief.created_at,
      is_current: true,
    }

    return {
      success: true,
      data: [currentVersion, ...(versions || []).map(v => ({ ...v, is_current: false }))],
    }
  } catch (error) {
    console.error('[Brief Versions] Error fetching versions:', error)
    return { success: false, error: 'Failed to fetch brief versions' }
  }
})
