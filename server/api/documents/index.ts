import { defineEventHandler, readBody } from 'h3'
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
  
  // Check if user is admin
  const isAdmin = userEmail === process.env.ADMIN_EMAIL || userEmail?.includes('admin')

  // GET /api/documents - Get documents for agent type
  if (method === 'GET') {
    const agentType = getQuery(event).agentType as string

    if (!agentType || !['briefing', 'presale'].includes(agentType)) {
      return createError({ statusCode: 400, statusMessage: 'Invalid agent type' })
    }

    const { data, error } = await supabase
      .from('documents')
      .select('id, title, metadata, created_at, created_by')
      .eq('agent_type', agentType)
      .order('created_at', { ascending: false })

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      data: data || [],
    }
  }

  // POST /api/documents - Upload document (admin only)
  if (method === 'POST') {
    if (!isAdmin) {
      return createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const body = await readBody(event)

    if (!body.agentType || !body.title || !body.content) {
      return createError({ statusCode: 400, statusMessage: 'Agent type, title, and content required' })
    }

    if (!['briefing', 'presale'].includes(body.agentType)) {
      return createError({ statusCode: 400, statusMessage: 'Invalid agent type' })
    }

    const { data, error } = await supabase
      .from('documents')
      .insert([
        {
          agent_type: body.agentType,
          title: body.title,
          content: body.content,
          metadata: body.metadata || {},
          created_by: userEmail,
        },
      ])
      .select()

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      message: 'Document uploaded',
      data: data?.[0],
    }
  }

  // DELETE /api/documents/:id - Delete document (admin only)
  if (method === 'DELETE') {
    if (!isAdmin) {
      return createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const documentId = getRouterParam(event, 'id')

    if (!documentId) {
      return createError({ statusCode: 400, statusMessage: 'Document ID required' })
    }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      message: 'Document deleted',
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
