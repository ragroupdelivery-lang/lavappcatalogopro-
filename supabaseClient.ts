import { createClient } from '@supabase/supabase-js';

// Lê as variáveis de ambiente do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Valida se as variáveis foram configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam ser configuradas.");
}

// Conecta ao seu projeto Supabase.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
