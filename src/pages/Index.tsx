import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShoppingBag, BarChart3, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Clientes',
      description: 'Gerenciar clientes e contatos',
      icon: Users,
      action: () => navigate('/clients'),
      color: 'bg-blue-500'
    },
    {
      title: 'Produtos',
      description: 'Catálogo e estoque',
      icon: ShoppingBag,
      action: () => navigate('/products'),
      color: 'bg-green-500'
    },
    {
      title: 'Relatórios',
      description: 'Dashboard e análises',
      icon: BarChart3,
      action: () => navigate('/reports'),
      color: 'bg-purple-500'
    },
    {
      title: 'Usuários Admin',
      description: 'Gerenciar usuários administrativos',
      icon: User,
      action: () => navigate('/admin-users'),
      color: 'bg-red-500'
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema',
      icon: Settings,
      action: () => navigate('/settings'),
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Gerenciamento</h1>
          <p className="text-lg text-gray-600">Bem-vindo ao seu painel de controle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button onClick={item.action} className="w-full">
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">--</div>
                  <div className="text-sm text-gray-600">Total de Clientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">--</div>
                  <div className="text-sm text-gray-600">Produtos Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">--</div>
                  <div className="text-sm text-gray-600">Vendas do Mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
