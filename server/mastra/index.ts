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
  referenceStrategistAgent,
} from '../agents'

const agents = {
  briefingAgent,
  consultantAgent,
  figmaBuilderAgent,
  demoBuilderAgent,
  architectAgent,
  criticAgent,
  referenceStrategistAgent,
} as const

type AgentName = keyof typeof agents

export function getAgent(name: AgentName) {
  return agents[name]
}

export function getMastraInstance() {
  return { agents }
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
