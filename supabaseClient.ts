import { createClient } from '@supabase/supabase-js';

// TODO: Substitua pelos seus URL e chave pública anônima reais do Supabase.
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabaseInitializationError =
  supabaseUrl.includes('your-project-url') || supabaseAnonKey.includes('your-supabase-anon-key')
    ? new Error('A configuração do Supabase está incompleta. Por favor, edite o arquivo `supabaseClient.ts` com a sua URL e chave anônima pública do projeto.')
    : null;

if (supabaseInitializationError) {
  console.error(`❌ ${supabaseInitializationError.message}`);
}

// O cliente é sempre criado. As chamadas falharão se as chaves forem inválidas,
// mas a aplicação deve ser bloqueada pelo `supabaseInitializationError` antes que isso aconteça.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
