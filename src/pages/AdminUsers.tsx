
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminUserManagement from '@/components/AdminUserManagement';

const AdminUsers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Menu
            </Button>
            <h1 className="text-2xl font-semibold">Gerenciamento de Usuários Administrativos</h1>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <AdminUserManagement />
      </div>
    </div>
  );
};

export default AdminUsers;
