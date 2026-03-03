import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface WorkflowStep {
  step: number
  prompt: string
}

interface Workflow {
  id: string
  name: string
  description: string
  steps_json: WorkflowStep[]
  agent_type: string
}

/**
 * Load active workflow for an agent type
 * Returns the first active workflow for that agent
 */
export async function getActiveWorkflow(agentType: 'briefing' | 'presale'): Promise<Workflow | null> {
  try {
    console.log(`[Workflow] Loading active workflow for agent: ${agentType}`)
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('agent_type', agentType)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error?.code === 'PGRST116') {
      console.log(`[Workflow] No active workflow found for ${agentType}`)
      return null
    }

    if (error) {
      console.error('[Workflow] Error loading workflow:', error)
      return null
    }

    console.log(`[Workflow] ✅ Loaded workflow: ${data.name}`)
    return data as Workflow
  } catch (err) {
    console.error('[Workflow] Unexpected error loading workflow:', err)
    return null
  }
}

/**
 * Get the current step prompt based on message count
 * Messages are in pairs (user, assistant), so we determine step index
 */
export function getCurrentStepPrompt(workflow: Workflow | null, messageCount: number): string | null {
  if (!workflow || !workflow.steps_json || workflow.steps_json.length === 0) {
    return null
  }

  // Conversation pairs: every 2 messages = 1 round
  // Round 0 = step 0, Round 1 = step 1, etc.
  const conversationRound = Math.floor(messageCount / 2)
  
  // Clamp to available steps
  const stepIndex = Math.min(conversationRound, workflow.steps_json.length - 1)
  const currentStep = workflow.steps_json[stepIndex]

  return currentStep ? currentStep.prompt : null
}

/**
 * Build enhanced system prompt with workflow context
 */
export function buildWorkflowSystemPrompt(basePrompt: string, workflow: Workflow | null, currentStepPrompt: string | null): string {
  if (!workflow || !currentStepPrompt) {
    return basePrompt
  }

  return `${basePrompt}

## CURRENT WORKFLOW: ${workflow.name}
${workflow.description ? `Description: ${workflow.description}` : ''}

### Current Step:
${currentStepPrompt}

Focus on this step before moving to the next part of the workflow.`
}
