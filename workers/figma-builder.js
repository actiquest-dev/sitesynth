import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const logEvent = async (jobId, message, level = 'info', payload = null) => {
  await supabase.from('figma_build_events').insert({
    job_id: jobId,
    level,
    message,
    payload,
  })
}

const setJobStatus = async (jobId, status, patch = {}) => {
  await supabase.from('figma_build_jobs').update({
    status,
    updated_at: new Date().toISOString(),
    ...patch,
  }).eq('id', jobId)
}

const claimNextJob = async () => {
  const { data, error } = await supabase
    .from('figma_build_jobs')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  await setJobStatus(data.id, 'in_progress', { started_at: new Date().toISOString() })
  return data
}

const getFigmaMcpToken = async () => {
  if (process.env.FIGMA_MCP_ACCESS_TOKEN) {
    return process.env.FIGMA_MCP_ACCESS_TOKEN
  }
  const { data, error } = await supabase
    .from('service_integrations')
    .select('access_token')
    .eq('provider', 'figma_mcp')
    .eq('account_type', 'sitesynth_internal')
    .maybeSingle()
  if (error) throw error
  if (!data?.access_token) return null
  return data.access_token
}

const getMcpUrl = () => process.env.FIGMA_MCP_URL || 'https://mcp.figma.com/mcp'
const getMcpFrontConfig = () => {
  const url = process.env.MCP_FRONT_URL?.replace(/\/+$/, '')
  const token = process.env.MCP_FRONT_TOKEN
  return url && token ? { url, token } : null
}

const callMcpFront = async (serverName, payload) => {
  const config = getMcpFrontConfig()
  if (!config) {
    throw new Error('MCP front is not configured')
  }
  const response = await fetch(`${config.url}/${serverName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const rawBody = await response.text()
  let json
  try {
    json = JSON.parse(rawBody)
  } catch {
    json = null
  }
  if (!response.ok) {
    const message = json?.error?.message || json?.error || rawBody || `MCP front error (${response.status})`
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return json
}

const buildDesignPrompt = (specSnapshot) => {
  const spec = specSnapshot?.spec || specSnapshot
  const plan = specSnapshot?.build_plan || null
  const pages = Array.isArray(spec?.pages) ? spec.pages : []
  const pageLines = pages.map((page, index) => {
    const blocks = Array.isArray(page.ui_blocks) ? page.ui_blocks : []
    const blockLines = blocks.map((block) => {
      const content = Array.isArray(block.content) ? block.content.join('; ') : block.content
      const interactions = Array.isArray(block.interactions) ? block.interactions.join('; ') : block.interactions
      const states = Array.isArray(block.states) ? block.states.join('; ') : block.states
      return `- ${block.type}: ${block.description || ''}${content ? ` | Content: ${content}` : ''}${interactions ? ` | Interactions: ${interactions}` : ''}${states ? ` | States: ${states}` : ''}`.trim()
    })
    const notes = Array.isArray(page.notes_for_figma) ? page.notes_for_figma.join('; ') : page.notes_for_figma
    return [
      `${index + 1}. ${page.title || page.path || 'Page'}`,
      `Purpose: ${page.purpose || ''}`,
      `Primary goal: ${page.primary_user_goal || ''}`,
      `Success criteria: ${(page.success_criteria || []).join('; ')}`,
      `Key states: ${(page.key_states || []).join('; ')}`,
      `Content requirements: ${(page.content_requirements || []).join('; ')}`,
      blockLines.length ? `UI blocks:\n${blockLines.join('\n')}` : 'UI blocks: (none specified)',
      notes ? `Figma notes: ${notes}` : '',
    ].filter(Boolean).join('\n')
  })

  const theme = spec?.theme || {}
  const designDirection = spec?.design_direction || {}
  const figmaStructure = spec?.figma_structure || {}
  const figmaPages = Array.isArray(figmaStructure.pages) ? figmaStructure.pages : []

  const planLines = plan
    ? [
        'Agent build plan:',
        plan.project_summary ? `Summary: ${plan.project_summary}` : '',
        plan.design_system
          ? `Design system: colors (${(plan.design_system.colors || []).join('; ')}); typography (${(plan.design_system.typography || []).join('; ')}); components (${(plan.design_system.components || []).join('; ')}); spacing (${(plan.design_system.spacing || []).join('; ')})`
          : '',
        Array.isArray(plan.wireframes)
          ? `Wireframes: ${plan.wireframes.map((wf) => `${wf.name}: ${wf.frames?.join(', ')}`).join(' | ')}`
          : '',
        Array.isArray(plan.mockups)
          ? `Mockups: ${plan.mockups.map((mk) => `${mk.name}: ${mk.frames?.join(', ')}`).join(' | ')}`
          : '',
        Array.isArray(plan.page_map)
          ? `Page map: ${plan.page_map.map((p) => `${p.page}: ${p.sections?.join(', ')}`).join(' | ')}`
          : '',
        Array.isArray(plan.layout_rules) ? `Layout rules: ${plan.layout_rules.join('; ')}` : '',
        Array.isArray(plan.handoff_notes) ? `Handoff notes: ${plan.handoff_notes.join('; ')}` : '',
      ].filter(Boolean)
    : []

  return [
    'You are a senior product designer building a clean, production-ready Figma file.',
    'Follow the specification strictly. Do not invent unrelated screens.',
    ...planLines,
    '',
    'Design direction:',
    `- Visual style: ${designDirection.visual_style || 'n/a'}`,
    `- Interaction style: ${designDirection.interaction_style || 'n/a'}`,
    `- Content tone: ${designDirection.content_tone || 'n/a'}`,
    '',
    'Theme:',
    `- Colors: ${theme.colors ? JSON.stringify(theme.colors) : 'n/a'}`,
    `- Typography: ${theme.typography ? JSON.stringify(theme.typography) : 'n/a'}`,
    `- Components: ${(theme.components || []).join('; ')}`,
    '',
    'Figma file structure:',
    figmaPages.length
      ? figmaPages.map((page) => `- ${page.name}: ${page.purpose || ''} (${(page.contents || []).join('; ')})`).join('\n')
      : '- Use pages for: Design System, Wireframes, Mockups',
    '',
    'Pages to build:',
    pageLines.join('\n\n'),
  ].join('\n')
}

const buildToolArgs = (schema, specSnapshot) => {
  if (!schema || typeof schema !== 'object') return {}
  const properties = schema.properties || {}
  const args = {}
  if (properties.spec) args.spec = specSnapshot
  if (properties.design_spec) args.design_spec = specSnapshot
  if (properties.specification) args.specification = specSnapshot
  if (properties.prompt && !args.prompt) {
    args.prompt = buildDesignPrompt(specSnapshot)
  }
  if (properties.context && !args.context) {
    args.context = specSnapshot
  }
  return args
}

const runMcpGenerate = async (specSnapshot) => {
  const toolsList = await callMcpFront('figma', {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {},
  })

  const tools = toolsList?.result?.tools || []
  const generateTool = tools.find((tool) => tool.name === 'generate_figma_design')
  if (!generateTool) {
    throw new Error('Figma MCP tool generate_figma_design not found')
  }

  const args = buildToolArgs(generateTool.inputSchema || generateTool.input_schema, specSnapshot)
  const response = await callMcpFront('figma', {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'generate_figma_design',
      arguments: args,
    },
  })
  return response?.result || response
}

const runJob = async (job) => {
  await logEvent(job.id, 'Job claimed by worker')

  const specSnapshot = job.spec_snapshot || null
  if (!specSnapshot) {
    await logEvent(job.id, 'No spec snapshot attached to this job.', 'error')
    await setJobStatus(job.id, 'failed', {
      error_message: 'Missing spec snapshot',
      finished_at: new Date().toISOString(),
    })
    return
  }

  await logEvent(job.id, 'Calling Figma MCP to generate design')
  try {
    const result = await runMcpGenerate(specSnapshot)
    const figmaUrl =
      result?.figma_file_url ||
      result?.file_url ||
      result?.url ||
      result?.fileUrl ||
      null

    await logEvent(job.id, 'Figma MCP generation completed', 'info', {
      resultPreview: JSON.stringify(result, null, 2).slice(0, 2000),
    })

    await setJobStatus(job.id, 'completed', {
      figma_file_url: figmaUrl,
      finished_at: new Date().toISOString(),
    })
  } catch (error) {
    await logEvent(job.id, `Figma MCP generation failed: ${error.message || error}`, 'error')
    await setJobStatus(job.id, 'failed', {
      error_message: error.message || 'MCP generation failed',
      finished_at: new Date().toISOString(),
    })
  }
}

const main = async () => {
  // eslint-disable-next-line no-console
  console.log('[figma-builder] worker started')

  while (true) {
    try {
      const job = await claimNextJob()
      if (job) {
        await runJob(job)
      } else {
        await sleep(3000)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[figma-builder] error', error?.message || error)
      await sleep(5000)
    }
  }
}

main()
