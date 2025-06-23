
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Heart, ShoppingCart, Share2, Minus, Plus, Star } from 'lucide-react';
import { productService, Product } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
      
      if (data?.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0].id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Produto não encontrado",
        variant: "destructive"
      });
      navigate('/catalog');
    } finally {
      setLoading(false);
    }
  };

  const getProductImages = () => {
    if (!product?.images || product.images.length === 0) {
      return ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'];
    }
    return product.images.sort((a, b) => a.sort_order - b.sort_order).map(img => img.image_url);
  };

  const getCurrentPrice = () => {
    if (!product) return 0;
    
    if (selectedVariant && product.variants) {
      const variant = product.variants.find(v => v.id === selectedVariant);
      if (variant) {
        return product.price + (variant.price_adjustment || 0);
      }
    }
    
    return product.price;
  };

  const handleAddToCart = () => {
    toast({
      title: "🛒 Adicionado ao carrinho!",
      description: `${quantity}x ${product?.name} foi adicionado ao carrinho.`
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.short_description,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link do produto foi copiado para sua área de transferência."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Produto não encontrado</h2>
          <Button onClick={() => navigate('/catalog')}>
            Voltar ao Catálogo
          </Button>
        </div>
      </div>
    );
  }

  const images = getProductImages();
  const currentPrice = getCurrentPrice();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/catalog')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Catálogo
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">Detalhes do Produto</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden bg-white/90 backdrop-blur-sm">
              <div className="relative aspect-square">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-300"
                />
                
                {product.compare_price && product.compare_price > currentPrice && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    -{Math.round(((product.compare_price - currentPrice) / product.compare_price) * 100)}%
                  </Badge>
                )}
              </div>
            </Card>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer overflow-hidden transition-all ${
                      selectedImage === index ? 'ring-2 ring-amber-500' : 'hover:ring-1 ring-amber-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-0 space-y-6">
                {/* Title and Category */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-serif text-gray-800">{product.name}</h1>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {product.category?.name && (
                    <Badge variant="outline" className="mb-4">
                      {product.category.name}
                    </Badge>
                  )}
                  
                  {product.sku && (
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-amber-600">
                      R$ {currentPrice.toFixed(2)}
                    </span>
                    {product.compare_price && product.compare_price > currentPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        R$ {product.compare_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  {/* Rating (placeholder) */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-4 h-4 fill-amber-400 text-amber-400" 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(4.8 - 24 avaliações)</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  {product.short_description && (
                    <p className="text-gray-700 text-lg leading-relaxed">
                      {product.short_description}
                    </p>
                  )}
                  
                  {product.description && (
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200">
                  {product.material && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Material:</span>
                      <p className="text-gray-800">{product.material}</p>
                    </div>
                  )}
                  
                  {product.color && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Cor:</span>
                      <p className="text-gray-800">{product.color}</p>
                    </div>
                  )}
                  
                  {product.weight && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Peso:</span>
                      <p className="text-gray-800">{product.weight}g</p>
                    </div>
                  )}
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Variação:
                    </label>
                    <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {product.variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.name}
                            {variant.price_adjustment !== 0 && (
                              <span className="ml-2 text-sm text-gray-500">
                                ({variant.price_adjustment > 0 ? '+' : ''}R$ {variant.price_adjustment.toFixed(2)})
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Quantity and Actions */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">
                      Quantidade:
                    </label>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-6 border-amber-600 text-amber-600 hover:bg-amber-50"
                      onClick={() => {
                        toast({
                          title: "❤️ Favorito",
                          description: `${product.name} foi adicionado aos favoritos!`
                        });
                      }}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
