import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_PUBLISHABLE_KEY; // This key should be the anon public key

let supabase: SupabaseClient;
let initializationError: Error | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  initializationError = new Error("As variáveis de ambiente SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY são obrigatórias.");
  // Create a dummy client to prevent app from crashing on destructure
  supabase = {} as SupabaseClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase, initializationError };
