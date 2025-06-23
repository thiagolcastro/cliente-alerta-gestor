
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ArrowLeft, Plus, Search, Download, Upload, Edit, Trash2, Calendar, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '@/services/clientService';
import { Client } from '@/types/client';
import ClientForm from '@/components/ClientForm';
import ClientList from '@/components/ClientList';

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    if (!searchTerm) {
      setFilteredClients(clients);
      return;
    }

    const filtered = clients.filter(client =>
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      if (selectedClient) {
        await clientService.updateClient(selectedClient.id, clientData);
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso"
        });
      } else {
        await clientService.createClient(clientData);
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso"
        });
      }
      setIsDialogOpen(false);
      setSelectedClient(null);
      loadClients();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar cliente",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientService.deleteClient(id);
        toast({
          title: "Sucesso",
          description: "Cliente excluído com sucesso"
        });
        loadClients();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir cliente",
          variant: "destructive"
        });
      }
    }
  };

  const getBirthdayClients = () => {
    const currentMonth = new Date().getMonth();
    return clients.filter(client => {
      if (!client.dataNascimento) return false;
      const birthMonth = new Date(client.dataNascimento).getMonth();
      return birthMonth === currentMonth;
    });
  };

  const openClientDialog = (client?: Client) => {
    setSelectedClient(client || null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Dashboard
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">Gerenciamento de Clientes</h1>
                  <p className="text-sm text-gray-600">{clients.length} clientes cadastrados</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importar CSV
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openClientDialog()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedClient ? 'Editar Cliente' : 'Novo Cliente'}
                    </DialogTitle>
                  </DialogHeader>
                  <ClientForm
                    client={selectedClient}
                    onSave={handleSaveClient}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Clientes</TabsTrigger>
            <TabsTrigger value="birthdays">Aniversariantes</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Clients List */}
            <ClientList
              clients={filteredClients}
              onEdit={openClientDialog}
              onDelete={handleDeleteClient}
            />
          </TabsContent>

          <TabsContent value="birthdays" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Aniversariantes deste Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getBirthdayClients().length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum aniversariante este mês.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {getBirthdayClients().map((client) => (
                      <div key={client.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {client.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{client.nome}</h3>
                            <p className="text-sm text-gray-600">
                              {client.dataNascimento && new Date(client.dataNascimento).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {client.telefone && (
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Ligar
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-1" />
                            Email
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Clients;
