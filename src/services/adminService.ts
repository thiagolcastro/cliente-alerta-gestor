
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  role: 'admin' | 'manager' | 'viewer';
  created_at: string;
  updated_at: string;
  is_active: boolean;
  user?: {
    email: string;
    name?: string;
  };
}

export const adminService = {
  async getAllAdminUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select(`
        *,
        profiles!inner(email, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar usuários admin:', error);
      throw error;
    }
    
    return data?.map(admin => ({
      ...admin,
      user: admin.profiles
    })) || [];
  },

  async createAdminUser(userId: string, role: 'admin' | 'manager' | 'viewer'): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        id: userId,
        role,
        is_active: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar usuário admin:', error);
      throw error;
    }
    
    return data;
  },

  async updateAdminUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    const { data, error } = await supabase
      .from('admin_users')
      .update({
        role: updates.role,
        is_active: updates.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar usuário admin:', error);
      throw error;
    }
    
    return data;
  },

  async deleteAdminUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar usuário admin:', error);
      throw error;
    }
  }
};
