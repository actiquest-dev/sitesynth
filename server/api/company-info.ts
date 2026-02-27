import { defineEventHandler } from 'h3'

const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
const NOCO_TOKEN = process.env.NOCO_TOKEN

/**
 * Company Info endpoint
 * Loads company information from NocoBase for AI chat context
 */
export default defineEventHandler(async (event) => {
  try {
    const category = getQuery(event).category as string | undefined

    let url = `${NOCO_BASE_URL}/api/CompanyInfo:list?filter[active]=true&pageSize=100`
    if (category) {
      url += `&filter[category]=${category}`
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${NOCO_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return { success: true, data: [] }
    }

    const data = await response.json()
    const records = (data.data || []).map((row: any) => ({
      key: row.key,
      value: row.value,
      category: row.category,
    }))

    return { success: true, data: records }
  } catch (error: any) {
    console.error('Error loading company info:', error)
    return { success: false, error: error.message, data: [] }
  }
})
