/**
 * VoltAgent Runtime Setup with VoltOps Integration
 * Initializes VoltAgent with briefing and consultant agents
 * Optimized for Vercel Serverless Functions
 */

import { createPinoLogger } from '@voltagent/logger'
import { briefingAgent, consultantAgent } from '../agents'

// Initialize logger for VoltOps integration
export const logger = createPinoLogger({
  name: 'sitesynth-agents',
  level: process.env.LOG_LEVEL || 'info',
})

/**
 * Send logs to VoltOps asynchronously (non-blocking)
 * Vercel: doesn't wait for completion, prevents timeouts
 */
async function sendLogToVoltOps(logData: any) {
  // Only send if API key is configured
  if (!process.env.VOLTAGENT_API_KEY) return

  try {
    // Fire-and-forget: don't await to avoid blocking response
    if (typeof globalThis !== 'undefined' && 'fetch' in globalThis) {
      // Async call without awaiting
      fetch('https://api.voltagent.dev/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VOLTAGENT_API_KEY}`,
        },
        body: JSON.stringify({
          projectId: process.env.VOLTAGENT_PROJECT_ID || 'sitesynth',
          ...logData,
        }),
      }).catch(err => {
        // Silently fail - don't throw in async context
        console.debug('VoltOps log send failed silently:', err.message)
      })
    }
  } catch (error: any) {
    // Silently fail - don't disrupt request
    console.debug('VoltOps integration error:', error.message)
  }
}

/**
 * VoltAgent Configuration
 * Initializes with telemetry and VoltOps integration
 */
export function initializeVoltAgent() {
  logger.info('🚀 Initializing VoltAgent runtime')

  // Agent registry
  const agents = {
    briefingAgent,
    consultantAgent,
  }

  logger.info(`✅ Registered ${Object.keys(agents).length} agents`, {
    agents: Object.keys(agents),
  })

  // VoltOps integration status
  if (process.env.VOLTAGENT_API_KEY) {
    logger.info('🔗 VoltOps telemetry enabled (async, non-blocking)', {
      apiKey: '***',
      projectId: process.env.VOLTAGENT_PROJECT_ID || 'sitesynth',
    })
  } else {
    logger.warn(
      '⚠️  VoltOps telemetry disabled. Set VOLTAGENT_API_KEY to enable observability.'
    )
  }

  return {
    agents,
    logger,
  }
}

// Singleton instance
let voltAgentInstance: ReturnType<typeof initializeVoltAgent> | null = null

/**
 * Get or create VoltAgent instance
 */
export function getVoltAgentInstance() {
  if (!voltAgentInstance) {
    voltAgentInstance = initializeVoltAgent()
  }
  return voltAgentInstance
}

/**
 * Get agent by name
 */
export function getAgent(name: 'briefingAgent' | 'consultantAgent') {
  const instance = getVoltAgentInstance()
  return instance.agents[name]
}

/**
 * Get logger instance
 */
export function getLogger() {
  const instance = getVoltAgentInstance()
  return instance.logger
}

/**
 * Log agent execution (non-blocking)
 * Safe for Vercel: async logs don't block response
 */
export function logAgentExecution(
  agentName: string,
  mode: 'active' | 'passive',
  userMessage: string,
  executionTime: number
) {
  const instance = getVoltAgentInstance()
  
  const logData = {
    type: 'agent_execution',
    agent: agentName,
    mode,
    messageLength: userMessage.length,
    executionTime,
    timestamp: new Date().toISOString(),
  }

  instance.logger.info('📊 Agent execution completed', logData)

  // Send to VoltOps asynchronously (fire-and-forget)
  sendLogToVoltOps(logData)
}

/**
 * Log agent error (non-blocking)
 * Safe for Vercel: async logs don't block response
 */
export function logAgentError(agentName: string, error: Error, context?: unknown) {
  const instance = getVoltAgentInstance()

  const logData = {
    type: 'agent_error',
    agent: agentName,
    error: error.message,
    errorStack: error.stack?.split('\n').slice(0, 3).join('\n'), // Limit stack trace
    context: context ? JSON.stringify(context).slice(0, 500) : undefined, // Limit size
    timestamp: new Date().toISOString(),
  }

  instance.logger.error('❌ Agent execution failed', logData)

  // Send to VoltOps asynchronously (fire-and-forget)
  sendLogToVoltOps(logData)
}
