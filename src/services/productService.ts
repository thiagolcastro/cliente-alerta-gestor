
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  sku?: string;
  category_id?: string;
  material?: string;
  color?: string;
  weight?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
  };
  images?: ProductImage[];
  variants?: ProductVariant[];
  inventory?: InventoryItem[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku?: string;
  price_adjustment: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface InventoryItem {
  id: string;
  product_id?: string;
  variant_id?: string;
  quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories(name),
        images:product_images(*),
        variants:product_variants(*),
        inventory(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
    
    return data || [];
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories(name),
        images:product_images(*),
        variants:product_variants(*),
        inventory(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
    
    return data;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: product.name,
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        compare_price: product.compare_price,
        sku: product.sku,
        category_id: product.category_id,
        material: product.material,
        color: product.color,
        weight: product.weight,
        is_active: product.is_active
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
    
    return data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        compare_price: product.compare_price,
        sku: product.sku,
        category_id: product.category_id,
        material: product.material,
        color: product.color,
        weight: product.weight,
        is_active: product.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
    
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  },

  async getAllCategories(): Promise<ProductCategory[]> {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
    
    return data || [];
  },

  async createCategory(category: Omit<ProductCategory, 'id'>): Promise<ProductCategory> {
    const { data, error } = await supabase
      .from('product_categories')
      .insert([category])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar categoria:', error);
      throw error;
    }
    
    return data;
  },

  async uploadProductImage(file: File, productId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Erro ao fazer upload da imagem:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async addProductImage(productId: string, imageUrl: string, altText?: string, isPrimary = false): Promise<ProductImage> {
    const { data, error } = await supabase
      .from('product_images')
      .insert([{
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText,
        is_primary: isPrimary,
        sort_order: 0
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar imagem do produto:', error);
      throw error;
    }
    
    return data;
  },

  async exportProducts(): Promise<string> {
    const products = await this.getAllProducts();
    const csvContent = this.convertToCSV(products);
    return csvContent;
  },

  async importProducts(csvContent: string): Promise<void> {
    const products = this.parseCSV(csvContent);
    
    for (const product of products) {
      await this.createProduct(product);
    }
  },

  convertToCSV(products: Product[]): string {
    const headers = ['Nome', 'Descrição', 'Preço', 'SKU', 'Categoria', 'Material', 'Cor', 'Peso', 'Ativo'];
    const rows = products.map(product => [
      product.name,
      product.description || '',
      product.price.toString(),
      product.sku || '',
      product.category?.name || '',
      product.material || '',
      product.color || '',
      product.weight?.toString() || '',
      product.is_active ? 'Sim' : 'Não'
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  },

  parseCSV(csvContent: string): Omit<Product, 'id' | 'created_at' | 'updated_at'>[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, ''));
      return {
        name: values[0],
        description: values[1],
        short_description: values[1],
        price: parseFloat(values[2]) || 0,
        sku: values[3],
        material: values[5],
        color: values[6],
        weight: parseFloat(values[7]) || undefined,
        is_active: values[8] === 'Sim'
      };
    }).filter(product => product.name);
  }
};
