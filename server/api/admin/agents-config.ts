import { defineEventHandler, readBody, createError } from 'h3'
import { agentConfigs, updateAgentConfig } from '~~/server/utils/agent-config'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return {
      status: 'success',
      data: agentConfigs
    }
  }

  // POST: Update agent configuration
  if (event.node.req.method === 'POST') {
    const body = await readBody(event)
    
    if (!body.agentType || !['briefingAgent', 'consultantAgent'].includes(body.agentType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid agent type. Must be "briefingAgent" or "consultantAgent"'
      })
    }

    // Validate payload
    const allowedFields = ['name', 'temperature', 'maxTokens', 'systemPrompt', 'model']
    const updatePayload: Record<string, any> = {}
    
    for (const field of allowedFields) {
      if (field in body) {
        if (field === 'temperature' && (body[field] < 0 || body[field] > 1)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Temperature must be between 0 and 1'
          })
        }
        if (field === 'maxTokens' && body[field] < 100) {
          throw createError({
            statusCode: 400,
            statusMessage: 'maxTokens must be at least 100'
          })
        }
        updatePayload[field] = body[field]
      }
    }

    // Update configuration
    const updated = updateAgentConfig(body.agentType as 'briefingAgent' | 'consultantAgent', updatePayload)

    return {
      status: 'success',
      message: `${body.agentType} updated successfully`,
      data: updated
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
