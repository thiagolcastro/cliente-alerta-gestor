
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Client } from '@/pages/Index';
import { ClientTag } from './ClientTags';

interface FinancialDashboardProps {
  clients: Client[];
  clientTags: { [clientId: string]: ClientTag[] };
}

const FinancialDashboard = ({ clients, clientTags }: FinancialDashboardProps) => {
  const [filterClient, setFilterClient] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');

  // Simular dados financeiros (substituir por dados reais posteriormente)
  const generateFinancialData = () => {
    return clients.map(client => ({
      ...client,
      valorPendente: Math.random() * 1000,
      valorRecebido: client.valorUltimaCompra || 0,
      status: Math.random() > 0.7 ? 'pendente' : 'pago',
      dataVencimento: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const financialData = useMemo(() => generateFinancialData(), [clients]);

  const filteredData = useMemo(() => {
    return financialData.filter(client => {
      const clientTagIds = clientTags[client.id]?.map(tag => tag.id) || [];
      
      return (
        (filterClient === 'all' || client.id === filterClient) &&
        (filterStatus === 'all' || client.status === filterStatus) &&
        (filterTag === 'all' || clientTagIds.includes(filterTag))
      );
    });
  }, [financialData, filterClient, filterStatus, filterTag, clientTags]);

  const summary = useMemo(() => {
    const total = filteredData.reduce((acc, client) => ({
      recebido: acc.recebido + client.valorRecebido,
      pendente: acc.pendente + client.valorPendente,
      inadimplente: acc.inadimplente + (client.status === 'pendente' && new Date(client.dataVencimento) < new Date() ? client.valorPendente : 0)
    }), { recebido: 0, pendente: 0, inadimplente: 0 });

    return total;
  }, [filteredData]);

  // Dados para os gráficos
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(month => ({
      month,
      recebido: Math.random() * 5000,
      pendente: Math.random() * 2000
    }));
  }, []);

  const statusData = [
    { name: 'Recebido', value: summary.recebido, color: '#10b981' },
    { name: 'Pendente', value: summary.pendente, color: '#f59e0b' },
    { name: 'Inadimplente', value: summary.inadimplente, color: '#ef4444' }
  ];

  // Obter todas as tags únicas
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    Object.values(clientTags).flat().forEach(tag => tagsSet.add(JSON.stringify(tag)));
    return Array.from(tagsSet).map(tag => JSON.parse(tag as string));
  }, [clientTags]);

  const chartConfig = {
    recebido: { label: "Recebido", color: "#10b981" },
    pendente: { label: "Pendente", color: "#f59e0b" }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map(client => (
              <SelectItem key={client.id} value={client.id}>
                {client.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pago">Pago</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por etiqueta" />
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

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Recebidos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.recebido)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valores Pendentes</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.pendente)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.inadimplente)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="recebido" fill="#10b981" />
                  <Bar dataKey="pendente" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const value = typeof data.value === 'number' ? data.value : 0;
                      return (
                        <div className="bg-white p-2 border rounded shadow">
                          <p className="font-medium">{data.payload.name}</p>
                          <p className="text-sm">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialDashboard;
