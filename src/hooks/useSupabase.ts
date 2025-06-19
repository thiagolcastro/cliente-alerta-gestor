
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL não encontrada. Por favor, configure as variáveis de ambiente do Supabase:\n' +
    '1. No Lovable: Clique no botão Supabase no topo da tela\n' +
    '2. No Vercel: Adicione VITE_SUPABASE_URL nas Environment Variables\n' +
    '3. Localmente: Crie um arquivo .env.local com VITE_SUPABASE_URL=sua_url'
  );
}

if (!supabaseKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY não encontrada. Por favor, configure as variáveis de ambiente do Supabase:\n' +
    '1. No Lovable: Clique no botão Supabase no topo da tela\n' +
    '2. No Vercel: Adicione VITE_SUPABASE_ANON_KEY nas Environment Variables\n' +
    '3. Localmente: Crie um arquivo .env.local com VITE_SUPABASE_ANON_KEY=sua_chave'
  );
}

console.log('Conectando ao Supabase:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabase = () => {
  return { supabase };
};
