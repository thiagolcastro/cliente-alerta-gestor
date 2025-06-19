
import { useState, useEffect } from 'react';
import { DollarSign, Send, Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/pages/Index';

interface BillingItem {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  description: string;
  daysToSend: number;
  message: string;
  createdAt: string;
}

interface BillingPanelProps {
  clients: Client[];
}

const BillingPanel = ({ clients }: BillingPanelProps) => {
  const { toast } = useToast();
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: 0,
    description: '',
    daysToSend: 7,
    message: 'Prezado(a) cliente, temos uma cobrança pendente em seu nome. Por favor, entre em contato conosco para regularizar a situação.'
  });

  const addBillingItem = () => {
    if (!formData.clientId || !formData.amount || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const selectedClient = clients.find(c => c.id === formData.clientId);
    if (!selectedClient) return;

    const newBillingItem: BillingItem = {
      id: Date.now().toString(),
      clientId: formData.clientId,
      clientName: selectedClient.nome,
      amount: formData.amount,
      description: formData.description,
      daysToSend: formData.daysToSend,
      message: formData.message,
      createdAt: new Date().toISOString()
    };

    setBillingItems([...billingItems, newBillingItem]);
    setFormData({
      clientId: '',
      amount: 0,
      description: '',
      daysToSend: 7,
      message: 'Prezado(a) cliente, temos uma cobrança pendente em seu nome. Por favor, entre em contato conosco para regularizar a situação.'
    });
    setShowForm(false);

    toast({
      title: "Cobrança Adicionada!",
      description: `Cobrança para ${selectedClient.nome} foi adicionada. Email será enviado em ${formData.daysToSend} dias.`,
    });
  };

  const removeBillingItem = (id: string) => {
    setBillingItems(billingItems.filter(item => item.id !== id));
    toast({
      title: "Cobrança Removida",
      description: "A cobrança foi removida com sucesso.",
    });
  };

  const sendBillingEmail = async (item: BillingItem) => {
    try {
      const client = clients.find(c => c.id === item.clientId);
      if (!client) return;

      // Simular envio via Edge Function
      console.log(`Enviando email de cobrança para ${client.nome}: ${item.message}`);
      
      toast({
        title: "Email de Cobrança Enviado!",
        description: `Email enviado para ${client.nome}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao Enviar Email",
        description: "Houve um problema ao enviar o email de cobrança.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gerenciamento de Cobranças</h3>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Cobrança
        </Button>
      </div>

      {/* Lista de Cobranças */}
      <div className="space-y-3">
        {billingItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Nenhuma cobrança cadastrada ainda.
            </CardContent>
          </Card>
        ) : (
          billingItems.map((item) => (
            <Card key={item.id} className="border-red-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-red-600" />
                      <h4 className="font-semibold">{item.clientName}</h4>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Descrição:</strong> {item.description}</p>
                      <p><strong>Criado em:</strong> {formatDate(item.createdAt)}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Email automático em {item.daysToSend} dias</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                      <strong>Mensagem:</strong> {item.message}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendBillingEmail(item)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBillingItem(item.id)}
                      className="text-gray-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Formulário de Nova Cobrança */}
      {showForm && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Nova Cobrança</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client">Cliente *</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome} - {client.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="daysToSend">Enviar email em (dias)</Label>
                <Select value={formData.daysToSend.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, daysToSend: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 dia</SelectItem>
                    <SelectItem value="3">3 dias</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ex: Serviços de consultoria - Janeiro 2024"
              />
            </div>

            <div>
              <Label htmlFor="message">Mensagem do Email</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={addBillingItem} className="flex-1 bg-red-600 hover:bg-red-700">
                Criar Cobrança
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingPanel;
