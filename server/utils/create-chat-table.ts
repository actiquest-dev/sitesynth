/**
 * Utility to create ChatHistory table in NocoBase if it doesn't exist
 * This can be run manually or via an admin endpoint
 */

const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
const NOCO_TOKEN = process.env.NOCO_TOKEN

export async function createChatHistoryTable() {
  try {
    // Check if table exists - try to fetch data
    const checkUrl = `${NOCO_BASE_URL}/api/v1/db/data/noco/ChatHistory?limit=1`
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'xc-auth': NOCO_TOKEN,
      },
    })

    if (checkResponse.status === 200) {
      console.log('ChatHistory table already exists')
      return true
    }

    // If table doesn't exist, create it
    console.log('Creating ChatHistory table...')

    // First, get the base ID
    const basesUrl = `${NOCO_BASE_URL}/api/v1/db/meta/projects`
    const basesResponse = await fetch(basesUrl, {
      headers: {
        'xc-auth': NOCO_TOKEN,
      },
    })

    if (!basesResponse.ok) {
      throw new Error('Failed to fetch bases')
    }

    const basesData = await basesResponse.json()
    const defaultBase = basesData.list?.[0] || basesData[0]

    if (!defaultBase) {
      throw new Error('No base found')
    }

    // Create table via API
    const createTableUrl = `${NOCO_BASE_URL}/api/v1/db/meta/projects/${defaultBase.id}/tables`
    const createTableResponse = await fetch(createTableUrl, {
      method: 'POST',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'ChatHistory',
        columns: [
          {
            column_name: 'id',
            uidt: 'ID',
            pk: true,
          },
          {
            column_name: 'userEmail',
            uidt: 'SingleLineText',
            required: true,
          },
          {
            column_name: 'role',
            uidt: 'SingleLineText',
            required: true,
          },
          {
            column_name: 'content',
            uidt: 'LongText',
            required: true,
          },
          {
            column_name: 'timestamp',
            uidt: 'DateTime',
            required: true,
          },
        ],
      }),
    })

    if (!createTableResponse.ok) {
      const error = await createTableResponse.json()
      throw new Error(`Failed to create table: ${error.message || createTableResponse.statusText}`)
    }

    console.log('ChatHistory table created successfully')
    return true
  } catch (error: any) {
    console.error('Error creating ChatHistory table:', error)
    return false
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createChatHistoryTable().then(success => {
    process.exit(success ? 0 : 1)
  })
}
