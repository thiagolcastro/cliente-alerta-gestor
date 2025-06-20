
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seu próprio perfil
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Política para usuários criarem seu próprio perfil
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Política para usuários atualizarem seu próprio perfil
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger para executar a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Habilitar RLS na tabela clients para que apenas usuários autenticados vejam os dados
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados vejam todos os clientes
-- (você pode restringir isso mais tarde se quiser que cada usuário veja apenas seus próprios clientes)
CREATE POLICY "Authenticated users can view clients" 
  ON public.clients 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert clients" 
  ON public.clients 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients" 
  ON public.clients 
  FOR UPDATE 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete clients" 
  ON public.clients 
  FOR DELETE 
  TO authenticated
  USING (true);
