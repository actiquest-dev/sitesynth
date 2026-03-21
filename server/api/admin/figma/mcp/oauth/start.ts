import crypto from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { requireAdminSession } from '~~/server/utils/admin-session'
import { encodeOAuthState, getDefaultAppBaseUrl } from '~~/server/utils/service-integrations'
import { discoverMcpOAuth, generatePkce, registerMcpClient } from '~~/server/utils/figma-mcp-oauth'
import { upsertSharedFigmaMcpIntegration } from '~~/server/utils/service-integrations'

export default defineEventHandler(async (event) => {
  const admin = await requireAdminSession(event)

  const mcpUrl = process.env.FIGMA_MCP_URL || 'https://mcp.figma.com/mcp'
  const appBaseUrl = getDefaultAppBaseUrl()
  const redirectUri = `${appBaseUrl.replace(/\/+$/, '')}/api/admin/figma/mcp/oauth/callback`

  let discovery
  try {
    discovery = await discoverMcpOAuth(mcpUrl)
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to discover MCP OAuth endpoints' })
  }

  const { verifier, challenge } = generatePkce()
  let clientId = process.env.FIGMA_MCP_CLIENT_ID || null

  if (!clientId && discovery.registration_endpoint) {
    const registration = await registerMcpClient(discovery.registration_endpoint, redirectUri)
    clientId = registration.client_id
  }

  if (!clientId) {
    throw createError({ statusCode: 500, statusMessage: 'FIGMA_MCP_CLIENT_ID not configured and no registration endpoint available' })
  }

  await upsertSharedFigmaMcpIntegration({
    connection_status: 'pending',
    oauth_issuer: discovery.issuer,
    oauth_authorization_endpoint: discovery.authorization_endpoint,
    oauth_token_endpoint: discovery.token_endpoint,
    oauth_client_id: clientId,
    updated_at: new Date().toISOString(),
  })

  const state = encodeOAuthState({
    nonce: crypto.randomUUID(),
    requestedBy: admin.email,
    appBaseUrl,
    codeVerifier: verifier,
    clientId,
    tokenEndpoint: discovery.token_endpoint,
    redirectUri,
    createdAt: Date.now(),
  })

  const authUrl = new URL(discovery.authorization_endpoint)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('code_challenge', challenge)
  authUrl.searchParams.set('code_challenge_method', 'S256')
  authUrl.searchParams.set('scope', 'mcp:connect')
  authUrl.searchParams.set('state', state)

  return {
    success: true,
    data: {
      authUrl: authUrl.toString(),
    },
  }
})
