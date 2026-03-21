import crypto from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

export const serviceIntegrations = createClient(supabaseUrl, supabaseServiceKey)

export const FIGMA_PROVIDER = 'figma'
export const SHARED_ACCOUNT_TYPE = 'sitesynth_internal'

export const getDefaultAppBaseUrl = () =>
  process.env.PUBLIC_APP_URL || process.env.SITE_URL || 'https://sitesynth-eight.vercel.app'

export const getFigmaRedirectUri = (appBaseUrl?: string | null) => {
  const base = (appBaseUrl || getDefaultAppBaseUrl()).replace(/\/+$/, '')
  return `${base}/api/admin/figma/oauth/callback`
}

const getStateSecret = () => process.env.FIGMA_OAUTH_STATE_SECRET || process.env.NUXT_SESSION_PASSWORD || 'local-figma-oauth-secret'

export const encodeOAuthState = (payload: Record<string, any>) => {
  const json = JSON.stringify(payload)
  const body = Buffer.from(json).toString('base64url')
  const signature = crypto.createHmac('sha256', getStateSecret()).update(body).digest('base64url')
  return `${body}.${signature}`
}

export const decodeOAuthState = (state: string) => {
  const [body, signature] = state.split('.')
  if (!body || !signature) throw new Error('Invalid OAuth state format')
  const expected = crypto.createHmac('sha256', getStateSecret()).update(body).digest('base64url')
  if (expected !== signature) throw new Error('Invalid OAuth state signature')
  return JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'))
}

export const getSharedFigmaIntegration = async () => {
  const { data, error } = await serviceIntegrations
    .from('service_integrations')
    .select('*')
    .eq('provider', FIGMA_PROVIDER)
    .eq('account_type', SHARED_ACCOUNT_TYPE)
    .maybeSingle()

  if (error) throw error
  return data
}

export const upsertSharedFigmaIntegration = async (patch: Record<string, any>) => {
  const payload = {
    provider: FIGMA_PROVIDER,
    account_type: SHARED_ACCOUNT_TYPE,
    updated_at: new Date().toISOString(),
    ...patch,
  }

  const { data, error } = await serviceIntegrations
    .from('service_integrations')
    .upsert(payload, { onConflict: 'provider,account_type' })
    .select()
    .single()

  if (error) throw error
  return data
}
