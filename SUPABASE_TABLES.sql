-- Supabase Tables Setup SQL
-- Copy and paste this entire file into the Supabase SQL Editor
-- Go to: https://app.supabase.com → SQL Editor → New Query → Paste → Execute

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
