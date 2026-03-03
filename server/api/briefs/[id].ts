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
  const briefId = event.context.params?.id

  if (!userEmail) {
    return createError({ statusCode: 401, statusMessage: 'User email required' })
  }

  if (!briefId) {
    return createError({ statusCode: 400, statusMessage: 'Brief ID required' })
  }

  // PATCH /api/briefs/:id - update brief
  if (method === 'PATCH') {
    try {
      const body = await readBody(event)

      const { data, error } = await supabase
        .from('briefs')
        .update({
          brief_data: body.brief_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', briefId)
        .eq('user_email', userEmail)
        .select()

      if (error) {
        throw new Error(error.message)
      }

      if (!data || data.length === 0) {
        return createError({ statusCode: 404, statusMessage: 'Brief not found' })
      }

      return {
        status: 'success',
        data: data[0]
      }
    } catch (error: any) {
      console.error('[Briefs API] Error updating brief:', error)
      return createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
  }

  // DELETE /api/briefs/:id - delete brief
  if (method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', briefId)
        .eq('user_email', userEmail)

      if (error) {
        throw new Error(error.message)
      }

      return {
        status: 'success',
        message: 'Brief deleted'
      }
    } catch (error: any) {
      console.error('[Briefs API] Error deleting brief:', error)
      return createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
