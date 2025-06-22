
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { adminService, AdminUser } from '@/services/adminService';

const AdminUserManagement = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [userForm, setUserForm] = useState<{
    email: string;
    role: 'admin' | 'manager' | 'viewer';
    is_active: boolean;
  }>({
    email: '',
    role: 'viewer',
    is_active: true
  });

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAdminUsers();
      // Ensure all users have valid roles
      const sanitizedData = data.map(user => ({
        ...user,
        role: (user.role && ['admin', 'manager', 'viewer'].includes(user.role)) ? user.role : 'viewer'
      }));
      setAdminUsers(sanitizedData);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários administrativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      // Ensure role is valid
      if (!userForm.role || !['admin', 'manager', 'viewer'].includes(userForm.role)) {
        toast({
          title: "Erro",
          description: "Por favor, selecione uma função válida",
          variant: "destructive"
        });
        return;
      }

      if (selectedUser) {
        await adminService.updateAdminUser(selectedUser.id, {
          role: userForm.role,
          is_active: userForm.is_active
        });
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso"
        });
      } else {
        // Para criar um novo usuário admin, precisamos primeiro que ele se registre
        toast({
          title: "Informação",
          description: "Para adicionar um novo usuário admin, ele deve primeiro se registrar no sistema"
        });
      }
      setIsDialogOpen(false);
      resetForm();
      loadAdminUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar usuário",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Tem certeza que deseja remover as permissões administrativas deste usuário?')) {
      try {
        await adminService.deleteAdminUser(id);
        toast({
          title: "Sucesso",
          description: "Permissões administrativas removidas com sucesso"
        });
        loadAdminUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover usuário",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setUserForm({
      email: '',
      role: 'viewer',
      is_active: true
    });
    setSelectedUser(null);
  };

  const openDialog = (user?: AdminUser) => {
    if (user) {
      setSelectedUser(user);
      // Ensure the role is valid before setting it
      const validRole = (user.role && ['admin', 'manager', 'viewer'].includes(user.role)) ? user.role : 'viewer';
      setUserForm({
        email: user.user?.email || '',
        role: validRole,
        is_active: user.is_active
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Usuários Administrativos</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Editar Usuário Administrativo' : 'Novo Usuário Administrativo'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {!selectedUser && (
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    placeholder="usuario@exemplo.com"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    O usuário deve primeiro se registrar no sistema
                  </p>
                </div>
              )}
              
              <div>
                <Label htmlFor="role">Função</Label>
                <Select 
                  value={userForm.role} 
                  onValueChange={(value: 'admin' | 'manager' | 'viewer') => {
                    console.log('Role changed to:', value);
                    setUserForm({...userForm, role: value});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="viewer">Visualizador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={userForm.is_active}
                  onCheckedChange={(checked) => setUserForm({...userForm, is_active: checked})}
                />
                <Label htmlFor="is_active">Usuário Ativo</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveUser}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {adminUsers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum usuário administrativo</h3>
              <p className="text-gray-600 mb-4">
                Adicione usuários com permissões administrativas para gerenciar o sistema.
              </p>
            </CardContent>
          </Card>
        ) : (
          adminUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{user.user?.email || 'Email não disponível'}</h3>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    {user.user?.name && (
                      <p className="text-sm text-gray-600 mb-1">{user.user.name}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDialog(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Níveis de Permissão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">Administrador</Badge>
              <span className="text-sm">Acesso total ao sistema</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Gerente</Badge>
              <span className="text-sm">Pode gerenciar produtos e clientes</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-800">Visualizador</Badge>
              <span className="text-sm">Apenas visualização de dados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserManagement;
