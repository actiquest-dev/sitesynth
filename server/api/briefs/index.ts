import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const userEmail = getHeader(event, 'x-user-email')

  if (!userEmail) {
    return createError({ statusCode: 401, statusMessage: 'User email required' })
  }

  // GET /api/briefs - get all briefs for user
  if (method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(error.message)
      }

      return {
        status: 'success',
        data: data || []
      }
    } catch (error: any) {
      console.error('[Briefs API] Error fetching briefs:', error)
      return createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
