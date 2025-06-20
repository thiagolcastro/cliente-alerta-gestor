import { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Mail, TrendingUp, DollarSign, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientForm from '@/components/ClientForm';
import ClientList from '@/components/ClientList';
import AutomationPanel from '@/components/AutomationPanel';
import BillingPanel from '@/components/BillingPanel';
import StatsCard from '@/components/StatsCard';
import ClientTags, { ClientTag } from '@/components/ClientTags';
import FinancialDashboard from '@/components/FinancialDashboard';
import NotificationPanel from '@/components/NotificationPanel';
import Auth from '@/components/Auth';
import { clientService } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Client {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  whatsapp: string;
  endereco: string;
  bairro: string;
  cidade: string;
  cep: string;
  estado: string;
  dataNascimento: string;
  profissao: string;
  empresa: string;
  observacoes: string;
  ultimaCompra: string;
  valorUltimaCompra: number;
  createdAt: string;
}

const Index = () => {
  const { toast } = useToast();
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inactiveMonths, setInactiveMonths] = useState(3);
  const [clientTags, setClientTags] = useState<{ [clientId: string]: ClientTag[] }>({});
  const [availableTags, setAvailableTags] = useState<ClientTag[]>([
    { id: '1', name: 'VIP', color: 'bg-purple-100 text-purple-800' },
    { id: '2', name: 'Atrasado', color: 'bg-red-100 text-red-800' },
    { id: '3', name: 'Em negociação', color: 'bg-yellow-100 text-yellow-800' },
    { id: '4', name: 'Cliente novo', color: 'bg-green-100 text-green-800' }
  ]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  useEffect(() => {
    if (isAuthenticated) {
      loadClients();
    }
  }, [isAuthenticated]);

  const loadClients = async () => {
    try {
      const clientsData = await clientService.getAllClients();
      setClients(clientsData);
    } catch (error) {
      toast({
        title: "Erro ao carregar clientes",
        description: "Houve um problema ao carregar os dados dos clientes.",
        variant: "destructive",
      });
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Houve um problema ao fazer logout.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    }
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      if (editingClient) {
        const updatedClient = await clientService.updateClient(editingClient.id, clientData);
        setClients(clients.map(client => 
          client.id === editingClient.id ? updatedClient : client
        ));
        toast({
          title: "Cliente atualizado!",
          description: "As informações do cliente foram atualizadas com sucesso.",
        });
        setEditingClient(null);
      } else {
        const newClient = await clientService.createClient(clientData);
        setClients([newClient, ...clients]);
        toast({
          title: "Cliente adicionado!",
          description: "O cliente foi adicionado com sucesso.",
        });
      }
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar cliente",
        description: "Houve um problema ao salvar o cliente.",
        variant: "destructive",
      });
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await clientService.deleteClient(id);
      setClients(clients.filter(client => client.id !== id));
      toast({
        title: "Cliente removido",
        description: "O cliente foi removido com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover cliente",
        description: "Houve um problema ao remover o cliente.",
        variant: "destructive",
      });
      console.error('Erro ao remover cliente:', error);
    }
  };

  const editClient = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleAddTag = (clientId: string, tag: ClientTag) => {
    setClientTags(prev => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), tag]
    }));
  };

  const handleRemoveTag = (clientId: string, tagId: string) => {
    setClientTags(prev => ({
      ...prev,
      [clientId]: (prev[clientId] || []).filter(tag => tag.id !== tagId)
    }));
  };

  const handleCreateTag = (newTag: Omit<ClientTag, 'id'>) => {
    const tag: ClientTag = {
      ...newTag,
      id: Date.now().toString()
    };
    setAvailableTags(prev => [...prev, tag]);
  };

  const handleStatsCardClick = (type: string) => {
    setActiveTab('clientes');
    switch (type) {
      case 'inactive':
        setActiveView('clientes-inativos');
        break;
      case 'birthdays':
        setActiveView('aniversarios');
        break;
      case 'new':
        setActiveView('clientes-novos');
        break;
      default:
        setActiveView('clientes');
    }
  };

  const getFilteredClients = () => {
    switch (activeView) {
      case 'clientes-inativos':
        return clients.filter(client => {
          if (!client.ultimaCompra) return true;
          const lastPurchase = new Date(client.ultimaCompra);
          const thresholdDate = new Date();
          thresholdDate.setMonth(thresholdDate.getMonth() - inactiveMonths);
          return lastPurchase < thresholdDate;
        });
      case 'aniversarios':
        return clients.filter(client => {
          if (!client.dataNascimento) return false;
          const birthday = new Date(client.dataNascimento);
          const now = new Date();
          return birthday.getMonth() === now.getMonth();
        });
      case 'clientes-novos':
        return clients.filter(client => {
          const clientDate = new Date(client.createdAt);
          const now = new Date();
          return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
        });
      default:
        return clients;
    }
  };

  // If still loading auth state, show loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => window.location.reload()} />;
  }

  const totalClients = clients.length;
  const clientsThisMonth = clients.filter(client => {
    const clientDate = new Date(client.createdAt);
    const now = new Date();
    return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
  }).length;

  const birthdaysThisMonth = clients.filter(client => {
    if (!client.dataNascimento) return false;
    const birthday = new Date(client.dataNascimento);
    const now = new Date();
    return birthday.getMonth() === now.getMonth();
  }).length;

  const inactiveClients = clients.filter(client => {
    if (!client.ultimaCompra) return true;
    const lastPurchase = new Date(client.ultimaCompra);
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - inactiveMonths);
    return lastPurchase < thresholdDate;
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gerenciador de Clientes
            </h1>
            <p className="text-gray-600 mt-2">Gerencie seus clientes, automatize comunicações e controle cobranças</p>
            {user && (
              <p className="text-sm text-gray-500 mt-1">Bem-vindo, {user.email}</p>
            )}
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button 
              onClick={() => {
                setEditingClient(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Novo Cliente
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="lg"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div onClick={() => handleStatsCardClick('total')} className="cursor-pointer">
            <StatsCard
              title="Total de Clientes"
              value={totalClients}
              icon={Users}
              color="from-blue-500 to-cyan-500"
            />
          </div>
          <div onClick={() => handleStatsCardClick('new')} className="cursor-pointer">
            <StatsCard
              title="Novos este Mês"
              value={clientsThisMonth}
              icon={TrendingUp}
              color="from-green-500 to-emerald-500"
            />
          </div>
          <div onClick={() => handleStatsCardClick('birthdays')} className="cursor-pointer">
            <StatsCard
              title="Aniversários este Mês"
              value={birthdaysThisMonth}
              icon={Calendar}
              color="from-purple-500 to-pink-500"
            />
          </div>
          <div onClick={() => handleStatsCardClick('inactive')} className="cursor-pointer">
            <StatsCard
              title="Clientes Inativos"
              value={inactiveClients}
              icon={Mail}
              color="from-orange-500 to-red-500"
            />
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="financeiro" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="automacao" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Automação
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Campanhas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Dashboard Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FinancialDashboard clients={clients} clientTags={clientTags} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clientes">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    {activeView === 'clientes-inativos' ? 'Clientes Inativos' :
                     activeView === 'aniversarios' ? 'Aniversários este Mês' :
                     activeView === 'clientes-novos' ? 'Clientes Novos' : 'Lista de Clientes'}
                    <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded">
                      {getFilteredClients().length}
                    </span>
                  </div>
                  {activeView !== 'clientes' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView('clientes')}
                      className="text-white hover:bg-white/20"
                    >
                      Ver Todos
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {getFilteredClients().map(client => (
                    <div key={client.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{client.nome}</h3>
                          <p className="text-gray-600">{client.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editClient(client)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteClient(client.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                      <ClientTags
                        clientId={client.id}
                        tags={clientTags[client.id] || []}
                        availableTags={availableTags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        onCreateTag={handleCreateTag}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Painel Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FinancialDashboard clients={clients} clientTags={clientTags} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automacao">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Automação de Emails
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <AutomationPanel clients={clients} inactiveMonths={inactiveMonths} setInactiveMonths={setInactiveMonths} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificacoes">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Notificações e Campanhas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <NotificationPanel clients={clients} clientTags={clientTags} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Client Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                  </h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingClient(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <ClientForm 
                  onSubmit={addClient} 
                  onCancel={() => {
                    setShowForm(false);
                    setEditingClient(null);
                  }}
                  initialData={editingClient}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
