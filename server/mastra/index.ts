/**
 * Mastra Runtime for SiteSynth
 * Replaces VoltAgent runtime with Mastra agent registry + logging
 */

import {
  briefingAgent,
  consultantAgent,
  figmaBuilderAgent,
  demoBuilderAgent,
  architectAgent,
  criticAgent,
  artDirectorAgent,
  referenceStrategistAgent,
  demoBuilderAgentFallback,
  artDirectorAgentFallback,
  referenceStrategistAgentFallback,
  figmaBuilderAgentFallback,
} from '../agents'

const agents = {
  briefingAgent,
  consultantAgent,
  figmaBuilderAgent,
  demoBuilderAgent,
  architectAgent,
  criticAgent,
  artDirectorAgent,
  referenceStrategistAgent,
  demoBuilderAgentFallback,
  artDirectorAgentFallback,
  referenceStrategistAgentFallback,
  figmaBuilderAgentFallback,
} as const

type AgentName = keyof typeof agents

export function getAgent(name: AgentName) {
  return agents[name]
}

export function getMastraInstance() {
  return { agents }
}

function isRateLimitError(err: unknown): boolean {
  const msg = (err as any)?.message || String(err)
  return (
    msg.includes('429') ||
    msg.includes('rate') ||
    msg.includes('quota') ||
    msg.includes('overloaded') ||
    msg.includes('Resource has been exhausted') ||
    msg.includes('RESOURCE_EXHAUSTED')
  )
}

/**
 * Calls primary agent with up to 3 retries (exponential backoff),
 * then falls back to the fallback agent if rate-limited.
 */
export async function generateWithFallback(
  primary: { generate: (...args: any[]) => Promise<any>; name?: string },
  fallback: { generate: (...args: any[]) => Promise<any>; name?: string },
  prompt: string,
  options?: any
): Promise<any> {
  const maxRetries = 3

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await primary.generate(prompt, options)
      if (attempt > 0) {
        console.info(`[mastra] Primary agent succeeded on attempt ${attempt + 1}`)
      }
      return result
    } catch (err) {
      if (isRateLimitError(err)) {
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 8000 // 8s, 16s, 32s
          console.warn(`[mastra] Rate limit on primary (attempt ${attempt + 1}). Waiting ${delay / 1000}s...`)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
        // Exhausted retries — fall through to fallback
        console.warn(`[mastra] Primary agent exhausted retries. Switching to fallback (2.0-pro)...`)
        break
      }
      // Non-rate-limit error — throw immediately
      throw err
    }
  }

  // Fallback to 2.0-pro
  console.info(`[mastra] Using fallback agent: ${fallback.name || 'fallback'}`)
  return await fallback.generate(prompt, options)
}

export function logAgentExecution(
  agentName: string,
  mode: string,
  userMessage: string,
  executionTime: number
) {
  console.info('[mastra] agent_execution', {
    agent: agentName,
    mode,
    messageLength: userMessage.length,
    executionTime,
    timestamp: new Date().toISOString(),
  })
}

export function logAgentError(agentName: string, error: Error, context?: unknown) {
  console.error('[mastra] agent_error', {
    agent: agentName,
    error: error.message,
    context: context ? JSON.stringify(context).slice(0, 500) : undefined,
    timestamp: new Date().toISOString(),
  })
}
