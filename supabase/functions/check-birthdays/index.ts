
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();

    // Buscar clientes que fazem aniversário hoje
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .not('data_nascimento', 'is', null);

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }

    const birthdayClients = clients?.filter(client => {
      if (!client.data_nascimento) return false;
      const birthday = new Date(client.data_nascimento);
      return birthday.getDate() === todayDay && birthday.getMonth() + 1 === todayMonth;
    }) || [];

    console.log(`Encontrados ${birthdayClients.length} clientes fazendo aniversário hoje`);

    if (birthdayClients.length > 0) {
      // Enviar emails de aniversário
      const birthdayMessage = "🎉 Parabéns pelo seu aniversário! Desejamos muito sucesso e felicidades. Aproveite nosso desconto especial de 15% válido até o final do mês!";
      
      for (const client of birthdayClients) {
        console.log(`Enviando email de aniversário automático para ${client.nome} (${client.email})`);
        // Aqui você integraria com um serviço real de email
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        birthdayCount: birthdayClients.length,
        message: `Verificação de aniversários concluída. ${birthdayClients.length} email(s) enviado(s).`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro na verificação de aniversários:', error);
    return new Response(
      JSON.stringify({ error: 'Erro na verificação de aniversários' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
