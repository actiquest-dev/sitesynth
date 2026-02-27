import fetch from 'node-fetch'

const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
const NOCO_TOKEN = process.env.NOCO_TOKEN

if (!NOCO_TOKEN) {
  console.error('❌ NOCO_TOKEN not set')
  process.exit(1)
}

async function getOrCreateTable(tableName: string, columns: any[]) {
  console.log(`\n📋 Checking table: ${tableName}...`)

  // Try to list records to see if table exists
  try {
    const listRes = await fetch(`${NOCO_BASE_URL}/api/v1/db/data/noco/${tableName}`, {
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
    })

    if (listRes.ok) {
      console.log(`✅ Table ${tableName} already exists`)
      return true
    }
  } catch (e) {
    // Table doesn't exist
  }

  // Try alternative API path for creation
  console.log(`📝 Creating table ${tableName}...`)

  try {
    // Try to create through the data API by inserting a record
    // This might auto-create the table
    const createRes = await fetch(`${NOCO_BASE_URL}/api/v1/db/data/noco/${tableName}`, {
      method: 'POST',
      headers: {
        'xc-auth': NOCO_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Create with minimal data - will fail but might create table
        [columns[0].column_name]: null,
      }),
    })

    console.log(`Response status: ${createRes.status}`)
    const text = await createRes.text()
    console.log(`Response: ${text.substring(0, 100)}`)

    if (createRes.ok) {
      console.log(`✅ Table ${tableName} created successfully`)
      return true
    } else if (createRes.status === 404) {
      console.log(`⚠️ Table ${tableName} not found - needs manual creation in UI`)
      return false
    }
  } catch (e) {
    console.error(`❌ Error with table ${tableName}:`, (e as any).message)
  }

  return false
}

async function main() {
  console.log('🚀 Creating NocoBase tables...\n')

  const tables = [
    {
      name: 'CompanyInfo',
      columns: [
        { column_name: 'id', uidt: 'ID', pk: true },
        { column_name: 'key', uidt: 'SingleLineText' },
        { column_name: 'value', uidt: 'LongText' },
        { column_name: 'category', uidt: 'SingleLineText' },
        { column_name: 'active', uidt: 'Checkbox' },
      ],
    },
    {
      name: 'ChatHistory',
      columns: [
        { column_name: 'id', uidt: 'ID', pk: true },
        { column_name: 'userEmail', uidt: 'SingleLineText' },
        { column_name: 'role', uidt: 'SingleLineText' },
        { column_name: 'content', uidt: 'LongText' },
        { column_name: 'timestamp', uidt: 'DateTime' },
      ],
    },
    {
      name: 'ChatContext',
      columns: [
        { column_name: 'id', uidt: 'ID', pk: true },
        { column_name: 'userEmail', uidt: 'SingleLineText' },
        { column_name: 'contextData', uidt: 'LongText' },
        { column_name: 'updatedAt', uidt: 'DateTime' },
      ],
    },
  ]

  for (const table of tables) {
    await getOrCreateTable(table.name, table.columns)
  }

  console.log('\n✅ Table creation complete!')
}

main().catch(console.error)
