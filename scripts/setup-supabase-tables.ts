import { Client } from 'pg'

/**
 * Setup script to create Supabase tables
 *
 * Usage: npx ts-node scripts/setup-supabase-tables.ts
 *
 * Requires DATABASE_URL environment variable in format:
 * postgresql://postgres:PASSWORD@wkxwjasgyulakiyclipb.supabase.co:5432/postgres
 */

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not set')
  console.error('Set it in your .env.local or export it:')
  console.error('export DATABASE_URL="postgresql://postgres:PASSWORD@wkxwjasgyulakiyclipb.supabase.co:5432/postgres"')
  process.exit(1)
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

async function createTables() {
  try {
    await client.connect()
    console.log('✅ Connected to Supabase PostgreSQL')

    // Create orders table
    console.log('\n📋 Creating orders table...')
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
    console.log('\n📁 Creating projects table...')
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
    console.log('\n👥 Creating clients table...')
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

    // Insert test data for aprossine@gmail.com
    console.log('\n🌱 Inserting test data...')
    await client.query(`
      INSERT INTO orders (email, title, status, amount, currency, payment_date, created_at)
      VALUES
        ('aprossine@gmail.com', 'Website Development - Agency OS', 'completed', 2500.00, 'EUR', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        ('aprossine@gmail.com', 'UI/UX Design Package', 'completed', 1500.00, 'EUR', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
        ('aprossine@gmail.com', 'Maintenance & Support - 3 months', 'active', 300.00, 'EUR', NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `)
    console.log('✅ Test orders inserted')

    await client.query(`
      INSERT INTO projects (email, title, description, status, created_at)
      VALUES
        ('aprossine@gmail.com', 'Agency OS Integration', 'Migrate from NocoBase to Agency OS and Supabase', 'in_progress', NOW() - INTERVAL '10 days'),
        ('aprossine@gmail.com', 'Briefing Cabinet Enhancement', 'Add AI chat and file management features', 'planning', NOW() - INTERVAL '5 days'),
        ('aprossine@gmail.com', 'Website Redesign', 'Complete UI/UX overhaul with new design system', 'completed', NOW() - INTERVAL '30 days')
      ON CONFLICT DO NOTHING;
    `)
    console.log('✅ Test projects inserted')

    await client.query(`
      INSERT INTO clients (email, name, company, country, phone, notes)
      VALUES
        ('aprossine@gmail.com', 'Miguel Aprossine', 'SiteSynth', 'Portugal', '+351 XXX XXX XXX', 'Primary contact - CEO')
      ON CONFLICT DO NOTHING;
    `)
    console.log('✅ Test clients inserted')

    console.log('\n✨ All tables created successfully!')
    console.log('\n📊 Table summary:')

    const tables = ['orders', 'projects', 'clients']
    for (const table of tables) {
      const result = await client.query(`
        SELECT COUNT(*) as count FROM ${table} WHERE email = 'aprossine@gmail.com'
      `)
      console.log(`  ${table}: ${result.rows[0].count} records for aprossine@gmail.com`)
    }

    await client.end()
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Error creating tables:', error.message)
    console.error('\nIf you see "no pg_hba.conf entry for host", you need to:')
    console.error('1. Get your database password from Supabase dashboard')
    console.error('2. Set DATABASE_URL environment variable')
    console.error('3. Ensure SSL mode is enabled')
    await client.end()
    process.exit(1)
  }
}

createTables()
