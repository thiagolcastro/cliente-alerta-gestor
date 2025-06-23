
export interface Client {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  whatsapp?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cep?: string;
  estado?: string;
  dataNascimento?: string;
  profissao?: string;
  empresa?: string;
  observacoes?: string;
  ultimaCompra?: string;
  valorUltimaCompra?: number;
  createdAt: string;
}
