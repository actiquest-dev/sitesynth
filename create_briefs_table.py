#!/usr/bin/env python3
"""Create briefs table in Supabase via SQL API"""

import os
import requests
import json

# Get credentials from environment
SUPABASE_URL = os.environ.get('SUPABASE_URL') or 'https://wkxwjasgyulakiyclipb.supabase.co'
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY')
SUPABASE_SERVICE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_SERVICE_ROLE_KEY not set")
    exit(1)

# SQL to create briefs table
sql = """
CREATE TABLE IF NOT EXISTS public.briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  agent_type TEXT DEFAULT 'briefing',
  brief_data JSONB DEFAULT '{}',
  markdown_content TEXT DEFAULT '',
  design_spec_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can insert own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can update own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can delete own briefs" ON public.briefs;

CREATE POLICY "Users can view own briefs" ON public.briefs
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own briefs" ON public.briefs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own briefs" ON public.briefs
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own briefs" ON public.briefs
  FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_briefs_user_email ON public.briefs(user_email);
CREATE INDEX IF NOT EXISTS idx_briefs_conversation_id ON public.briefs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON public.briefs(created_at DESC);
"""

# Execute SQL via Supabase API
url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "apikey": SUPABASE_SERVICE_KEY,
}

# Try using query endpoint instead
url = f"{SUPABASE_URL}/rest/v1/"

# Actually, use the direct SQL execution via admin API
import subprocess
import sys

try:
    # Try using curl with SQL
    cmd = f"""curl -X POST "{SUPABASE_URL}/rest/v1/rpc" \
      -H "apikey: {SUPABASE_SERVICE_KEY}" \
      -H "Authorization: Bearer {SUPABASE_SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -d '{{"query": {json.dumps(sql)}}}'"""

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print("Response:", result.stdout)
    if result.stderr:
        print("Error:", result.stderr)
except Exception as e:
    print(f"Error executing SQL: {e}")
    print("\nPlease run this SQL manually in Supabase Dashboard:")
    print(sql)
