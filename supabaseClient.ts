import { createClient } from '@supabase/supabase-js';

// As chaves agora serão lidas das variáveis de ambiente configuradas no Netlify.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// A verificação de erro agora procura pela ausência das variáveis de ambiente.
export const supabaseInitializationError =
  !supabaseUrl || !supabaseAnonKey
    ? new Error('Configuração do Supabase incompleta. Adicione SUPABASE_URL e SUPABASE_ANON_KEY às variáveis de ambiente no seu provedor de hospedagem (ex: Netlify).')
    : null;

// O cliente é criado com as variáveis de ambiente.
// Se elas não existirem, o erro acima será usado para ativar o modo de demonstração.
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
