# Supabase Tables Setup Guide

This guide explains how to create the necessary database tables in Supabase.

## Option 1: Automatic Setup via Node.js Script (Recommended)

### Step 1: Get Your Database Password

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **wkxwjasgyulakiyclipb**
3. Click **Settings** → **Database**
4. Under "Connection String", copy the "Postgres" connection string (standard format)
5. Extract your password from the connection string (it's between `postgres:` and `@`)

### Step 2: Set DATABASE_URL Environment Variable

Add to your `.env.local` file:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@wkxwjasgyulakiyclipb.supabase.co:5432/postgres
```

Replace `YOUR_PASSWORD` with the actual database password.

### Step 3: Install pg Library

```bash
npm install pg
# or
yarn add pg
```

### Step 4: Run the Setup Script

```bash
npx ts-node scripts/setup-supabase-tables.ts
```

Expected output:
```
✅ Connected to Supabase PostgreSQL
📋 Creating orders table...
✅ Orders table created
📁 Creating projects table...
✅ Projects table created
👥 Creating clients table...
✅ Clients table created
🌱 Inserting test data...
✅ All tables created successfully!
```

## Option 2: Manual Setup via SQL Editor

If the Node.js script fails, you can create tables manually:

### Step 1: Open SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: **wkxwjasgyulakiyclipb**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**

### Step 2: Copy and Paste SQL

Copy the entire SQL from [SUPABASE_TABLES.sql](#sql-definitions) below and paste into the SQL Editor.

### Step 3: Execute

Click **Execute** button or press `Ctrl+Enter`

Wait for the success message.

## SQL Definitions

Create a new file `SUPABASE_TABLES.sql` with this content:

```sql
-- Create orders table
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

-- Create projects table
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

-- Create clients table
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

-- Insert test data for aprossine@gmail.com
INSERT INTO orders (email, title, status, amount, currency, payment_date, created_at)
VALUES
  ('aprossine@gmail.com', 'Website Development - Agency OS', 'completed', 2500.00, 'EUR', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('aprossine@gmail.com', 'UI/UX Design Package', 'completed', 1500.00, 'EUR', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('aprossine@gmail.com', 'Maintenance & Support - 3 months', 'active', 300.00, 'EUR', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO projects (email, title, description, status, created_at)
VALUES
  ('aprossine@gmail.com', 'Agency OS Integration', 'Migrate from NocoBase to Agency OS and Supabase', 'in_progress', NOW() - INTERVAL '10 days'),
  ('aprossine@gmail.com', 'Briefing Cabinet Enhancement', 'Add AI chat and file management features', 'planning', NOW() - INTERVAL '5 days'),
  ('aprossine@gmail.com', 'Website Redesign', 'Complete UI/UX overhaul with new design system', 'completed', NOW() - INTERVAL '30 days')
ON CONFLICT DO NOTHING;

INSERT INTO clients (email, name, company, country, phone, notes)
VALUES
  ('aprossine@gmail.com', 'Miguel Aprossine', 'SiteSynth', 'Portugal', '+351 XXX XXX XXX', 'Primary contact - CEO')
ON CONFLICT DO NOTHING;
```

## Verify Tables Were Created

After running either option, verify in Supabase:

1. Go to **Table Editor** (left sidebar)
2. You should see three new tables:
   - `orders` (3 test records)
   - `projects` (3 test records)
   - `clients` (1 test record)

All records should have `email = 'aprossine@gmail.com'`

## What Each Table Contains

### orders
- `id`: Unique order identifier
- `email`: Customer email (for filtering)
- `title`: Order description
- `status`: pending, active, completed
- `amount`: Price
- `currency`: EUR, USD, etc.
- `stripe_charge_id`: Stripe payment ID
- `payment_date`: When payment was processed
- `form_data`: Additional order information (JSON)

### projects
- `id`: Unique project identifier
- `email`: Project owner email
- `title`: Project name
- `description`: Project details
- `status`: planning, in_progress, completed
- `created_at`: When project was created

### clients
- `id`: Unique client identifier
- `email`: Client email (for filtering)
- `name`: Client name
- `company`: Company name
- `country`: Country
- `phone`: Contact phone
- `notes`: Additional notes

## Troubleshooting

### Error: "no pg_hba.conf entry for host"
- Check that DATABASE_URL is correctly formatted
- Verify you used the correct password
- Ensure SSL is enabled in the connection string

### Error: "password authentication failed"
- Double-check the password from Supabase dashboard
- Make sure there are no extra spaces or special characters
- Copy the password carefully from the connection string

### Tables already exist
- The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times
- Existing data won't be deleted

### Can't find Supabase dashboard
- Go to https://app.supabase.com
- Sign in with your account
- Select project "wkxwjasgyulakiyclipb"

## Next Steps

Once tables are created:

1. ✅ Cabinet will display your orders and projects
2. ✅ /api/user/orders will return your test orders
3. ✅ /api/user/projects will return your test projects
4. ✅ Cabinet AI chat can reference your data

Test by visiting: http://localhost:3000/cabinet
