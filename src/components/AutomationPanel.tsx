
import { useState } from 'react';
import { Send, Calendar, Mail as MailIcon, Gift, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/pages/Index';
import { emailService } from '@/services/emailService';

interface AutomationPanelProps {
  clients: Client[];
}

const AutomationPanel = ({ clients }: AutomationPanelProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState({
    birthday: false,
    promotion: false,
    inactive: false
  });
  
  const [inactiveMonths, setInactiveMonths] = useState(3);
  
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
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - inactiveMonths);
    
    return clients.filter(client => {
      if (!client.ultimaCompra) return true;
      const lastPurchase = new Date(client.ultimaCompra);
      return lastPurchase < thresholdDate;
    });
  };

  const sendBirthdayMessages = async () => {
    const birthdayClients = getBirthdayClients();
    setIsLoading(prev => ({ ...prev, birthday: true }));
    
    try {
      await emailService.sendBirthdayEmails(birthdayClients, birthdayMessage);
      toast({
        title: "Emails de Aniversário Enviados!",
        description: `${birthdayClients.length} email(s) de aniversário enviado(s) com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao Enviar Emails",
        description: "Houve um problema ao enviar os emails de aniversário.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, birthday: false }));
    }
  };

  const sendPromotionMessages = async () => {
    setIsLoading(prev => ({ ...prev, promotion: true }));
    
    try {
      await emailService.sendPromotionEmails(clients, promotionMessage);
      toast({
        title: "Emails Promocionais Enviados!",
        description: `Email promocional enviado para ${clients.length} cliente(s)!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao Enviar Emails",
        description: "Houve um problema ao enviar os emails promocionais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, promotion: false }));
    }
  };

  const sendInactiveMessages = async () => {
    const inactiveClients = getInactiveClients();
    setIsLoading(prev => ({ ...prev, inactive: true }));
    
    try {
      await emailService.sendInactiveEmails(inactiveClients, inactiveMessage);
      toast({
        title: "Emails para Inativos Enviados!",
        description: `${inactiveClients.length} email(s) enviado(s) para clientes inativos!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao Enviar Emails",
        description: "Houve um problema ao enviar os emails para clientes inativos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, inactive: false }));
    }
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
              disabled={todayBirthdays.length === 0 || isLoading.birthday}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              {isLoading.birthday ? 'Enviando...' : 'Enviar para Aniversariantes'}
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
              disabled={clients.length === 0 || isLoading.promotion}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              {isLoading.promotion ? 'Enviando...' : 'Enviar Promoção'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inactive Client Messages */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-orange-700">
            <Settings className="mr-2 h-4 w-4" />
            Clientes Inativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="inactiveMonths" className="text-sm">
                Considerar inativo após:
              </Label>
              <Input
                id="inactiveMonths"
                type="number"
                min="1"
                max="12"
                value={inactiveMonths}
                onChange={(e) => setInactiveMonths(parseInt(e.target.value) || 3)}
                className="w-20 h-8"
              />
              <span className="text-sm text-gray-600">meses</span>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Inativos ({inactiveMonths}+ meses):</strong> {inactiveClients.length} cliente(s)</p>
            </div>
            <Textarea
              value={inactiveMessage}
              onChange={(e) => setInactiveMessage(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <Button
              onClick={sendInactiveMessages}
              disabled={inactiveClients.length === 0 || isLoading.inactive}
              className="w-full bg-orange-600 hover:bg-orange-700"
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              {isLoading.inactive ? 'Enviando...' : 'Reativar Clientes'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center pt-2">
        📧 Emails reais serão enviados via Supabase Edge Functions
      </div>
    </div>
  );
};

export default AutomationPanel;
