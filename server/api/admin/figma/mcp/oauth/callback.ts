import { defineEventHandler, getQuery, sendRedirect, createError } from 'h3'
import { decodeOAuthState, upsertSharedFigmaMcpIntegration } from '~~/server/utils/service-integrations'

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
  const tokenEndpoint = decodedState.tokenEndpoint as string
  const clientId = decodedState.clientId as string
  const codeVerifier = decodedState.codeVerifier as string
  const redirectUri = decodedState.redirectUri as string

  const tokenRes = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  const tokenJson = await tokenRes.json().catch(() => ({}))
  if (!tokenRes.ok) {
    throw createError({ statusCode: 500, statusMessage: tokenJson?.error_description || tokenJson?.error || 'Failed to exchange MCP OAuth token' })
  }

  const expiresAt = tokenJson.expires_in
    ? new Date(Date.now() + Number(tokenJson.expires_in) * 1000).toISOString()
    : null

  await upsertSharedFigmaMcpIntegration({
    connection_status: 'connected',
    access_token: tokenJson.access_token || null,
    refresh_token: tokenJson.refresh_token || null,
    expires_at: expiresAt,
    connected_account_label: decodedState.requestedBy || 'Sitesynth Figma MCP',
    connected_at: new Date().toISOString(),
    metadata: {
      token_type: tokenJson.token_type || null,
      scope: tokenJson.scope || null,
    },
  })

  const appBaseUrl = String(decodedState.appBaseUrl || '').replace(/\/+$/, '')
  return sendRedirect(event, `${appBaseUrl}/admin/integrations?figma_mcp=connected`, 302)
})
