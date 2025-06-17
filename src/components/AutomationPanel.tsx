
import { useState } from 'react';
import { Send, Calendar, Mail as MailIcon, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/pages/Index';

interface AutomationPanelProps {
  clients: Client[];
}

const AutomationPanel = ({ clients }: AutomationPanelProps) => {
  const { toast } = useToast();
  const [birthdayMessage, setBirthdayMessage] = useState(
    "🎉 Parabéns pelo seu aniversário! Desejamos muito sucesso e felicidades. Aproveite nosso desconto especial de 15% válido até o final do mês!"
  );
  const [promotionMessage, setPromotionMessage] = useState(
    "🎁 Oferta especial só para você! Temos uma promoção imperdível com 20% de desconto em todos os nossos produtos. Válida apenas esta semana!"
  );
  const [inactiveMessage, setInactiveMessage] = useState(
    "Sentimos sua falta! 💙 Que tal dar uma olhadinha nas nossas novidades? Preparamos um desconto especial de 10% para seu retorno!"
  );

  const getBirthdayClients = () => {
    const today = new Date();
    return clients.filter(client => {
      if (!client.dataNascimento) return false;
      const birthday = new Date(client.dataNascimento);
      return birthday.getDate() === today.getDate() && birthday.getMonth() === today.getMonth();
    });
  };

  const getBirthdayClientsThisMonth = () => {
    const today = new Date();
    return clients.filter(client => {
      if (!client.dataNascimento) return false;
      const birthday = new Date(client.dataNascimento);
      return birthday.getMonth() === today.getMonth();
    });
  };

  const getInactiveClients = () => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    return clients.filter(client => {
      if (!client.ultimaCompra) return true;
      const lastPurchase = new Date(client.ultimaCompra);
      return lastPurchase < threeMonthsAgo;
    });
  };

  const sendBirthdayMessages = () => {
    const birthdayClients = getBirthdayClients();
    console.log('Enviando mensagens de aniversário para:', birthdayClients);
    
    toast({
      title: "Mensagens de Aniversário Enviadas!",
      description: `${birthdayClients.length} mensagem(ns) de aniversário enviada(s) com sucesso!`,
    });
  };

  const sendPromotionMessages = () => {
    console.log('Enviando mensagens promocionais para todos os clientes:', clients);
    
    toast({
      title: "Promoção Enviada!",
      description: `Mensagem promocional enviada para ${clients.length} cliente(s)!`,
    });
  };

  const sendInactiveMessages = () => {
    const inactiveClients = getInactiveClients();
    console.log('Enviando mensagens para clientes inativos:', inactiveClients);
    
    toast({
      title: "Mensagens para Inativos Enviadas!",
      description: `${inactiveClients.length} mensagem(ns) enviada(s) para clientes inativos!`,
    });
  };

  const todayBirthdays = getBirthdayClients();
  const monthBirthdays = getBirthdayClientsThisMonth();
  const inactiveClients = getInactiveClients();

  return (
    <div className="space-y-4">
      {/* Birthday Messages */}
      <Card className="border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-purple-700">
            <Calendar className="mr-2 h-4 w-4" />
            Aniversários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p><strong>Hoje:</strong> {todayBirthdays.length} cliente(s)</p>
              <p><strong>Este mês:</strong> {monthBirthdays.length} cliente(s)</p>
            </div>
            <Textarea
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={sendBirthdayMessages}
              disabled={todayBirthdays.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              Enviar para Aniversariantes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Messages */}
      <Card className="border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-green-700">
            <Gift className="mr-2 h-4 w-4" />
            Promoções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p><strong>Total de clientes:</strong> {clients.length}</p>
            </div>
            <Textarea
              value={promotionMessage}
              onChange={(e) => setPromotionMessage(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={sendPromotionMessages}
              disabled={clients.length === 0}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              Enviar Promoção
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Client Messages */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-orange-700">
            <MailIcon className="mr-2 h-4 w-4" />
            Clientes Inativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <p><strong>Inativos (3+ meses):</strong> {inactiveClients.length} cliente(s)</p>
            </div>
            <Textarea
              value={inactiveMessage}
              onChange={(e) => setInactiveMessage(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={sendInactiveMessages}
              disabled={inactiveClients.length === 0}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              Reativar Clientes
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center pt-2">
        💡 As mensagens são simuladas no console do navegador
      </div>
    </div>
  );
};

export default AutomationPanel;
