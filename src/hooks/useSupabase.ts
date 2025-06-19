
import { createClient } from '@supabase/supabase-js';

// Valores temporários para desenvolvimento - substitua pelas suas credenciais reais
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Conectando ao Supabase:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabase = () => {
  return { supabase };
};
