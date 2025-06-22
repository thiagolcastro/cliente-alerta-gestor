
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Upload, Download, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { productService, Product, ProductCategory } from '@/services/productService';

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    compare_price: 0,
    sku: '',
    category_id: '',
    material: '',
    color: '',
    weight: 0,
    is_active: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, productForm);
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso"
        });
      } else {
        await productService.createProduct(productForm);
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso"
        });
      }
      setIsProductDialogOpen(false);
      resetProductForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar produto",
        variant: "destructive"
      });
    }
  };

  const handleSaveCategory = async () => {
    try {
      await productService.createCategory(categoryForm);
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso"
      });
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      loadData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar categoria",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.deleteProduct(id);
        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso"
        });
        loadData();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir produto",
          variant: "destructive"
        });
      }
    }
  };

  const handleExportProducts = async () => {
    try {
      const csvContent = await productService.exportProducts();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'produtos.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Sucesso",
        description: "Produtos exportados com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar produtos",
        variant: "destructive"
      });
    }
  };

  const handleImportProducts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target?.result as string;
          await productService.importProducts(csvContent);
          toast({
            title: "Sucesso",
            description: "Produtos importados com sucesso"
          });
          loadData();
        } catch (error) {
          toast({
            title: "Erro",
            description: "Erro ao importar produtos",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      short_description: '',
      price: 0,
      compare_price: 0,
      sku: '',
      category_id: '',
      material: '',
      color: '',
      weight: 0,
      is_active: true
    });
    setSelectedProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      is_active: true
    });
  };

  const openProductDialog = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price,
        compare_price: product.compare_price || 0,
        sku: product.sku || '',
        category_id: product.category_id || '',
        material: product.material || '',
        color: product.color || '',
        weight: product.weight || 0,
        is_active: product.is_active
      });
    } else {
      resetProductForm();
    }
    setIsProductDialogOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciamento de Produtos</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportProducts} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportProducts}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Produtos ({products.length})</h2>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openProductDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="short_description">Descrição Curta</Label>
                    <Input
                      id="short_description"
                      value={productForm.short_description}
                      onChange={(e) => setProductForm({...productForm, short_description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição Completa</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Preço</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="compare_price">Preço Comparativo</Label>
                      <Input
                        id="compare_price"
                        type="number"
                        step="0.01"
                        value={productForm.compare_price}
                        onChange={(e) => setProductForm({...productForm, compare_price: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={productForm.category_id} onValueChange={(value) => setProductForm({...productForm, category_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={productForm.material}
                        onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="color">Cor</Label>
                      <Input
                        id="color"
                        value={productForm.color}
                        onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Peso (g)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.01"
                        value={productForm.weight}
                        onChange={(e) => setProductForm({...productForm, weight: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProduct}>
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{product.name}</h3>
                        <Badge variant={product.is_active ? "default" : "secondary"}>
                          {product.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.short_description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold">R$ {product.price.toFixed(2)}</span>
                        {product.sku && <span>SKU: {product.sku}</span>}
                        {product.category?.name && <span>Categoria: {product.category.name}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openProductDialog(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categorias ({categories.length})</h2>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCategoryDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Categoria</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="category-name">Nome</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-description">Descrição</Label>
                    <Textarea
                      id="category-description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveCategory}>
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductManagement;
