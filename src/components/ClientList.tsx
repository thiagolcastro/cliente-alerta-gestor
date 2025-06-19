import { useState } from 'react';
import { Search, Trash2, Phone, Mail as MailIcon, Calendar, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Client } from '@/pages/Index';

interface ClientListProps {
  clients: Client[];
  onDeleteClient: (id: string) => void;
  onEditClient: (client: Client) => void;
}

const ClientList = ({ clients, onDeleteClient, onEditClient }: ClientListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telefone.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isInactive = (ultimaCompra: string) => {
    if (!ultimaCompra) return true;
    const lastPurchase = new Date(ultimaCompra);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return lastPurchase < threeMonthsAgo;
  };

  const isBirthdayThisMonth = (dataNascimento: string) => {
    if (!dataNascimento) return false;
    const birthday = new Date(dataNascimento);
    const now = new Date();
    return birthday.getMonth() === now.getMonth();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {clients.length === 0 ? (
            <p>Nenhum cliente cadastrado ainda.</p>
          ) : (
            <p>Nenhum cliente encontrado com os critérios de busca.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredClients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{client.nome}</h3>
                      {isBirthdayThisMonth(client.dataNascimento) && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Aniversário
                        </span>
                      )}
                      {isInactive(client.ultimaCompra) && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Inativo
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4" />
                        {client.email}
                      </div>
                      {client.telefone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {client.telefone}
                        </div>
                      )}
                      {client.dataNascimento && (
                        <div>
                          <strong>Nascimento:</strong> {formatDate(client.dataNascimento)}
                        </div>
                      )}
                      {client.ultimaCompra && (
                        <div>
                          <strong>Última compra:</strong> {formatDate(client.ultimaCompra)}
                        </div>
                      )}
                      {client.valorUltimaCompra > 0 && (
                        <div>
                          <strong>Valor:</strong> {formatCurrency(client.valorUltimaCompra)}
                        </div>
                      )}
                      {client.cidade && client.estado && (
                        <div>
                          <strong>Local:</strong> {client.cidade}, {client.estado}
                        </div>
                      )}
                    </div>
                    
                    {client.observacoes && (
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Obs:</strong> {client.observacoes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditClient(client)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteClient(client.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientList;
