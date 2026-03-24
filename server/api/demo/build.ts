import { defineEventHandler, readBody, getHeader } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'
import { buildDemoContract, buildDemoSlug, buildDemoTargetUrl, buildDemoWorkspacePath, summarizeDemoContract } from '~~/server/utils/demo-build'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')
  if (!userEmail) {
    return { success: false, error: 'Unauthorized' }
  }

  const body = await readBody(event)
  const briefId = body?.briefId
  if (!briefId) {
    return { success: false, error: 'Brief ID is required' }
  }

  const db = useDatabaseClient()
  const { data: brief, error: briefError } = await db
    .from('briefs')
    .select('id, user_email, brief_data, markdown_content, design_spec_json')
    .eq('id', briefId)
    .eq('user_email', userEmail)
    .maybeSingle()

  if (briefError) return { success: false, error: 'Failed to fetch brief' }
  if (!brief) return { success: false, error: 'Brief not found' }
  if (!brief.design_spec_json) {
    return { success: false, error: 'Design spec not found. Generate it first.' }
  }

  const projectName =
    brief.brief_data?.project_name
    || brief.brief_data?.project_title
    || brief.brief_data?.brand_name
    || brief.brief_data?.company_name
    || 'SiteSynth Demo'

  const slug = buildDemoSlug(projectName, brief.id)
  const buildContract = buildDemoContract(brief, slug)
  const specSnapshot = {
    brief: brief.brief_data,
    brief_markdown: brief.markdown_content,
    design_spec: brief.design_spec_json,
    reference_analysis: (brief as any).reference_analysis || brief.brief_data?.reference_analysis || null,
    build_contract: buildContract,
  }

  const { data: job, error: jobError } = await db
    .from('demo_build_jobs')
    .insert({
      brief_id: brief.id,
      user_email: userEmail,
      status: 'queued',
      current_stage: 'queued',
      provider: body?.provider || 'cline_executor',
      model_provider: body?.modelProvider || 'claude',
      priority: typeof body?.priority === 'number' ? body.priority : 100,
      slug,
      workspace_path: buildDemoWorkspacePath(slug),
      target_url: buildDemoTargetUrl(slug),
      build_contract: buildContract,
      execution_config: {
        executor: body?.provider || 'cline_executor',
        modelProvider: body?.modelProvider || 'claude',
        framework: buildContract.implementation.framework,
      },
      spec_snapshot: specSnapshot,
    })
    .select('id, slug, status, current_stage, target_url, workspace_path, provider, model_provider')
    .maybeSingle()

  if (jobError) return { success: false, error: 'Failed to queue build' }

  await db.from('demo_build_events').insert({
    job_id: job?.id,
    level: 'info',
    stage: 'queue',
    message: 'Demo build queued',
    payload: summarizeDemoContract(buildContract),
  })

  return {
    success: true,
    data: {
      jobId: job?.id,
      slug: job?.slug,
      status: job?.status,
      stage: job?.current_stage,
      url: job?.target_url,
      workspacePath: job?.workspace_path,
      provider: job?.provider,
      modelProvider: job?.model_provider,
    },
  }
})
