import { createClient } from '@supabase/supabase-js';

// Conectado ao seu projeto Supabase.
const supabaseUrl = 'https://aithmpkvrwmxxlvtqmzn.supabase.co';
const supabaseAnonKey = 'sb_publishable_3oD-QjaqsLpLgQN7g091wQ_Bu5tZy2K';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);