import { createClient } from '@supabase/supabase-js';

// It's recommended to use environment variables for these values.
// For Create React App, use REACT_APP_ prefix. For Vite, use VITE_ prefix.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we'll log an error to the console.
  console.error("Supabase URL and/or Anon Key are missing. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
