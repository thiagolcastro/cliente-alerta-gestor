
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Search, Filter, Star, Sparkles } from 'lucide-react';
import { productService, Product, ProductCategory } from '@/services/productService';

const OnlineStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
      
      // Filtrar apenas produtos ativos
      const activeProducts = productsData.filter(product => product.is_active);
      setProducts(activeProducts);
      setCategories(categoriesData.filter(cat => cat.is_active));
    } catch (error) {
      console.error('Erro ao carregar dados da loja:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    setFilteredProducts(filtered);
  };

  const openProductDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getFeaturedProducts = () => {
    return filteredProducts.slice(0, 6);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 animate-spin mx-auto mb-4 text-amber-600" />
          <p className="text-gray-600">Carregando nossa coleção...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-100 to-rose-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif text-gray-800 mb-6">
              Sua beleza, seu brilho.
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Descubra nossa coleção exclusiva de semi-joias que valorizam sua elegância natural
            </p>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
              Ver Coleção
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif text-center text-gray-800 mb-12">
            Nossas Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Faixa de preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os preços</SelectItem>
                <SelectItem value="0-50">Até R$ 50</SelectItem>
                <SelectItem value="50-100">R$ 50 - R$ 100</SelectItem>
                <SelectItem value="100-200">R$ 100 - R$ 200</SelectItem>
                <SelectItem value="200">Acima de R$ 200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif text-gray-800">
              {searchTerm || selectedCategory ? 'Resultados da Busca' : 'Produtos em Destaque'}
            </h2>
            <span className="text-gray-600">{filteredProducts.length} produtos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
                onClick={() => openProductDialog(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-rose-50 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].image_url}
                      alt={product.images[0].alt_text || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-amber-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" className="bg-white/90">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  {product.compare_price && product.compare_price > product.price && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white">
                        Oferta
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-800">
                        {formatPrice(product.price)}
                      </span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.compare_price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Nenhum produto encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-rose-50 rounded-lg overflow-hidden">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <img
                        src={selectedProduct.images[0].image_url}
                        alt={selectedProduct.images[0].alt_text || selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-24 h-24 text-amber-300" />
                      </div>
                    )}
                  </div>
                  
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded overflow-hidden">
                          <img
                            src={image.image_url}
                            alt={image.alt_text || selectedProduct.name}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-bold text-gray-800">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      {selectedProduct.compare_price && selectedProduct.compare_price > selectedProduct.price && (
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(selectedProduct.compare_price)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="text-gray-600 ml-2">(28 avaliações)</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProduct.short_description && (
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.short_description}
                    </p>
                  )}
                  
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold mb-2">Descrição</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedProduct.material && (
                      <div>
                        <span className="font-semibold">Material:</span>
                        <span className="ml-2">{selectedProduct.material}</span>
                      </div>
                    )}
                    {selectedProduct.color && (
                      <div>
                        <span className="font-semibold">Cor:</span>
                        <span className="ml-2">{selectedProduct.color}</span>
                      </div>
                    )}
                    {selectedProduct.weight && (
                      <div>
                        <span className="font-semibold">Peso:</span>
                        <span className="ml-2">{selectedProduct.weight}g</span>
                      </div>
                    )}
                    {selectedProduct.sku && (
                      <div>
                        <span className="font-semibold">SKU:</span>
                        <span className="ml-2">{selectedProduct.sku}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-3">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Heart className="w-4 h-4 mr-2" />
                      Adicionar aos Favoritos
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif mb-4">Semi-Joias Elegantes</h3>
              <p className="text-gray-400 leading-relaxed">
                Transformando momentos especiais em memórias brilhantes com nossa coleção exclusiva.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Atendimento</h4>
              <div className="space-y-2 text-gray-400">
                <p>WhatsApp: (11) 99999-9999</p>
                <p>Email: contato@semijoias.com</p>
                <p>Seg-Sex: 9h às 18h</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Políticas</h4>
              <div className="space-y-2">
                <a href="#" className="text-gray-400 hover:text-white block">Política de Troca</a>
                <a href="#" className="text-gray-400 hover:text-white block">Frete e Entrega</a>
                <a href="#" className="text-gray-400 hover:text-white block">Garantia</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Receba nossas novidades</p>
              <div className="flex gap-2">
                <Input placeholder="Seu email" className="bg-gray-800 border-gray-700 text-white" />
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Assinar
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Semi-Joias Elegantes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OnlineStore;
