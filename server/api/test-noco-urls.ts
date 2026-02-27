import { defineEventHandler } from 'h3'

/**
 * GET /api/test-noco-urls
 * Try different NocoBase URL formats to find the correct one
 */
export default defineEventHandler(async (event) => {
  const NOCO_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
  const NOCO_TOKEN = process.env.NOCO_TOKEN

  console.log('\n🔍 ========== Testing NocoBase URL Formats ==========\n')

  // List of different URL formats to try
  const urlFormats = [
    // Format 1: API with :list syntax
    `${NOCO_URL}/api/orders:list`,
    
    // Format 2: nc prefix (old NocoDB)
    `${NOCO_URL}/nc/tables/orders`,
    
    // Format 3: With table ID
    `${NOCO_URL}/api/v1/db/data/noco/orders`,
    
    // Format 4: REST API style
    `${NOCO_URL}/api/v2/tables/orders/records`,
    
    // Format 5: Simple REST
    `${NOCO_URL}/api/tables/orders`,
    
    // Format 6: OpenAPI
    `${NOCO_URL}/api/v1/openapi`,
    
    // Format 7: List of all tables
    `${NOCO_URL}/api/tables`,
    
    // Format 8: Meta info
    `${NOCO_URL}/api/meta/tables`,
  ]

  for (const url of urlFormats) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-auth': NOCO_TOKEN,
          'Content-Type': 'application/json',
        },
      })

      console.log(`\n📍 URL: ${url}`)
      console.log(`   Status: ${response.status}`)

      const text = await response.text()
      if (response.ok) {
        try {
          const data = JSON.parse(text)
          console.log(`   ✅ SUCCESS (JSON):`, JSON.stringify(data).substring(0, 300))
        } catch {
          console.log(`   ✅ SUCCESS (text):`, text.substring(0, 300))
        }
      } else {
        console.log(`   ❌ FAILED: ${response.statusText}`)
        if (text) {
          console.log(`   Response: ${text.substring(0, 200)}`)
        }
      }
    } catch (e: any) {
      console.log(`\n📍 URL: ${url}`)
      console.log(`   ❌ ERROR: ${e.message}`)
    }
  }

  console.log('\n✅ URL format test complete\n')

  return {
    success: true,
    message: 'Check server logs for URL format results',
  }
})
