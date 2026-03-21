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

const buildToolArgs = (schema, specSnapshot) => {
  if (!schema || typeof schema !== 'object') return {}
  const properties = schema.properties || {}
  const args = {}
  if (properties.spec) args.spec = specSnapshot
  if (properties.design_spec) args.design_spec = specSnapshot
  if (properties.specification) args.specification = specSnapshot
  if (properties.prompt && !args.prompt) {
    args.prompt = `Generate a Figma file from this design specification:\n${JSON.stringify(specSnapshot, null, 2)}`
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
