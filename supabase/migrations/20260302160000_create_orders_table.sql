-- Orders table for storing purchase information
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  charge_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'completed',
  
  -- Form data (intake form data)
  form_data JSONB,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_charge_id ON orders(charge_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Enable RLS (Row Level Security) for security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- RLS Policy: Allow inserting orders (for payment processing)
CREATE POLICY "Allow inserting orders"
  ON orders
  FOR INSERT
  WITH CHECK (true);
