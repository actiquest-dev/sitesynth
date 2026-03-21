import { defineEventHandler, readBody } from 'h3'
import { requireAdminSession } from '~~/server/utils/admin-session'
import { getDefaultAppBaseUrl, getSharedFigmaMcpIntegration, upsertSharedFigmaMcpIntegration } from '~~/server/utils/service-integrations'

const getMcpFrontConfig = () => {
  const url = process.env.MCP_FRONT_URL?.replace(/\/+$/, '')
  const token = process.env.MCP_FRONT_TOKEN
  return url && token ? { url, token } : null
}

const probeMcpFront = async () => {
  const config = getMcpFrontConfig()
  if (!config) return null
  const response = await fetch(`${config.url}/health`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'text/event-stream',
    },
  })
  return response.ok ? response : null
}

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  if (event.node.req.method === 'PUT') {
    const body = await readBody(event)
    const appBaseUrl = body?.appBaseUrl?.trim() || getDefaultAppBaseUrl()
    const redirectUri = `${appBaseUrl.replace(/\/+$/, '')}/api/admin/figma/mcp/oauth/callback`
    const saved = await upsertSharedFigmaMcpIntegration({
      app_base_url: appBaseUrl,
      redirect_uri: redirectUri,
    })
    return { success: true, data: { appBaseUrl: saved.app_base_url, redirectUri: saved.redirect_uri } }
  }

  const integration = await getSharedFigmaMcpIntegration()
  const appBaseUrl = integration?.app_base_url || getDefaultAppBaseUrl()
  const redirectUri = integration?.redirect_uri || `${appBaseUrl.replace(/\/+$/, '')}/api/admin/figma/mcp/oauth/callback`
  let connected = Boolean(integration?.access_token)
  let status = integration?.connection_status || 'disconnected'
  let connectedAt = integration?.connected_at || null

  if (!connected) {
    const mcpFrontResponse = await probeMcpFront()
    if (mcpFrontResponse) {
      connected = true
      status = 'connected'
      connectedAt = connectedAt || new Date().toISOString()
      await upsertSharedFigmaMcpIntegration({
        connection_status: 'connected',
        connected_at: connectedAt,
        metadata: {
          ...(integration?.metadata || {}),
          connected_via: 'mcp_front',
          last_probe_at: new Date().toISOString(),
        },
      })
    }
  }
  return {
    success: true,
    data: {
      connected,
      status,
      appBaseUrl,
      redirectUri,
      connectedAt,
      expiresAt: integration?.expires_at || null,
    },
  }
})
