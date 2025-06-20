
import { useState } from 'react';
import { Send, Mail, MessageSquare, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/pages/Index';
import { ClientTag } from './ClientTags';

interface NotificationPanelProps {
  clients: Client[];
  clientTags: { [clientId: string]: ClientTag[] };
}

const NotificationPanel = ({ clients, clientTags }: NotificationPanelProps) => {
  const { toast } = useToast();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [messageType, setMessageType] = useState<'email' | 'whatsapp' | 'both'>('email');
  const [campaignType, setCampaignType] = useState<'promocional' | 'lembrete' | 'personalizada'>('promocional');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleClientToggle = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients([...selectedClients, clientId]);
    } else {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClients(clients.map(client => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleSendNotifications = async () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um cliente",
        variant: "destructive"
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulação do envio (substituir por integração real)
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Mensagens enviadas!",
        description: `${selectedClients.length} mensagem(ns) enviada(s) com sucesso`
      });

      setSelectedClients([]);
      setMessage('');
      setSubject('');
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Houve um problema ao enviar as mensagens",
        variant: "destructive"
      });
    }
  };

  const predefinedMessages = {
    promocional: {
      subject: '🌟 Promoção Especial - Semijoias Alanna',
      message: 'Olá {nome}! Temos uma promoção especial esperando por você! Confira nossas novidades e aproveite descontos exclusivos. Acesse: https://catalogo-alanna.kyte.site/en'
    },
    lembrete: {
      subject: '💎 Que saudades! - Semijoias Alanna',
      message: 'Oi {nome}! Notamos que faz um tempo que você não visita nossa loja. Que tal conferir nossas novidades? Temos peças lindas esperando por você!'
    }
  };

  const handleCampaignTypeChange = (type: 'promocional' | 'lembrete' | 'personalizada') => {
    setCampaignType(type);
    if (type !== 'personalizada' && predefinedMessages[type]) {
      setSubject(predefinedMessages[type].subject);
      setMessage(predefinedMessages[type].message);
    } else {
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seleção de Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Selecionar Destinatários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedClients.length === clients.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm font-medium">
                  Selecionar todos ({clients.length})
                </label>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {clients.map(client => (
                  <div key={client.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={client.id}
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) => handleClientToggle(client.id, checked as boolean)}
                      />
                      <div>
                        <label htmlFor={client.id} className="text-sm font-medium cursor-pointer">
                          {client.nome}
                        </label>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {clientTags[client.id]?.slice(0, 2).map(tag => (
                        <span key={tag.id} className={`text-xs px-1 py-0.5 rounded ${tag.color}`}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                {selectedClients.length} cliente(s) selecionado(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuração da Mensagem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Configurar Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo de Canal</label>
                  <Select value={messageType} onValueChange={(value: 'email' | 'whatsapp' | 'both') => setMessageType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="whatsapp">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          WhatsApp
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Ambos
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Tipo de Campanha</label>
                  <Select value={campaignType} onValueChange={handleCampaignTypeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promocional">Promocional</SelectItem>
                      <SelectItem value="lembrete">Lembrete</SelectItem>
                      <SelectItem value="personalizada">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {messageType !== 'whatsapp' && (
                <div>
                  <label className="text-sm font-medium">Assunto</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Assunto do email"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui... Use {nome} para personalizar com o nome do cliente"
                  className="min-h-32"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dica: Use {`{nome}`} para inserir o nome do cliente automaticamente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Envio */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Enviar para {selectedClients.length} cliente(s) via {
                messageType === 'both' ? 'Email e WhatsApp' : 
                messageType === 'email' ? 'Email' : 'WhatsApp'
              }
            </div>
            <Button
              onClick={handleSendNotifications}
              disabled={selectedClients.length === 0 || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagens
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
