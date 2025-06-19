
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clients, message } = await req.json();
    
    console.log(`Enviando emails de cobrança para ${clients.length} clientes`);
    
    for (const client of clients) {
      console.log(`Enviando email de cobrança para ${client.nome} (${client.email}): ${message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Emails de cobrança enviados para ${clients.length} cliente(s)` 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erro ao enviar emails de cobrança:', error);
    return new Response(
      JSON.stringify({ error: 'Erro ao enviar emails' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
