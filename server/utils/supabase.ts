import { createClient } from '@supabase/supabase-js'

// Simple singleton to match the missing useDatabaseClient() behavior
let dbClient: ReturnType<typeof createClient> | null = null;

export const useDatabaseClient = () => {
  if (dbClient) return dbClient;

  const supabaseUrl = process.env.SUPABASE_URL || 'https://wkxwjasgyulakiyclipb.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials in environment variables');
  }

  dbClient = createClient(supabaseUrl, supabaseKey);
  return dbClient;
}
