import { defineEventHandler, readBody } from 'h3'

// Current agent configurations in memory
let agentConfigs = {
  briefingAgent: {
    name: 'Viz - Briefing Specialist',
    model: 'google("gemini-2.5-pro")',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'You are Viz, a Briefing Specialist for the Cabinet active mode. Your role is to help develop comprehensive briefings and strategic overviews.'
  },
  consultantAgent: {
    name: 'Viz - General Consultant',
    model: 'google("gemini-2.5-pro")',
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: 'You are Viz, a General Consultant for the website passive mode. Your role is to provide guidance, answer questions, and offer consultation.'
  }
}

// GET: Retrieve current agent configurations
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
    agentConfigs[body.agentType as keyof typeof agentConfigs] = {
      ...agentConfigs[body.agentType as keyof typeof agentConfigs],
      ...updatePayload
    }

    return {
      status: 'success',
      message: `${body.agentType} updated successfully`,
      data: agentConfigs[body.agentType as keyof typeof agentConfigs]
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
