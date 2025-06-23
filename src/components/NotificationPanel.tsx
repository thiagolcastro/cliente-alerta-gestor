
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageSquare, Mail } from 'lucide-react';
import { Client } from '@/types/client';
import { ClientTag } from './ClientTags';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPanelProps {
  clients: Client[];
  clientTags: { [clientId: string]: ClientTag[] };
}

const NotificationPanel = ({ clients, clientTags }: NotificationPanelProps) => {
  const { toast } = useToast();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'whatsapp'>('email');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sending, setSending] = useState(false);

  // Obter todas as tags únicas
  const allTags = React.useMemo(() => {
    const tagsSet = new Set();
    Object.values(clientTags).flat().forEach(tag => tagsSet.add(JSON.stringify(tag)));
    return Array.from(tagsSet).map(tag => JSON.parse(tag as string));
  }, [clientTags]);

  // Filtrar clientes por tag
  const filteredClients = React.useMemo(() => {
    if (filterTag === 'all') return clients;
    
    return clients.filter(client => {
      const clientTagIds = clientTags[client.id]?.map(tag => tag.id) || [];
      return clientTagIds.includes(filterTag);
    });
  }, [clients, filterTag, clientTags]);

  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const selectAllClients = () => {
    setSelectedClients(filteredClients.map(client => client.id));
  };

  const clearSelection = () => {
    setSelectedClients([]);
  };

  const sendNotifications = async () => {
    if (selectedClients.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um cliente para enviar a notificação.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }

    if (channel === 'email' && !subject.trim()) {
      toast({
        title: "Erro",
        description: "Digite um assunto para o email.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    try {
      const selectedClientData = clients.filter(client => selectedClients.includes(client.id));
      let successCount = 0;
      let errorCount = 0;

      for (const client of selectedClientData) {
        try {
          if (channel === 'email') {
            if (!client.email) {
              console.warn(`Cliente ${client.nome} não possui email`);
              errorCount++;
              continue;
            }

            const html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">Olá, ${client.nome}!</h2>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
                <p style="color: #64748b; font-size: 14px;">
                  Esta mensagem foi enviada através do seu sistema de gerenciamento de clientes.
                </p>
              </div>
            `;

            const { error } = await supabase.functions.invoke('send-email-notification', {
              body: {
                to: client.email,
                subject: subject,
                html: html
              }
            });

            if (error) {
              console.error(`Erro ao enviar email para ${client.nome}:`, error);
              errorCount++;
            } else {
              successCount++;
            }
          } else {
            // WhatsApp
            if (!client.whatsapp) {
              console.warn(`Cliente ${client.nome} não possui WhatsApp`);
              errorCount++;
              continue;
            }

            const whatsappMessage = `Olá, ${client.nome}!\n\n${message}`;

            const { error } = await supabase.functions.invoke('send-whatsapp-message', {
              body: {
                to: client.whatsapp,
                message: whatsappMessage
              }
            });

            if (error) {
              console.error(`Erro ao enviar WhatsApp para ${client.nome}:`, error);
              errorCount++;
            } else {
              successCount++;
            }
          }
        } catch (error) {
          console.error(`Erro ao processar cliente ${client.nome}:`, error);
          errorCount++;
        }
      }

      // Mostrar resultado
      if (successCount > 0 && errorCount === 0) {
        toast({
          title: "Mensagens enviadas com sucesso!",
          description: `${successCount} mensagem(ns) enviada(s) via ${channel === 'email' ? 'email' : 'WhatsApp'}.`,
        });
      } else if (successCount > 0 && errorCount > 0) {
        toast({
          title: "Envio parcialmente concluído",
          description: `${successCount} enviada(s) com sucesso, ${errorCount} falharam.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erro no envio",
          description: `Não foi possível enviar as mensagens. Verifique as configurações.`,
          variant: "destructive",
        });
      }

      // Limpar formulário em caso de sucesso
      if (successCount > 0) {
        setMessage('');
        setSubject('');
        setSelectedClients([]);
      }

    } catch (error) {
      console.error('Erro geral no envio:', error);
      toast({
        title: "Erro no envio",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuração da campanha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Nova Campanha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="channel">Canal de Envio</Label>
              <Select value={channel} onValueChange={(value: 'email' | 'whatsapp') => setChannel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o canal" />
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
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filterTag">Filtrar por Etiqueta</Label>
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as etiquetas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as etiquetas</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {channel === 'email' && (
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Digite o assunto do email"
              />
            </div>
          )}

          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Digite sua mensagem ${channel === 'whatsapp' ? 'do WhatsApp' : 'de email'} aqui...`}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seleção de clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Selecionar Destinatários ({filteredClients.length} clientes)</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllClients}>
                Selecionar Todos
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Limpar Seleção
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredClients.map(client => (
              <div
                key={client.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedClients.includes(client.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleClientSelection(client.id)}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => handleClientSelection(client.id)}
                    className="mr-2"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{client.nome}</p>
                    <p className="text-xs text-gray-600">
                      {channel === 'email' ? client.email : client.whatsapp || 'WhatsApp não cadastrado'}
                    </p>
                  </div>
                </div>
                {clientTags[client.id] && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {clientTags[client.id].map(tag => (
                      <Badge key={tag.id} className={`text-xs ${tag.color}`}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedClients.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                {selectedClients.length} cliente(s) selecionado(s) para receber a mensagem via {channel === 'email' ? 'email' : 'WhatsApp'}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botão de envio */}
      <div className="flex justify-end">
        <Button
          onClick={sendNotifications}
          disabled={sending || selectedClients.length === 0}
          className="bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Enviar {channel === 'email' ? 'Emails' : 'WhatsApp'} ({selectedClients.length})
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPanel;
