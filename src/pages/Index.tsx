
import { useState, useEffect } from 'react';
import { Plus, Users, Calendar, Mail, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientForm from '@/components/ClientForm';
import ClientList from '@/components/ClientList';
import AutomationPanel from '@/components/AutomationPanel';
import BillingPanel from '@/components/BillingPanel';
import StatsCard from '@/components/StatsCard';
import { clientService } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';

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
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inactiveMonths, setInactiveMonths] = useState(3);

  useEffect(() => {
    loadClients();
  }, []);

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

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      if (editingClient) {
        // Atualizar cliente existente
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
        // Criar novo cliente
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
          </div>
          <Button 
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Clientes"
            value={totalClients}
            icon={Users}
            color="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Novos este Mês"
            value={clientsThisMonth}
            icon={TrendingUp}
            color="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Aniversários este Mês"
            value={birthdaysThisMonth}
            icon={Calendar}
            color="from-purple-500 to-pink-500"
          />
          <StatsCard
            title="Clientes Inativos"
            value={inactiveClients}
            icon={Mail}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="clientes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clientes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="automacao" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Automação
            </TabsTrigger>
            <TabsTrigger value="cobrancas" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cobranças
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clientes">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Lista de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ClientList 
                  clients={clients} 
                  onDeleteClient={deleteClient}
                  onEditClient={editClient}
                />
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
                <AutomationPanel clients={clients} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cobrancas">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Gestão de Cobranças
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BillingPanel clients={clients} />
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
