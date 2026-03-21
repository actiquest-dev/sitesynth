import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdminSession } from '~~/server/utils/admin-session'
import { getDefaultAppBaseUrl, getFigmaRedirectUri, getSharedFigmaIntegration, upsertSharedFigmaIntegration } from '~~/server/utils/service-integrations'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  if (event.method === 'GET') {
    const integration = await getSharedFigmaIntegration()
    const appBaseUrl = integration?.app_base_url || getDefaultAppBaseUrl()

    return {
      success: true,
      data: {
        connected: integration?.connection_status === 'connected',
        status: integration?.connection_status || 'disconnected',
        appBaseUrl,
        redirectUri: getFigmaRedirectUri(appBaseUrl),
        connectedAt: integration?.connected_at || null,
        expiresAt: integration?.expires_at || null,
        connectedAccountLabel: integration?.connected_account_label || null,
        connectedAccountId: integration?.connected_account_id || null,
        scopes: integration?.scopes || [],
      },
    }
  }

  if (event.method === 'PUT') {
    const body = await readBody(event)
    const appBaseUrl = String(body?.appBaseUrl || '').trim().replace(/\/+$/, '')
    if (!appBaseUrl.startsWith('http://') && !appBaseUrl.startsWith('https://')) {
      throw createError({ statusCode: 400, statusMessage: 'Valid appBaseUrl is required' })
    }

    const integration = await upsertSharedFigmaIntegration({
      app_base_url: appBaseUrl,
      connection_status: (await getSharedFigmaIntegration())?.connection_status || 'disconnected',
    })

    return {
      success: true,
      data: {
        appBaseUrl: integration.app_base_url,
        redirectUri: getFigmaRedirectUri(integration.app_base_url),
      },
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
