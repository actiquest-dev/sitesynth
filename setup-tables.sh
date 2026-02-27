#!/bin/bash

# Supabase Tables Setup Script
# Run this script to create all database tables automatically
# Usage: bash setup-tables.sh

set -e

echo ""
echo "🔧 SiteSynth Supabase Tables Setup"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get database password
echo -e "${BLUE}ℹ️  You need your Supabase database password${NC}"
echo ""
echo "To get it:"
echo "  1. Go to https://app.supabase.com"
echo "  2. Select project: wkxwjasgyulakiyclipb"
echo "  3. Click Settings → Database"
echo "  4. Find 'Connection string (Postgres)'"
echo "  5. Copy password from: postgresql://postgres:PASSWORD@..."
echo ""

read -s -p "Enter your Supabase database password: " PASSWORD

if [ -z "$PASSWORD" ]; then
  echo -e "${RED}❌ Password cannot be empty${NC}"
  exit 1
fi

echo ""
echo ""
echo -e "${YELLOW}📝 Using password to connect...${NC}"

# Build connection string
DATABASE_URL="postgresql://postgres:${PASSWORD}@wkxwjasgyulakiyclipb.supabase.co:5432/postgres"

# Create tables using Node.js and PostgreSQL client
node << EOF
const { Client } = require('pg');

async function setupTables() {
  const client = new Client({
    connectionString: '${DATABASE_URL}',
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔗 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected');

    console.log('');
    console.log('📋 Creating orders table...');
    await client.query(\`
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
    \`);
    console.log('✅ Orders table created');

    console.log('');
    console.log('📁 Creating projects table...');
    await client.query(\`
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
    \`);
    console.log('✅ Projects table created');

    console.log('');
    console.log('👥 Creating clients table...');
    await client.query(\`
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
    \`);
    console.log('✅ Clients table created');

    console.log('');
    console.log('🌱 Inserting test data for aprossine@gmail.com...');
    await client.query(\`
      INSERT INTO orders (email, title, status, amount, currency, payment_date, created_at)
      VALUES
        ('aprossine@gmail.com', 'Website Development - Agency OS', 'completed', 2500.00, 'EUR', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        ('aprossine@gmail.com', 'UI/UX Design Package', 'completed', 1500.00, 'EUR', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
        ('aprossine@gmail.com', 'Maintenance & Support - 3 months', 'active', 300.00, 'EUR', NOW(), NOW())
      ON CONFLICT DO NOTHING;
    \`);

    await client.query(\`
      INSERT INTO projects (email, title, description, status, created_at)
      VALUES
        ('aprossine@gmail.com', 'Agency OS Integration', 'Migrate from NocoBase to Agency OS and Supabase', 'in_progress', NOW() - INTERVAL '10 days'),
        ('aprossine@gmail.com', 'Briefing Cabinet Enhancement', 'Add AI chat and file management features', 'planning', NOW() - INTERVAL '5 days'),
        ('aprossine@gmail.com', 'Website Redesign', 'Complete UI/UX overhaul with new design system', 'completed', NOW() - INTERVAL '30 days')
      ON CONFLICT DO NOTHING;
    \`);

    await client.query(\`
      INSERT INTO clients (email, name, company, country, phone, notes)
      VALUES
        ('aprossine@gmail.com', 'Miguel Aprossine', 'SiteSynth', 'Portugal', '+351 XXX XXX XXX', 'Primary contact - CEO')
      ON CONFLICT DO NOTHING;
    \`);

    console.log('✅ Test data inserted');

    // Verify
    const orders = await client.query(\`SELECT COUNT(*) as count FROM orders WHERE email = 'aprossine@gmail.com'\`);
    const projects = await client.query(\`SELECT COUNT(*) as count FROM projects WHERE email = 'aprossine@gmail.com'\`);
    const clients = await client.query(\`SELECT COUNT(*) as count FROM clients WHERE email = 'aprossine@gmail.com'\`);

    console.log('');
    console.log('✨ Setup complete!');
    console.log(\`   📋 orders: \${orders.rows[0].count} records\`);
    console.log(\`   📁 projects: \${projects.rows[0].count} records\`);
    console.log(\`   👥 clients: \${clients.rows[0].count} records\`);
    console.log('');
    console.log('🎉 Your Cabinet will now display your data!');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    if (error.message.includes('password authentication failed')) {
      console.error('The password you entered is incorrect.');
      console.error('Check your Supabase dashboard again.');
    }
    await client.end();
    process.exit(1);
  }
}

setupTables();
EOF
