import { defineEventHandler, createError } from 'h3'
import { requireAdminSession } from '~~/server/utils/admin-session'
import { getFigmaMcpAccessToken, upsertSharedFigmaMcpIntegration } from '~~/server/utils/service-integrations'

const getMcpFrontConfig = () => {
  const url = process.env.MCP_FRONT_URL?.replace(/\/+$/, '')
  const token = process.env.MCP_FRONT_TOKEN
  return url && token ? { url, token } : null
}

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  try {
    try {
      const integration = await getFigmaMcpAccessToken()
      const accessToken = integration.access_token
      const probePayload = {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-03-26',
          capabilities: {},
          clientInfo: {
            name: 'sitesynth-admin-probe',
            version: '0.1.0',
          },
        },
      }

      const mcpUrl = process.env.FIGMA_MCP_URL || 'https://mcp.figma.com/mcp'
      const response = await fetch(mcpUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
        },
        body: JSON.stringify(probePayload),
      })

      const rawBody = await response.text()

      return {
        success: response.ok,
        data: {
          status: response.status,
          ok: response.ok,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          bodyPreview: rawBody.slice(0, 2000),
          expiresAt: integration?.expires_at || null,
          source: 'figma_mcp_token',
        },
      }
    } catch (error) {
      const config = getMcpFrontConfig()
      if (!config) throw error
      const response = await fetch(`${config.url}/figma/health`, {
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
      })
      const rawBody = await response.text()
      if (response.ok) {
        await upsertSharedFigmaMcpIntegration({
          connection_status: 'connected',
          connected_at: new Date().toISOString(),
          metadata: {
            connected_via: 'mcp_front',
            last_probe_at: new Date().toISOString(),
          },
        })
      }
      return {
        success: response.ok,
        data: {
          status: response.status,
          ok: response.ok,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          bodyPreview: rawBody.slice(0, 2000),
          expiresAt: null,
          source: 'mcp_front',
        },
      }
    }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to probe Figma MCP' })
  }
})
