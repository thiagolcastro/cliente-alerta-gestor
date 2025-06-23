import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types/client';

interface ClientFormProps {
  onSubmit: (client: any) => void;
  onCancel: () => void;
  initialData?: Client | null;
}

const ClientForm = ({ onSubmit, onCancel, initialData }: ClientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    endereco: '',
    bairro: '',
    cidade: '',
    cep: '',
    estado: '',
    dataNascimento: '',
    profissao: '',
    empresa: '',
    observacoes: '',
    ultimaCompra: '',
    valorUltimaCompra: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        email: initialData.email || '',
        telefone: initialData.telefone || '',
        whatsapp: initialData.whatsapp || '',
        endereco: initialData.endereco || '',
        bairro: initialData.bairro || '',
        cidade: initialData.cidade || '',
        cep: initialData.cep || '',
        estado: initialData.estado || '',
        dataNascimento: initialData.dataNascimento || '',
        profissao: initialData.profissao || '',
        empresa: initialData.empresa || '',
        observacoes: initialData.observacoes || '',
        ultimaCompra: initialData.ultimaCompra || '',
        valorUltimaCompra: initialData.valorUltimaCompra || 0,
      });
    } else {
      // Reset form when not editing
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        whatsapp: '',
        endereco: '',
        bairro: '',
        cidade: '',
        cep: '',
        estado: '',
        dataNascimento: '',
        profissao: '',
        empresa: '',
        observacoes: '',
        ultimaCompra: '',
        valorUltimaCompra: 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valorUltimaCompra' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
          <Input
            id="dataNascimento"
            name="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="profissao">Profissão</Label>
          <Input
            id="profissao"
            name="profissao"
            value={formData.profissao}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="endereco">Endereço</Label>
        <Input
          id="endereco"
          name="endereco"
          value={formData.endereco}
          onChange={handleChange}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="bairro">Bairro</Label>
          <Input
            id="bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cidade">Cidade</Label>
          <Input
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="estado">Estado</Label>
          <Input
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ultimaCompra">Última Compra</Label>
          <Input
            id="ultimaCompra"
            name="ultimaCompra"
            type="date"
            value={formData.ultimaCompra}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="valorUltimaCompra">Valor da Última Compra (R$)</Label>
          <Input
            id="valorUltimaCompra"
            name="valorUltimaCompra"
            type="number"
            step="0.01"
            value={formData.valorUltimaCompra}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          rows={3}
          className="mt-1"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {initialData ? 'Atualizar Cliente' : 'Salvar Cliente'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ClientForm;
