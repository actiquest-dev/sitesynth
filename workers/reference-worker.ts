import { createClient } from '@supabase/supabase-js'
import { runReferenceAnalysisPipeline } from '../server/utils/reference-research'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WORKER_ID = process.env.REFERENCE_WORKER_ID || 'reference-worker'
const SLEEP_MS = Number(process.env.REFERENCE_WORKER_SLEEP_MS || 5000)

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const claimNextJob = async () => {
  const { data: job } = await supabase
    .from('reference_jobs')
    .select('id, brief_id, user_email, attempts')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!job) return null

  const { data: claimed } = await supabase
    .from('reference_jobs')
    .update({
      status: 'running',
      claimed_by: WORKER_ID,
      claimed_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', job.id)
    .eq('status', 'queued')
    .select('id, brief_id, user_email')
    .maybeSingle()

  return claimed || null
}

const fetchBrief = async (briefId: string, userEmail: string) => {
  const { data: brief, error } = await supabase
    .from('briefs')
    .select('id, markdown_content, user_email')
    .eq('id', briefId)
    .eq('user_email', userEmail)
    .maybeSingle()

  if (error || !brief) {
    throw new Error(error?.message || 'Brief not found')
  }

  return brief
}

const appendLog = async (briefId: string, userEmail: string, entry: { level: string; message: string; payload?: any }) => {
  const { data: brief } = await supabase
    .from('briefs')
    .select('reference_analysis_json')
    .eq('id', briefId)
    .eq('user_email', userEmail)
    .maybeSingle()

  const existing = Array.isArray(brief?.reference_analysis_json?.logs)
    ? brief.reference_analysis_json.logs
    : []

  const next = [
    ...existing,
    {
      ts: new Date().toISOString(),
      level: entry.level,
      message: entry.message,
      ...(entry.payload ? { payload: entry.payload } : {}),
    },
  ]

  await supabase
    .from('briefs')
    .update({
      reference_analysis_json: { ...(brief?.reference_analysis_json || {}), logs: next },
      updated_at: new Date().toISOString(),
    })
    .eq('id', briefId)
    .eq('user_email', userEmail)
}

const markJobFailed = async (jobId: string, errorMessage: string) => {
  await supabase
    .from('reference_jobs')
    .update({
      status: 'failed',
      last_error: errorMessage,
      finished_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
}

const markJobComplete = async (jobId: string) => {
  await supabase
    .from('reference_jobs')
    .update({
      status: 'completed',
      finished_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', jobId)
}

const loop = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const job = await claimNextJob()
    if (!job) {
      await sleep(SLEEP_MS)
      continue
    }

    try {
      const brief = await fetchBrief(job.brief_id, job.user_email)
      await appendLog(brief.id, brief.user_email, { level: 'info', message: 'Reference job claimed by worker', payload: { jobId: job.id } })
      await runReferenceAnalysisPipeline({
        briefId: brief.id,
        userEmail: brief.user_email,
        markdownContent: brief.markdown_content || '',
      })
      await appendLog(brief.id, brief.user_email, { level: 'info', message: 'Reference analysis completed' })
      await markJobComplete(job.id)
    } catch (error: any) {
      const message = error?.message || 'Reference analysis failed'
      await appendLog(job.brief_id, job.user_email, { level: 'error', message })
      await markJobFailed(job.id, message)
    }
  }
}

loop().catch((err) => {
  console.error('[reference-worker] fatal:', err)
  process.exit(1)
})
