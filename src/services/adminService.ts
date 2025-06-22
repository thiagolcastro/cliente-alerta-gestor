
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
    // First get the admin users
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (adminError) {
      console.error('Erro ao buscar usuários admin:', adminError);
      throw adminError;
    }

    if (!adminData || adminData.length === 0) {
      return [];
    }

    // Get user details from auth.users (which populates profiles automatically)
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, name')
      .in('id', adminData.map(admin => admin.id));

    if (userError) {
      console.error('Erro ao buscar perfis:', userError);
      // Continue without user data if profiles query fails
    }

    // Combine the data
    const result = adminData.map(admin => ({
      ...admin,
      role: admin.role as 'admin' | 'manager' | 'viewer',
      user: userData?.find(user => user.id === admin.id) || undefined
    }));

    return result as AdminUser[];
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
    
    return {
      ...data,
      role: data.role as 'admin' | 'manager' | 'viewer'
    } as AdminUser;
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
    
    return {
      ...data,
      role: data.role as 'admin' | 'manager' | 'viewer'
    } as AdminUser;
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
