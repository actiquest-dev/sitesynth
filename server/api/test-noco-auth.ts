import { defineEventHandler } from 'h3'

/**
 * GET /api/test-noco-auth
 * Try different authentication headers to access NocoBase API
 */
export default defineEventHandler(async (event) => {
  const NOCO_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
  const NOCO_TOKEN = process.env.NOCO_TOKEN

  console.log('\n🔍 ========== Testing NocoBase Auth Headers ==========\n')
  console.log(`Token: ${NOCO_TOKEN?.substring(0, 50)}...`)

  // URL to test - using the one that works for POST
  const testUrl = `${NOCO_URL}/api/orders:list`

  const headerVariants = [
    {
      name: 'xc-auth (current)',
      headers: { 'xc-auth': NOCO_TOKEN },
    },
    {
      name: 'Authorization Bearer',
      headers: { 'Authorization': `Bearer ${NOCO_TOKEN}` },
    },
    {
      name: 'Authorization Token',
      headers: { 'Authorization': `Token ${NOCO_TOKEN}` },
    },
    {
      name: 'No auth header',
      headers: {},
    },
    {
      name: 'x-nc-auth',
      headers: { 'x-nc-auth': NOCO_TOKEN },
    },
    {
      name: 'nc-auth',
      headers: { 'nc-auth': NOCO_TOKEN },
    },
  ]

  for (const variant of headerVariants) {
    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...variant.headers,
        },
      })

      console.log(`\n📋 ${variant.name}:`)
      console.log(`   Status: ${response.status}`)

      const text = await response.text()
      if (response.ok) {
        try {
          const data = JSON.parse(text)
          console.log(`   ✅ SUCCESS (JSON):`, JSON.stringify(data).substring(0, 300))
        } catch {
          console.log(`   ✅ SUCCESS (text):`, text.substring(0, 200))
        }
      } else {
        console.log(`   ❌ FAILED: ${response.statusText}`)
        console.log(`   Response: ${text.substring(0, 100)}`)
      }
    } catch (e: any) {
      console.log(`\n📋 ${variant.name}:`)
      console.log(`   ❌ ERROR: ${e.message}`)
    }
  }

  console.log('\n✅ Auth test complete\n')

  return {
    success: true,
    message: 'Check server logs for auth header results',
  }
})
