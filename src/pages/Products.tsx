
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductManagement from '@/components/ProductManagement';

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Gerenciamento de Produtos</h1>
                <p className="text-sm text-gray-600">Gerencie seu catálogo de semi-joias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Management Component */}
      <ProductManagement />
    </div>
  );
};

export default Products;
