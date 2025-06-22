import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { clientService } from "@/services/clientService";
import { 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Store,
  Package,
  Settings,
  UserCog,
  ShoppingBag,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from "lucide-react";

// Importar os novos componentes
import ProductManagement from "@/components/ProductManagement";
import AdminUserManagement from "@/components/AdminUserManagement";
import OnlineStore from "@/components/OnlineStore";

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
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("store");
  
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clientForm, setClientForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    whatsapp: "",
    endereco: "",
    bairro: "",
    cidade: "",
    cep: "",
    estado: "",
    dataNascimento: "",
    profissao: "",
    empresa: "",
    observacoes: "",
    ultimaCompra: "",
    valorUltimaCompra: 0
  });

  useEffect(() => {
    if (!authLoading && user) {
      loadClients();
    }
  }, [user, authLoading]);

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

  const handleSaveClient = async () => {
    try {
      if (selectedClient) {
        await clientService.updateClient(selectedClient.id, clientForm);
        toast({
          title: "Sucesso",
          description: "Cliente atualizado com sucesso"
        });
      } else {
        await clientService.createClient(clientForm);
        toast({
          title: "Sucesso",
          description: "Cliente criado com sucesso"
        });
      }
      setIsDialogOpen(false);
      resetForm();
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

  const handleExportClients = () => {
    const csvContent = convertToCSV(clients);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Sucesso",
      description: "Clientes exportados com sucesso"
    });
  };

  const handleImportClients = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target?.result as string;
        const importedClients = parseCSV(csvContent);
        
        // Salvar clientes importados
        importedClients.forEach(async (client) => {
          try {
            await clientService.createClient(client);
          } catch (error) {
            console.error('Erro ao importar cliente:', error);
          }
        });
        
        toast({
          title: "Sucesso",
          description: `${importedClients.length} clientes importados com sucesso`
        });
        
        loadClients();
      };
      reader.readAsText(file);
    }
  };

  const convertToCSV = (clients: Client[]) => {
    const headers = ['Nome', 'Email', 'Telefone', 'WhatsApp', 'Endereço', 'Cidade', 'Data Nascimento', 'Profissão'];
    const rows = clients.map(client => [
      client.nome,
      client.email,
      client.telefone,
      client.whatsapp,
      client.endereco,
      client.cidade,
      client.dataNascimento,
      client.profissao
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const parseCSV = (csvContent: string): Omit<Client, 'id' | 'createdAt'>[] => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, ''));
      return {
        nome: values[0] || '',
        email: values[1] || '',
        telefone: values[2] || '',
        whatsapp: values[3] || '',
        endereco: values[4] || '',
        bairro: '',
        cidade: values[5] || '',
        cep: '',
        estado: '',
        dataNascimento: values[6] || '',
        profissao: values[7] || '',
        empresa: '',
        observacoes: '',
        ultimaCompra: '',
        valorUltimaCompra: 0
      };
    }).filter(client => client.nome);
  };

  const resetForm = () => {
    setClientForm({
      nome: "",
      email: "",
      telefone: "",
      whatsapp: "",
      endereco: "",
      bairro: "",
      cidade: "",
      cep: "",
      estado: "",
      dataNascimento: "",
      profissao: "",
      empresa: "",
      observacoes: "",
      ultimaCompra: "",
      valorUltimaCompra: 0
    });
    setSelectedClient(null);
  };

  const openDialog = (client?: Client) => {
    if (client) {
      setSelectedClient(client);
      setClientForm({
        nome: client.nome,
        email: client.email,
        telefone: client.telefone,
        whatsapp: client.whatsapp,
        endereco: client.endereco,
        bairro: client.bairro,
        cidade: client.cidade,
        cep: client.cep,
        estado: client.estado,
        dataNascimento: client.dataNascimento,
        profissao: client.profissao,
        empresa: client.empresa,
        observacoes: client.observacoes,
        ultimaCompra: client.ultimaCompra,
        valorUltimaCompra: client.valorUltimaCompra
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const openViewDialog = (client: Client) => {
    setSelectedClient(client);
    setIsViewDialogOpen(true);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Semi-Joias Elegantes</CardTitle>
            <CardDescription>Faça login para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700"
              onClick={() => window.location.href = '/auth'}
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-serif text-gray-800">Semi-Joias Elegantes</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Olá, {user.email}</span>
              <Button variant="outline" size="sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Loja Online
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="store">
            <OnlineStore />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Gerenciamento de Clientes</h2>
              <div className="flex gap-2">
                <Button onClick={handleExportClients} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
                <label>
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Importar
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportClients}
                    className="hidden"
                  />
                </label>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openDialog()}>
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
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            value={clientForm.nome}
                            onChange={(e) => setClientForm({...clientForm, nome: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={clientForm.email}
                            onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="telefone">Telefone</Label>
                          <Input
                            id="telefone"
                            value={clientForm.telefone}
                            onChange={(e) => setClientForm({...clientForm, telefone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">WhatsApp</Label>
                          <Input
                            id="whatsapp"
                            value={clientForm.whatsapp}
                            onChange={(e) => setClientForm({...clientForm, whatsapp: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input
                          id="endereco"
                          value={clientForm.endereco}
                          onChange={(e) => setClientForm({...clientForm, endereco: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="cidade">Cidade</Label>
                          <Input
                            id="cidade"
                            value={clientForm.cidade}
                            onChange={(e) => setClientForm({...clientForm, cidade: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cep">CEP</Label>
                          <Input
                            id="cep"
                            value={clientForm.cep}
                            onChange={(e) => setClientForm({...clientForm, cep: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="estado">Estado</Label>
                          <Input
                            id="estado"
                            value={clientForm.estado}
                            onChange={(e) => setClientForm({...clientForm, estado: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                          <Input
                            id="dataNascimento"
                            type="date"
                            value={clientForm.dataNascimento}
                            onChange={(e) => setClientForm({...clientForm, dataNascimento: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="profissao">Profissão</Label>
                          <Input
                            id="profissao"
                            value={clientForm.profissao}
                            onChange={(e) => setClientForm({...clientForm, profissao: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveClient}>
                        Salvar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Carregando clientes...</div>
              ) : clients.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum cliente cadastrado</h3>
                    <p className="text-gray-600 mb-4">
                      Comece adicionando seu primeiro cliente ao sistema.
                    </p>
                    <Button onClick={() => openDialog()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Cliente
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                clients.map((client) => (
                  <Card key={client.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{client.nome}</h3>
                          <p className="text-gray-600 mb-2">{client.email}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {client.telefone && (
                              <span>📞 {client.telefone}</span>
                            )}
                            {client.whatsapp && (
                              <span>💬 {client.whatsapp}</span>
                            )}
                            {client.cidade && (
                              <span>📍 {client.cidade}</span>
                            )}
                            {client.dataNascimento && (
                              <span>🎂 {new Date(client.dataNascimento).toLocaleDateString('pt-BR')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openViewDialog(client)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClient(client.id)}
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
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Cadastrados no sistema
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clients.filter(client => {
                      const created = new Date(client.createdAt);
                      const now = new Date();
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clientes novos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aniversariantes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clients.filter(client => {
                      if (!client.dataNascimento) return false;
                      const birth = new Date(client.dataNascimento);
                      const now = new Date();
                      return birth.getMonth() === now.getMonth();
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contatos WhatsApp</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {clients.filter(client => client.whatsapp).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Com WhatsApp
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Client Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Nome</Label>
                  <p>{selectedClient.nome}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p>{selectedClient.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Telefone</Label>
                  <p>{selectedClient.telefone || '-'}</p>
                </div>
                <div>
                  <Label className="font-semibold">WhatsApp</Label>
                  <p>{selectedClient.whatsapp || '-'}</p>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Endereço Completo</Label>
                <p>{[selectedClient.endereco, selectedClient.bairro, selectedClient.cidade, selectedClient.estado, selectedClient.cep].filter(Boolean).join(', ') || '-'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Data de Nascimento</Label>
                  <p>{selectedClient.dataNascimento ? new Date(selectedClient.dataNascimento).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Profissão</Label>
                  <p>{selectedClient.profissao || '-'}</p>
                </div>
              </div>
              
              {selectedClient.observacoes && (
                <div>
                  <Label className="font-semibold">Observações</Label>
                  <p>{selectedClient.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
