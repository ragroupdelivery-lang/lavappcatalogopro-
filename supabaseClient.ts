import { createClient } from '@supabase/supabase-js';

// Para esta aplicação, é seguro e correto colocar a URL e a chave anônima (pública) diretamente aqui.
// A segurança é garantida pela Row Level Security (RLS) no seu banco de dados Supabase.
// A URL e a chave foram preenchidas com base nas suas capturas de tela.

const supabaseUrl = 'https://aithmpkvrwmxxlvtqmzn.supabase.co';

// Chave 'anon' (pública) do seu painel Supabase.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdGhtcGt2cndteHhsanRxbXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NzU4MzUsImV4cCI6MjAzMTU1MTgzNX0.5yRgrMXI4iGdiq7s2NUr3VLn5pM-TeUu1_2L8o-FdEw';

// A verificação de erro não é mais necessária, pois a chave está preenchida.
export const supabaseInitializationError = null;

// O cliente agora é criado com suas credenciais reais.
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);