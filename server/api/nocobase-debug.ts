import { defineEventHandler } from 'h3'

/**
 * GET /api/nocobase-debug
 * Debug endpoint to check NocoBase connectivity and API format
 */
export default defineEventHandler(async (event) => {
  const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
  const NOCO_TOKEN = process.env.NOCO_TOKEN

  console.log('\n\n🔍 ========== NocoBase Debug Info ==========')
  console.log('  URL:', NOCO_BASE_URL)
  console.log('  TOKEN:', NOCO_TOKEN ? '***SET***' : '❌ NOT SET')

  try {
    // Try to get version info
    const versionResponse = await fetch(`${NOCO_BASE_URL}/api/v1/version`, {
      headers: {
        'Authorization': `Bearer ${NOCO_TOKEN}`,
      },
    }).catch(() => null)

    if (versionResponse?.ok) {
      const versionData = await versionResponse.json()
      console.log('✅ Version endpoint works:', versionData)
    } else {
      console.log('⚠️ Version endpoint failed')
    }

    // Try different API formats
    const formats = [
      {
        name: 'Root',
        url: `${NOCO_BASE_URL}/`,
      },
      {
        name: 'API root',
        url: `${NOCO_BASE_URL}/api`,
      },
      {
        name: 'nc/tables (old)',
        url: `${NOCO_BASE_URL}/nc`,
      },
      {
        name: 'OpenAPI',
        url: `${NOCO_BASE_URL}/api/v1/openapi`,
      },
      {
        name: 'Swagger',
        url: `${NOCO_BASE_URL}/api/v1/swagger`,
      },
      {
        name: 'Health',
        url: `${NOCO_BASE_URL}/api/v1/health`,
      },
      {
        name: 'v1 API (nc/tables)',
        url: `${NOCO_BASE_URL}/api/v1/db/data/noco`,
      },
      {
        name: 'Base endpoint',
        url: `${NOCO_BASE_URL}/api/v1/db/base`,
      },
      {
        name: 'Tables list',
        url: `${NOCO_BASE_URL}/api/v1/tables`,
      },
      {
        name: 'Meta endpoint',
        url: `${NOCO_BASE_URL}/api/v1/meta/tables`,
      },
    ]

    for (const format of formats) {
      try {
        // Try WITH token first
        console.log(`\n📋 ${format.name}:`)
        const response = await fetch(format.url, {
          headers: {
            'Authorization': NOCO_TOKEN ? `Bearer ${NOCO_TOKEN}` : '',
            'Content-Type': 'application/json',
          },
        })
        console.log(`  Status: ${response.status}`)
        
        const responseText = await response.text()
        if (response.ok) {
          try {
            const data = JSON.parse(responseText)
            console.log(`  ✅ Success (JSON):`, JSON.stringify(data).substring(0, 500))
          } catch {
            console.log(`  ✅ Success (text):`, responseText.substring(0, 500))
          }
        } else {
          console.log(`  ❌ Failed: ${response.statusText}`)
          console.log(`  Response text:`, responseText.substring(0, 300))
        }
      } catch (e: any) {
        console.log(`\n📋 ${format.name}:`)
        console.log(`  ❌ Error: ${e.message}`)
      }
    }
  } catch (error: any) {
    console.error('❌ Debug error:', error.message)
  }

  console.log('\n✅ Debug endpoint executed, check logs above\n')

  return {
    success: true,
    message: 'Check server console for NocoBase API format info',
  }
})
