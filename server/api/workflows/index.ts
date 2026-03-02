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

  // GET /api/workflows - Get workflows for agent type
  if (method === 'GET') {
    const agentType = getQuery(event).agentType as string

    if (!agentType || !['briefing', 'presale'].includes(agentType)) {
      return createError({ statusCode: 400, statusMessage: 'Invalid agent type' })
    }

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('agent_type', agentType)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      data: data || [],
    }
  }

  // POST /api/workflows - Create workflow (admin only)
  if (method === 'POST') {
    if (!isAdmin) {
      return createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const body = await readBody(event)

    if (!body.agentType || !body.name || !body.stepsJson) {
      return createError({ statusCode: 400, statusMessage: 'Agent type, name, and steps required' })
    }

    if (!['briefing', 'presale'].includes(body.agentType)) {
      return createError({ statusCode: 400, statusMessage: 'Invalid agent type' })
    }

    // Validate steps
    if (!Array.isArray(body.stepsJson) || body.stepsJson.length === 0) {
      return createError({ statusCode: 400, statusMessage: 'Steps must be a non-empty array' })
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert([
        {
          agent_type: body.agentType,
          name: body.name,
          description: body.description || null,
          steps_json: body.stepsJson,
          is_active: true,
        },
      ])
      .select()

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      message: 'Workflow created',
      data: data?.[0],
    }
  }

  // PUT /api/workflows/:id - Update workflow (admin only)
  if (method === 'PUT') {
    if (!isAdmin) {
      return createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const workflowId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!workflowId) {
      return createError({ statusCode: 400, statusMessage: 'Workflow ID required' })
    }

    const updateData: any = {}
    if (body.name) updateData.name = body.name
    if (body.description) updateData.description = body.description
    if (body.stepsJson) updateData.steps_json = body.stepsJson
    if (body.isActive !== undefined) updateData.is_active = body.isActive

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('workflows')
      .update(updateData)
      .eq('id', workflowId)
      .select()

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      message: 'Workflow updated',
      data: data?.[0],
    }
  }

  // DELETE /api/workflows/:id - Delete workflow (admin only)
  if (method === 'DELETE') {
    if (!isAdmin) {
      return createError({ statusCode: 403, statusMessage: 'Admin access required' })
    }

    const workflowId = getRouterParam(event, 'id')

    if (!workflowId) {
      return createError({ statusCode: 400, statusMessage: 'Workflow ID required' })
    }

    const { error } = await supabase
      .from('workflows')
      .update({ is_active: false })
      .eq('id', workflowId)

    if (error) {
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    return {
      status: 'success',
      message: 'Workflow deactivated',
    }
  }

  return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
