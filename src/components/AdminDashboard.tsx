
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  LogOut,
  Settings,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '@/services/clientService';
import { productService } from '@/services/productService';
import { Client } from '@/types/client';
import { Product } from '@/services/productService';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    totalClients: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    birthdayClients: 0
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [clientsData, productsData] = await Promise.all([
        clientService.getAllClients(),
        productService.getAllProducts()
      ]);

      setClients(clientsData);
      setProducts(productsData);

      // Calculate birthday clients (this month)
      const currentMonth = new Date().getMonth();
      const birthdayClients = clientsData.filter(client => {
        if (!client.dataNascimento) return false;
        const birthMonth = new Date(client.dataNascimento).getMonth();
        return birthMonth === currentMonth;
      }).length;

      // Calculate low stock products
      const lowStockProducts = productsData.filter(product => {
        return product.inventory && product.inventory.some(inv => 
          inv.quantity <= (inv.low_stock_threshold || 5)
        );
      }).length;

      setStats({
        totalClients: clientsData.length,
        totalProducts: productsData.length,
        lowStockProducts,
        birthdayClients
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sucesso",
        description: "Logout realizado com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
              <Sparkles className="w-6 h-6 text-rose-500" />
              <div>
                <h1 className="text-2xl font-serif text-gray-800">Semi-Joias Elegantes</h1>
                <p className="text-sm text-gray-600">Painel Administrativo</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {user?.user_metadata?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin-users')}
                className="flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Usuários
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total de Clientes</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalClients}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total de Produtos</p>
                  <p className="text-3xl font-bold text-green-900">{stats.totalProducts}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-600 text-sm font-medium">Aniversariantes</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.birthdayClients}</p>
                </div>
                <Calendar className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Estoque Baixo</p>
                  <p className="text-3xl font-bold text-red-900">{stats.lowStockProducts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/clients')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-600" />
                Gerenciar Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Cadastre, edite e gerencie seus clientes. Visualize dados de contato e histórico de compras.
              </p>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {stats.totalClients} clientes
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-green-600" />
                Gerenciar Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Adicione novos produtos, gerencie estoque e organize seu catálogo de semi-joias.
              </p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {stats.totalProducts} produtos
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/catalog')}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                Visualizar Loja
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">
                Veja como seus produtos aparecem na loja online para os clientes.
              </p>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Loja Online
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
