
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  last_contact?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}
