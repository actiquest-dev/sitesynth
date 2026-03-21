import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3'
import { decodeOAuthState, upsertSharedFigmaIntegration } from '~~/server/utils/service-integrations'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string | undefined
  const state = query.state as string | undefined
  const error = query.error as string | undefined
  const errorDescription = query.error_description as string | undefined

  if (error) {
    throw createError({ statusCode: 400, statusMessage: errorDescription || error })
  }
  if (!code || !state) {
    throw createError({ statusCode: 400, statusMessage: 'Missing OAuth code or state' })
  }

  const decodedState = decodeOAuthState(state)
  const appBaseUrl = String(decodedState.appBaseUrl || '').replace(/\/+$/, '')
  const redirectUri = `${appBaseUrl}/api/admin/figma/oauth/callback`
  const clientId = process.env.FIGMA_OAUTH_CLIENT_ID
  const clientSecret = process.env.FIGMA_OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Figma OAuth credentials are not configured' })
  }

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
    throw createError({ statusCode: 500, statusMessage: tokenJson?.message || 'Failed to exchange Figma OAuth token' })
  }

  const expiresAt = tokenJson.expires_in
    ? new Date(Date.now() + Number(tokenJson.expires_in) * 1000).toISOString()
    : null

  await upsertSharedFigmaIntegration({
    app_base_url: appBaseUrl,
    connection_status: 'connected',
    access_token: tokenJson.access_token || null,
    refresh_token: tokenJson.refresh_token || null,
    expires_at: expiresAt,
    connected_account_id: tokenJson.user_id_string || null,
    connected_account_label: decodedState.requestedBy || 'Sitesynth internal Figma',
    scopes: ['mcp:connect'],
    connected_at: new Date().toISOString(),
    metadata: {
      token_type: tokenJson.token_type || null,
    },
  })

  return sendRedirect(event, `${appBaseUrl}/cabinet?tab=settings&figma=connected`, 302)
})
