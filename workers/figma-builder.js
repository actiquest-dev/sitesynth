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

const runJob = async (job) => {
  await logEvent(job.id, 'Job claimed by worker')

  const accessToken = await getFigmaMcpToken()
  const mcpUrl = getMcpUrl()
  if (!accessToken) {
    await logEvent(job.id, 'Figma MCP token is not configured.', 'error')
    await setJobStatus(job.id, 'blocked', {
      error_message: 'Figma MCP token not configured',
      finished_at: new Date().toISOString(),
    })
    return
  }

  // TODO: Implement MCP build flow here.
  await logEvent(job.id, `MCP build not implemented yet. Ready to call ${mcpUrl}`, 'error')
  await setJobStatus(job.id, 'failed', {
    error_message: 'MCP build not implemented',
    finished_at: new Date().toISOString(),
  })
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
