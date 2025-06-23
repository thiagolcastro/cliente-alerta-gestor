
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Sparkles, Search, Filter, ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService, Product, ProductCategory } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const Catalog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, priceRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories()
      ]);
      
      // Only show active products
      const activeProducts = productsData.filter(product => product.is_active);
      setProducts(activeProducts);
      setCategories(categoriesData.filter(cat => cat.is_active));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-50':
          filtered = filtered.filter(product => product.price < 50);
          break;
        case '50-100':
          filtered = filtered.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case '100-200':
          filtered = filtered.filter(product => product.price >= 100 && product.price <= 200);
          break;
        case 'over-200':
          filtered = filtered.filter(product => product.price > 200);
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.is_primary);
      return primaryImage?.image_url || product.images[0].image_url;
    }
    return 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700">Carregando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
              
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-amber-600" />
                <Sparkles className="w-6 h-6 text-rose-500" />
                <h1 className="text-2xl font-serif text-gray-800">Catálogo</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os preços</SelectItem>
                <SelectItem value="under-50">Até R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                <SelectItem value="over-200">Acima de R$ 200</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:scale-105"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-full p-2 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast({
                          title: "❤️ Favorito",
                          description: `${product.name} foi adicionado aos favoritos!`
                        });
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {product.compare_price && product.compare_price > product.price && (
                    <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                      -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                    </Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {product.short_description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-amber-600">
                            R$ {product.price.toFixed(2)}
                          </span>
                          {product.compare_price && product.compare_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              R$ {product.compare_price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        {product.category?.name && (
                          <Badge variant="outline" className="text-xs">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>

                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({
                            title: "🛒 Adicionado!",
                            description: `${product.name} foi adicionado ao carrinho!`
                          });
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
