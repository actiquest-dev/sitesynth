import { defineEventHandler, setResponseStatus } from 'h3'

/**
 * GET /api/debug/nocobase-info
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
      // Format 1: New v1 API
      {
        name: 'v1 API (nc/tables)',
        url: `${NOCO_BASE_URL}/api/v1/db/data/noco`,
      },
      // Format 2: Old API with base
      {
        name: 'Base endpoint',
        url: `${NOCO_BASE_URL}/api/v1/db/base`,
      },
      // Format 3: Direct tables
      {
        name: 'Tables list',
        url: `${NOCO_BASE_URL}/api/v1/tables`,
      },
      // Format 4: Meta
      {
        name: 'Meta endpoint',
        url: `${NOCO_BASE_URL}/api/v1/meta/tables`,
      },
    ]

    for (const format of formats) {
      try {
        const response = await fetch(format.url, {
          headers: {
            'Authorization': `Bearer ${NOCO_TOKEN}`,
          },
        })
        console.log(`\n📋 ${format.name}:`)
        console.log(`  Status: ${response.status}`)
        if (response.ok) {
          const data = await response.json()
          console.log(`  ✅ Success:`, JSON.stringify(data).substring(0, 200))
        } else {
          console.log(`  ❌ Failed: ${response.statusText}`)
        }
      } catch (e: any) {
        console.log(`\n📋 ${format.name}:`)
        console.log(`  ❌ Error: ${e.message}`)
      }
    }
  } catch (error: any) {
    console.error('❌ Debug error:', error.message)
  }

  return {
    success: true,
    message: 'Check server logs for NocoBase API format info',
  }
})
