
import { supabase } from '@/hooks/useSupabase';
import { Client } from '@/pages/Index';

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
    
    return data || [];
  },

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([{
        nome: client.nome,
        email: client.email,
        telefone: client.telefone,
        whatsapp: client.whatsapp,
        endereco: client.endereco,
        bairro: client.bairro,
        cidade: client.cidade,
        cep: client.cep,
        estado: client.estado,
        data_nascimento: client.dataNascimento,
        profissao: client.profissao,
        empresa: client.empresa,
        observacoes: client.observacoes,
        ultima_compra: client.ultimaCompra,
        valor_ultima_compra: client.valorUltimaCompra
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
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      cep: data.cep,
      estado: data.estado,
      dataNascimento: data.data_nascimento,
      profissao: data.profissao,
      empresa: data.empresa,
      observacoes: data.observacoes,
      ultimaCompra: data.ultima_compra,
      valorUltimaCompra: data.valor_ultima_compra,
      createdAt: data.created_at
    };
  },

  async updateClient(id: string, client: Partial<Omit<Client, 'id' | 'createdAt'>>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        nome: client.nome,
        email: client.email,
        telefone: client.telefone,
        whatsapp: client.whatsapp,
        endereco: client.endereco,
        bairro: client.bairro,
        cidade: client.cidade,
        cep: client.cep,
        estado: client.estado,
        data_nascimento: client.dataNascimento,
        profissao: client.profissao,
        empresa: client.empresa,
        observacoes: client.observacoes,
        ultima_compra: client.ultimaCompra,
        valor_ultima_compra: client.valorUltimaCompra
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
      telefone: data.telefone,
      whatsapp: data.whatsapp,
      endereco: data.endereco,
      bairro: data.bairro,
      cidade: data.cidade,
      cep: data.cep,
      estado: data.estado,
      dataNascimento: data.data_nascimento,
      profissao: data.profissao,
      empresa: data.empresa,
      observacoes: data.observacoes,
      ultimaCompra: data.ultima_compra,
      valorUltimaCompra: data.valor_ultima_compra,
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
