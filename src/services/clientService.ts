import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/client';

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
    
    return data?.map(client => ({
      id: client.id,
      nome: client.nome,
      email: client.email,
      telefone: client.telefone || '',
      whatsapp: client.whatsapp || '',
      endereco: client.endereco || '',
      bairro: client.bairro || '',
      cidade: client.cidade || '',
      cep: client.cep || '',
      estado: client.estado || '',
      dataNascimento: client.data_nascimento || '',
      profissao: client.profissao || '',
      empresa: client.empresa || '',
      observacoes: client.observacoes || '',
      ultimaCompra: client.ultima_compra || '',
      valorUltimaCompra: client.valor_ultima_compra || 0,
      createdAt: client.created_at
    })) || [];
  },

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        nome: client.nome,
        email: client.email,
        telefone: client.telefone || null,
        whatsapp: client.whatsapp || null,
        endereco: client.endereco || null,
        bairro: client.bairro || null,
        cidade: client.cidade || null,
        cep: client.cep || null,
        estado: client.estado || null,
        data_nascimento: client.dataNascimento || null,
        profissao: client.profissao || null,
        empresa: client.empresa || null,
        observacoes: client.observacoes || null,
        ultima_compra: client.ultimaCompra || null,
        valor_ultima_compra: client.valorUltimaCompra || 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
    
    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone || '',
      whatsapp: data.whatsapp || '',
      endereco: data.endereco || '',
      bairro: data.bairro || '',
      cidade: data.cidade || '',
      cep: data.cep || '',
      estado: data.estado || '',
      dataNascimento: data.data_nascimento || '',
      profissao: data.profissao || '',
      empresa: data.empresa || '',
      observacoes: data.observacoes || '',
      ultimaCompra: data.ultima_compra || '',
      valorUltimaCompra: data.valor_ultima_compra || 0,
      createdAt: data.created_at
    };
  },

  async updateClient(id: string, client: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        nome: client.nome,
        email: client.email,
        telefone: client.telefone || null,
        whatsapp: client.whatsapp || null,
        endereco: client.endereco || null,
        bairro: client.bairro || null,
        cidade: client.cidade || null,
        cep: client.cep || null,
        estado: client.estado || null,
        data_nascimento: client.dataNascimento || null,
        profissao: client.profissao || null,
        empresa: client.empresa || null,
        observacoes: client.observacoes || null,
        ultima_compra: client.ultimaCompra || null,
        valor_ultima_compra: client.valorUltimaCompra || 0
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
    
    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone || '',
      whatsapp: data.whatsapp || '',
      endereco: data.endereco || '',
      bairro: data.bairro || '',
      cidade: data.cidade || '',
      cep: data.cep || '',
      estado: data.estado || '',
      dataNascimento: data.data_nascimento || '',
      profissao: data.profissao || '',
      empresa: data.empresa || '',
      observacoes: data.observacoes || '',
      ultimaCompra: data.ultima_compra || '',
      valorUltimaCompra: data.valor_ultima_compra || 0,
      createdAt: data.created_at
    };
  },

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }
};
