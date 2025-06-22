
-- Criar tabela de usuários administrativos
CREATE TABLE public.admin_users (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Política para admins verem outros usuários
CREATE POLICY "Admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Criar tabela de categorias de produtos
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  sku TEXT UNIQUE,
  category_id UUID REFERENCES public.product_categories(id),
  material TEXT,
  color TEXT,
  weight DECIMAL(8,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de imagens dos produtos
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de variações de produtos (tamanhos)
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Criar tabela de estoque
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT inventory_product_or_variant CHECK (
    (product_id IS NOT NULL AND variant_id IS NULL) OR 
    (product_id IS NULL AND variant_id IS NOT NULL)
  )
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Políticas para visualização pública (loja online)
CREATE POLICY "Public can view active categories" 
  ON public.product_categories 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Public can view active products" 
  ON public.products 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Public can view product images" 
  ON public.product_images 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.products 
    WHERE id = product_images.product_id AND is_active = true
  ));

CREATE POLICY "Public can view product variants" 
  ON public.product_variants 
  FOR SELECT 
  USING (is_active = true AND EXISTS (
    SELECT 1 FROM public.products 
    WHERE id = product_variants.product_id AND is_active = true
  ));

CREATE POLICY "Public can view inventory" 
  ON public.inventory 
  FOR SELECT 
  USING (true);

-- Políticas para usuários autenticados (administração)
CREATE POLICY "Authenticated users can manage categories" 
  ON public.product_categories 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage products" 
  ON public.products 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage product images" 
  ON public.product_images 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage product variants" 
  ON public.product_variants 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage inventory" 
  ON public.inventory 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inserir algumas categorias padrão
INSERT INTO public.product_categories (name, description) VALUES
('Anéis', 'Anéis elegantes e sofisticados'),
('Brincos', 'Brincos delicados e modernos'),
('Colares', 'Colares únicos e encantadores'),
('Pulseiras', 'Pulseiras estilosas e versáteis');

-- Criar bucket de storage para imagens dos produtos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Política de storage para upload de imagens
CREATE POLICY "Authenticated users can upload product images" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public can view product images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'product-images');
