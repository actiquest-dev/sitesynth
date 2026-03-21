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

const getFigmaClientCredentials = () => {
  const clientId = process.env.FIGMA_OAUTH_CLIENT_ID
  const clientSecret = process.env.FIGMA_OAUTH_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('Figma OAuth credentials are not configured')
  }
  return { clientId, clientSecret }
}

export const exchangeFigmaOAuthCode = async (code: string, redirectUri: string) => {
  const { clientId, clientSecret } = getFigmaClientCredentials()
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const tokenRes = await fetch('https://api.figma.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      redirect_uri: redirectUri,
      code,
      grant_type: 'authorization_code',
    }),
  })

  const tokenJson = await tokenRes.json().catch(() => ({}))
  if (!tokenRes.ok) {
    throw new Error(tokenJson?.message || 'Failed to exchange Figma OAuth token')
  }
  return tokenJson
}

export const refreshSharedFigmaToken = async () => {
  const integration = await getSharedFigmaIntegration()
  if (!integration?.refresh_token) {
    throw new Error('No shared Figma refresh token is stored')
  }

  const { clientId, clientSecret } = getFigmaClientCredentials()
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const tokenRes = await fetch('https://api.figma.com/v1/oauth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      refresh_token: integration.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  const tokenJson = await tokenRes.json().catch(() => ({}))
  if (!tokenRes.ok) {
    await upsertSharedFigmaIntegration({
      connection_status: 'reconnect_required',
      metadata: {
        ...(integration.metadata || {}),
        last_refresh_error: tokenJson?.message || 'refresh_failed',
      },
    })
    throw new Error(tokenJson?.message || 'Failed to refresh Figma OAuth token')
  }

  const expiresAt = tokenJson.expires_in
    ? new Date(Date.now() + Number(tokenJson.expires_in) * 1000).toISOString()
    : integration.expires_at

  return await upsertSharedFigmaIntegration({
    connection_status: 'connected',
    access_token: tokenJson.access_token || integration.access_token,
    refresh_token: tokenJson.refresh_token || integration.refresh_token,
    expires_at: expiresAt,
    metadata: {
      ...(integration.metadata || {}),
      token_type: tokenJson.token_type || integration.metadata?.token_type || null,
      last_refresh_at: new Date().toISOString(),
    },
  })
}

export const getValidSharedFigmaAccessToken = async () => {
  const integration = await getSharedFigmaIntegration()
  if (!integration?.access_token) {
    throw new Error('Shared Figma connection is not configured')
  }

  const expiresAt = integration.expires_at ? new Date(integration.expires_at).getTime() : null
  const shouldRefresh = !expiresAt || (expiresAt - Date.now()) < 5 * 60 * 1000

  if (!shouldRefresh) {
    return {
      accessToken: integration.access_token,
      integration,
      refreshed: false,
    }
  }

  const refreshedIntegration = await refreshSharedFigmaToken()
  return {
    accessToken: refreshedIntegration.access_token,
    integration: refreshedIntegration,
    refreshed: true,
  }
}
