import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient;
let initializationError: Error | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  initializationError = new Error("As variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias.");
  supabase = {} as SupabaseClient;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase, initializationError };
