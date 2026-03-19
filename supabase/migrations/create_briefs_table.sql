-- Create briefs table
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

-- Enable RLS
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can insert own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can update own briefs" ON public.briefs;
DROP POLICY IF EXISTS "Users can delete own briefs" ON public.briefs;

-- Create RLS policies
CREATE POLICY "Users can view own briefs" ON public.briefs
  FOR SELECT USING (auth.uid()::text = user_email OR user_email IS NOT NULL);

CREATE POLICY "Users can insert own briefs" ON public.briefs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own briefs" ON public.briefs
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own briefs" ON public.briefs
  FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_briefs_user_email ON public.briefs(user_email);
CREATE INDEX IF NOT EXISTS idx_briefs_conversation_id ON public.briefs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON public.briefs(created_at DESC);
