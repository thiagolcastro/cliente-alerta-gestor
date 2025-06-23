
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, ShoppingCart, Search, Filter, Star, Sparkles, ShoppingBag, Plus, Minus } from 'lucide-react';
import { productService, Product, ProductCategory } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  product: Product;
  quantity: number;
}

const OnlineStore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao carrinho`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) =>
      total + (item.product.price * item.quantity), 0
    );
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
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
      {/* Header with Cart */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
              <Sparkles className="w-6 h-6 text-rose-500" />
              <h1 className="text-2xl font-serif text-gray-800">Semi-Joias Elegantes</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCartOpen(true)}
                className="relative border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Carrinho
                {getCartItemsCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white">
                    {getCartItemsCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

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
              {searchTerm || selectedCategory ? 'Resultados da Busca' : 'Nossa Coleção'}
            </h2>
            <span className="text-gray-600">{filteredProducts.length} produtos</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden border-0 shadow-lg"
                onClick={() => openProductDialog(product)}
              >
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-rose-50 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].image_url}
                      alt={product.images[0].alt_text || product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-amber-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="outline" className="bg-white/90 border-0 shadow-lg">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  {product.compare_price && product.compare_price > product.price && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white font-semibold">
                        -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                      </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-800 group-hover:text-amber-600 transition-colors duration-300 mb-2">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-800">
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
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-serif">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl overflow-hidden">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <img
                        src={selectedProduct.images[0].image_url}
                        alt={selectedProduct.images[0].alt_text || selectedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.image_url}
                            alt={image.alt_text || selectedProduct.name}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-4xl font-bold text-gray-800">
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
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {selectedProduct.short_description}
                    </p>
                  )}
                  
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Descrição</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm bg-amber-50 p-4 rounded-lg">
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
                  
                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50">
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

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              Carrinho de Compras
            </DialogTitle>
          </DialogHeader>
          
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione produtos para continuar suas compras
              </p>
              <Button onClick={() => setIsCartOpen(false)}>
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">{formatPrice(item.product.price)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-semibold mb-4">
                  <span>Total:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white">
                    Finalizar Compra
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                    Continuar Comprando
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnlineStore;
