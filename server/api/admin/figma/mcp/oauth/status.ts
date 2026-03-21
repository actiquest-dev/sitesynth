import { defineEventHandler, readBody } from 'h3'
import { requireAdminSession } from '~~/server/utils/admin-session'
import { getDefaultAppBaseUrl, getSharedFigmaMcpIntegration, upsertSharedFigmaMcpIntegration } from '~~/server/utils/service-integrations'

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
  return {
    success: true,
    data: {
      connected: Boolean(integration?.access_token),
      status: integration?.connection_status || 'disconnected',
      appBaseUrl,
      redirectUri,
      connectedAt: integration?.connected_at || null,
      expiresAt: integration?.expires_at || null,
    },
  }
})
