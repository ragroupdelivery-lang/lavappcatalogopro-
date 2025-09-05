import { createClient } from '@supabase/supabase-js';

// These environment variables should be configured in your deployment environment (e.g., .env file)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
