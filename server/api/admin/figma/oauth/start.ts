import crypto from 'node:crypto'
import { defineEventHandler, createError } from 'h3'
import { resolveAdminEmail } from '~~/server/utils/admin'
import { requireAdminSession } from '~~/server/utils/admin-session'
import { encodeOAuthState, getDefaultAppBaseUrl, getFigmaRedirectUri, getSharedFigmaIntegration } from '~~/server/utils/service-integrations'

export default defineEventHandler(async (event) => {
  const admin = await requireAdminSession(event)

  const integration = await getSharedFigmaIntegration()
  const appBaseUrl = integration?.app_base_url || getDefaultAppBaseUrl()
  const redirectUri = getFigmaRedirectUri(appBaseUrl)
  const clientId = process.env.FIGMA_OAUTH_CLIENT_ID

  if (!clientId) {
    throw createError({ statusCode: 500, statusMessage: 'FIGMA_OAUTH_CLIENT_ID not configured' })
  }

  const state = encodeOAuthState({
    nonce: crypto.randomUUID(),
    requestedBy: admin.email || resolveAdminEmail(),
    appBaseUrl,
    createdAt: Date.now(),
  })

  const scope = ['mcp:connect']
  const authUrl = new URL('https://www.figma.com/oauth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('scope', scope.join(','))
  authUrl.searchParams.set('state', state)
  authUrl.searchParams.set('response_type', 'code')

  return {
    success: true,
    data: {
      authUrl: authUrl.toString(),
    },
  }
})
