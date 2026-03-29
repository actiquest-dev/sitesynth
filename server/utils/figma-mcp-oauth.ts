import crypto from 'node:crypto'

export type MpcOAuthDiscovery = {
  authorization_endpoint: string
  token_endpoint: string
  registration_endpoint?: string
  issuer?: string
}

const base64Url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

export const generatePkce = () => {
  const verifier = base64Url(crypto.randomBytes(32))
  const challenge = base64Url(crypto.createHash('sha256').update(verifier).digest())
  return { verifier, challenge }
}

export const discoverMcpOAuth = async (mcpUrl: string) => {
  const url = new URL(mcpUrl)
  const origin = url.origin

  // Try RFC 9728 protected resource metadata first
  let authServerIssuer: string | null = null
  try {
    const pr = await fetch(`${origin}/.well-known/oauth-protected-resource`)
    if (pr.ok) {
      const meta = await pr.json()
      if (Array.isArray(meta.authorization_servers) && meta.authorization_servers.length > 0) {
        authServerIssuer = meta.authorization_servers[0]
      }
    }
  } catch {
    // ignore
  }

  const issuer = authServerIssuer || origin
  const asMetaUrl = `${issuer.replace(/\/+$/, '')}/.well-known/oauth-authorization-server`
  const asRes = await fetch(asMetaUrl)
  if (!asRes.ok) {
    throw new Error(`Failed to load OAuth authorization metadata from ${asMetaUrl}`)
  }
  const asMeta = await asRes.json()

  if (!asMeta.authorization_endpoint || !asMeta.token_endpoint) {
    throw new Error('OAuth metadata missing authorization_endpoint or token_endpoint')
  }

  return {
    authorization_endpoint: asMeta.authorization_endpoint,
    token_endpoint: asMeta.token_endpoint,
    registration_endpoint: asMeta.registration_endpoint,
    issuer: asMeta.issuer || issuer,
  } as MpcOAuthDiscovery
}

export const registerMcpClient = async (registrationEndpoint: string, mcpRedirectUri: string) => {
  const payload = {
    client_name: 'sitesynth-mcp-client',
    redirect_uris: [mcpRedirectUri],
    grant_types: ['authorization_code'],
    response_types: ['code'],
    token_endpoint_auth_method: 'none',
  }

  const res = await fetch(registrationEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json.client_id) {
    throw new Error(json?.error_description || json?.error || 'Failed to register OAuth client')
  }

  return json
}
