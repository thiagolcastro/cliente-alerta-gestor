
import { useState } from 'react';
import { Send, Calendar, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { emailService } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/pages/Index';

interface AutomationPanelProps {
  clients: Client[];
  inactiveMonths: number;
  setInactiveMonths: (months: number) => void;
}

const AutomationPanel = ({ clients, inactiveMonths, setInactiveMonths }: AutomationPanelProps) => {
  const { toast } = useToast();
  const [birthdayMessage, setBirthdayMessage] = useState(
    'Parabéns pelo seu aniversário! 🎉 Aproveite nossa promoção especial de aniversário com 15% de desconto em toda nossa coleção de semijoias. Use o código ANIVERSARIO15 em sua próxima compra!'
  );
  const [promotionMessage, setPromotionMessage] = useState(
    'Olá! Temos novidades incríveis esperando por você! ✨ Confira nossa nova coleção de semijoias com peças exclusivas e promoções especiais. Não perca!'
  );
  const [inactiveMessage, setInactiveMessage] = useState(
    'Sentimos sua falta! 💎 Há algum tempo você não visita nossa loja. Que tal conferir nossas novidades? Temos peças lindas esperando por você com condições especiais!'
  );

  const [loading, setLoading] = useState<string>('');

  const birthdayClients = clients.filter(client => {
    if (!client.dataNascimento) return false;
    const birthday = new Date(client.dataNascimento);
    const now = new Date();
    return birthday.getMonth() === now.getMonth();
  });

  const inactiveClients = clients.filter(client => {
    if (!client.ultimaCompra) return true;
    const lastPurchase = new Date(client.ultimaCompra);
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - inactiveMonths);
    return lastPurchase < thresholdDate;
  });

  const handleSendBirthdayEmails = async () => {
    if (birthdayClients.length === 0) {
      toast({
        title: "Nenhum aniversariante",
        description: "Não há clientes aniversariantes este mês.",
        variant: "destructive",
      });
      return;
    }

    setLoading('birthday');
    try {
      await emailService.sendBirthdayEmails(birthdayClients, birthdayMessage);
      toast({
        title: "Emails de aniversário enviados!",
        description: `${birthdayClients.length} email(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar emails",
        description: "Houve um problema ao enviar os emails de aniversário.",
        variant: "destructive",
      });
    } finally {
      setLoading('');
    }
  };

  const handleSendPromotionEmails = async () => {
    if (clients.length === 0) {
      toast({
        title: "Nenhum cliente",
        description: "Não há clientes cadastrados.",
        variant: "destructive",
      });
      return;
    }

    setLoading('promotion');
    try {
      await emailService.sendPromotionEmails(clients, promotionMessage);
      toast({
        title: "Emails promocionais enviados!",
        description: `${clients.length} email(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar emails",
        description: "Houve um problema ao enviar os emails promocionais.",
        variant: "destructive",
      });
    } finally {
      setLoading('');
    }
  };

  const handleSendInactiveEmails = async () => {
    if (inactiveClients.length === 0) {
      toast({
        title: "Nenhum cliente inativo",
        description: `Não há clientes inativos há mais de ${inactiveMonths} meses.`,
        variant: "destructive",
      });
      return;
    }

    setLoading('inactive');
    try {
      await emailService.sendInactiveEmails(inactiveClients, inactiveMessage);
      toast({
        title: "Emails para inativos enviados!",
        description: `${inactiveClients.length} email(s) enviado(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar emails",
        description: "Houve um problema ao enviar os emails para clientes inativos.",
        variant: "destructive",
      });
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuração de Período de Inatividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inactive-months">Considerar cliente inativo após (meses):</Label>
              <Input
                id="inactive-months"
                type="number"
                min="1"
                max="12"
                value={inactiveMonths}
                onChange={(e) => setInactiveMonths(Number(e.target.value))}
                className="w-32"
              />
              <p className="text-sm text-gray-600 mt-1">
                Clientes serão considerados inativos se não compraram há {inactiveMonths} meses ou mais
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emails de aniversário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Emails de Aniversário
            </div>
            <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {birthdayClients.length} aniversariante(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Mensagem para aniversariantes"
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="min-h-24"
            />
            <Button
              onClick={handleSendBirthdayEmails}
              disabled={loading === 'birthday' || birthdayClients.length === 0}
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading === 'birthday' ? 'Enviando...' : `Enviar para ${birthdayClients.length} aniversariante(s)`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emails promocionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Emails Promocionais
            </div>
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              {clients.length} cliente(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Mensagem promocional"
              value={promotionMessage}
              onChange={(e) => setPromotionMessage(e.target.value)}
              className="min-h-24"
            />
            <Button
              onClick={handleSendPromotionEmails}
              disabled={loading === 'promotion' || clients.length === 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading === 'promotion' ? 'Enviando...' : `Enviar para todos os ${clients.length} cliente(s)`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emails para clientes inativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Clientes Inativos
            </div>
            <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
              {inactiveClients.length} inativo(s)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Clientes que não fizeram compras há mais de {inactiveMonths} meses
            </p>
            <Textarea
              placeholder="Mensagem para clientes inativos"
              value={inactiveMessage}
              onChange={(e) => setInactiveMessage(e.target.value)}
              className="min-h-24"
            />
            <Button
              onClick={handleSendInactiveEmails}
              disabled={loading === 'inactive' || inactiveClients.length === 0}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <Send className="mr-2 h-4 w-4" />
              {loading === 'inactive' ? 'Enviando...' : `Enviar para ${inactiveClients.length} cliente(s) inativo(s)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomationPanel;
