import { defineEventHandler, readBody, setResponseStatus } from 'h3'

/**
 * POST /api/setup/tables
 * Setup endpoint to create all Supabase tables
 *
 * Request body:
 * {
 *   "password": "your-supabase-database-password"
 * }
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { password } = body

    if (!password) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: 'Missing password in request body',
      }
    }

    console.log('\n🔧 Starting table setup...')

    // Build database connection URL
    const databaseUrl = `postgresql://postgres:${password}@wkxwjasgyulakiyclipb.supabase.co:5432/postgres`

    // Dynamic import of pg library
    const { Client } = await import('pg')

    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    console.log('🔗 Connecting to Supabase...')
    await client.connect()
    console.log('✅ Connected to Supabase PostgreSQL')

    // Create orders table
    console.log('📋 Creating orders table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        title TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        amount DECIMAL(10, 2),
        currency TEXT DEFAULT 'EUR',
        stripe_charge_id TEXT,
        payment_date TIMESTAMP,
        form_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    `)
    console.log('✅ Orders table created')

    // Create projects table
    console.log('📁 Creating projects table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_projects_email ON projects(email);
      CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
    `)
    console.log('✅ Projects table created')

    // Create clients table
    console.log('👥 Creating clients table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        company TEXT,
        country TEXT,
        phone TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
      CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);
    `)
    console.log('✅ Clients table created')

    // Insert test data
    console.log('🌱 Inserting test data for aprossine@gmail.com...')
    await client.query(`
      INSERT INTO orders (email, title, status, amount, currency, payment_date, created_at)
      VALUES
        ('aprossine@gmail.com', 'Website Development - Agency OS', 'completed', 2500.00, 'EUR', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        ('aprossine@gmail.com', 'UI/UX Design Package', 'completed', 1500.00, 'EUR', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
        ('aprossine@gmail.com', 'Maintenance & Support - 3 months', 'active', 300.00, 'EUR', NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `)

    await client.query(`
      INSERT INTO projects (email, title, description, status, created_at)
      VALUES
        ('aprossine@gmail.com', 'Agency OS Integration', 'Migrate from NocoBase to Agency OS and Supabase', 'in_progress', NOW() - INTERVAL '10 days'),
        ('aprossine@gmail.com', 'Briefing Cabinet Enhancement', 'Add AI chat and file management features', 'planning', NOW() - INTERVAL '5 days'),
        ('aprossine@gmail.com', 'Website Redesign', 'Complete UI/UX overhaul with new design system', 'completed', NOW() - INTERVAL '30 days')
      ON CONFLICT DO NOTHING;
    `)

    await client.query(`
      INSERT INTO clients (email, name, company, country, phone, notes)
      VALUES
        ('aprossine@gmail.com', 'Miguel Aprossine', 'SiteSynth', 'Portugal', '+351 XXX XXX XXX', 'Primary contact - CEO')
      ON CONFLICT DO NOTHING;
    `)

    console.log('✅ Test data inserted')

    // Verify data was created
    const orderCount = await client.query(`
      SELECT COUNT(*) as count FROM orders WHERE email = 'aprossine@gmail.com'
    `)
    const projectCount = await client.query(`
      SELECT COUNT(*) as count FROM projects WHERE email = 'aprossine@gmail.com'
    `)
    const clientCount = await client.query(`
      SELECT COUNT(*) as count FROM clients WHERE email = 'aprossine@gmail.com'
    `)

    await client.end()

    const orderTotal = parseInt(orderCount.rows[0].count)
    const projectTotal = parseInt(projectCount.rows[0].count)
    const clientTotal = parseInt(clientCount.rows[0].count)

    console.log('✨ Setup complete!')
    console.log(`   📋 orders: ${orderTotal} records`)
    console.log(`   📁 projects: ${projectTotal} records`)
    console.log(`   👥 clients: ${clientTotal} records`)

    setResponseStatus(event, 200)
    return {
      success: true,
      message: 'Supabase tables created successfully',
      data: {
        orders: orderTotal,
        projects: projectTotal,
        clients: clientTotal,
      },
    }
  } catch (error: any) {
    console.error('❌ Setup error:', error.message)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message,
      hint: 'Check that your database password is correct',
    }
  }
})
