
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Sparkles, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PublicHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-amber-600" />
              <Sparkles className="w-6 h-6 text-rose-500" />
              <h1 className="text-2xl font-serif text-gray-800">Semi-Joias Elegantes</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/catalog')}
                className="border-amber-600 text-amber-600 hover:bg-amber-50"
              >
                Catálogo
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            <div className="mb-12">
              <div className="relative mx-auto w-full max-w-2xl h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Semi-joias elegantes"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-serif text-gray-800 mb-6">
                Sua beleza, seu
                <span className="text-amber-600 block">brilho</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Descubra nossa coleção exclusiva de semi-joias que realçam sua elegância natural. 
                Peças únicas para momentos especiais.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button 
                  size="lg"
                  onClick={() => navigate('/catalog')}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ver Catálogo
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-4 text-lg font-semibold rounded-full"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Nossa História
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif text-gray-800 mb-4">Por que escolher nossas semi-joias?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Qualidade excepcional, design exclusivo e preços justos para você brilhar em qualquer ocasião.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Qualidade Premium</h4>
              <p className="text-gray-600">Materiais de alta qualidade com acabamento perfeito e durabilidade garantida.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Design Exclusivo</h4>
              <p className="text-gray-600">Peças únicas criadas especialmente para realçar sua beleza natural.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Brilho Duradouro</h4>
              <p className="text-gray-600">Tratamento especial que mantém o brilho e a cor por muito mais tempo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-8 h-8 text-amber-400" />
              <Sparkles className="w-6 h-6 text-rose-400" />
              <h2 className="text-2xl font-serif">Semi-Joias Elegantes</h2>
            </div>
            <p className="text-gray-400 mb-6">Sua beleza, seu brilho</p>
            <p className="text-sm text-gray-500">© 2024 Semi-Joias Elegantes. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHomePage;
