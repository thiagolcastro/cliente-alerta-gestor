
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/pages/Index';

export const emailService = {
  async sendBirthdayEmails(clients: Client[], message: string): Promise<void> {
    console.log('Enviando emails de aniversário para:', clients.length, 'clientes');
    
    const { error } = await supabase.functions.invoke('send-birthday-emails', {
      body: {
        clients: clients.map(client => ({
          id: client.id,
          nome: client.nome,
          email: client.email
        })),
        message
      }
    });
    
    if (error) {
      console.error('Erro ao enviar emails de aniversário:', error);
      throw error;
    }
  },

  async sendPromotionEmails(clients: Client[], message: string): Promise<void> {
    console.log('Enviando emails promocionais para:', clients.length, 'clientes');
    
    const { error } = await supabase.functions.invoke('send-promotion-emails', {
      body: {
        clients: clients.map(client => ({
          id: client.id,
          nome: client.nome,
          email: client.email
        })),
        message
      }
    });
    
    if (error) {
      console.error('Erro ao enviar emails promocionais:', error);
      throw error;
    }
  },

  async sendInactiveEmails(clients: Client[], message: string): Promise<void> {
    console.log('Enviando emails para clientes inativos:', clients.length, 'clientes');
    
    const { error } = await supabase.functions.invoke('send-inactive-emails', {
      body: {
        clients: clients.map(client => ({
          id: client.id,
          nome: client.nome,
          email: client.email
        })),
        message
      }
    });
    
    if (error) {
      console.error('Erro ao enviar emails para inativos:', error);
      throw error;
    }
  },

  async sendBillingEmails(clients: Client[], message: string): Promise<void> {
    console.log('Enviando emails de cobrança para:', clients.length, 'clientes');
    
    const { error } = await supabase.functions.invoke('send-billing-emails', {
      body: {
        clients: clients.map(client => ({
          id: client.id,
          nome: client.nome,
          email: client.email
        })),
        message
      }
    });
    
    if (error) {
      console.error('Erro ao enviar emails de cobrança:', error);
      throw error;
    }
  }
};
