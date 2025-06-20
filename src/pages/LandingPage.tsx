
import { useState } from 'react';
import { ArrowRight, Star, Heart, Sparkles, Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Maria Silva",
      text: "Peças lindíssimas e com qualidade excepcional! Sempre recebo elogios quando uso.",
      rating: 5
    },
    {
      name: "Ana Costa",
      text: "Atendimento impecável e produtos que realmente fazem a diferença no look.",
      rating: 5
    },
    {
      name: "Julia Santos",
      text: "Minha loja favorita de semijoias! Design único e preços justos.",
      rating: 5
    }
  ];

  const products = [
    {
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
      title: "Colares Elegantes"
    },
    {
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400",
      title: "Brincos Sofisticados"
    },
    {
      image: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400",
      title: "Anéis Exclusivos"
    },
    {
      image: "https://images.unsplash.com/photo-1611652022408-a31d13bfaad4?w=400",
      title: "Pulseiras Delicadas"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-rose-600">Alanna Semijoias</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#sobre" className="text-gray-700 hover:text-rose-600 transition-colors">Sobre</a>
            <a href="#produtos" className="text-gray-700 hover:text-rose-600 transition-colors">Produtos</a>
            <a href="#depoimentos" className="text-gray-700 hover:text-rose-600 transition-colors">Depoimentos</a>
            <a href="#contato" className="text-gray-700 hover:text-rose-600 transition-colors">Contato</a>
          </nav>
          <Button
            onClick={() => window.open('https://catalogo-alanna.kyte.site/en', '_blank')}
            className="bg-rose-600 hover:bg-rose-700"
          >
            Acesse a Loja
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Elegância que 
                <span className="text-rose-600"> Brilha</span> em Você
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Descubra nossa coleção exclusiva de semijoias que combinam sofisticação, 
                qualidade e preços acessíveis. Cada peça é pensada para realçar sua beleza única.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => window.open('https://catalogo-alanna.kyte.site/en', '_blank')}
                  className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-3"
                >
                  Explore a Coleção
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-rose-600 text-rose-600 hover:bg-rose-50 text-lg px-8 py-3"
                >
                  Saiba Mais
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop"
                alt="Semijoias Elegantes"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-bold">4.9/5</span>
                  <span className="text-gray-600">+ 500 clientes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa Essência</h2>
            <p className="text-xl text-gray-600">Valores que guiam cada criação</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <Heart className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Missão</h3>
                <p className="text-gray-600">
                  Democratizar a elegância através de semijoias de alta qualidade, 
                  permitindo que toda mulher se sinta especial e confiante.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <Sparkles className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Visão</h3>
                <p className="text-gray-600">
                  Ser referência em semijoias no Brasil, reconhecida pelo design exclusivo, 
                  qualidade superior e atendimento personalizado.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent>
                <Star className="h-12 w-12 text-rose-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-4">Valores</h3>
                <p className="text-gray-600">
                  Qualidade, autenticidade, inovação e cuidado com cada detalhe. 
                  Acreditamos que beleza e acessibilidade podem andar juntas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Gallery */}
      <section id="produtos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa Coleção</h2>
            <p className="text-xl text-gray-600">Peças únicas para momentos especiais</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg">{product.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={() => window.open('https://catalogo-alanna.kyte.site/en', '_blank')}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Ver Catálogo Completo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que Dizem Nossas Clientes</h2>
            <p className="text-xl text-gray-600">Experiências que nos inspiram</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 text-center">
              <CardContent>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="font-bold text-rose-600">
                  - {testimonials[currentTestimonial].name}
                </p>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-rose-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Pronta para Brilhar?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore nossa coleção completa e encontre a peça perfeita para você
          </p>
          <Button
            size="lg"
            onClick={() => window.open('https://catalogo-alanna.kyte.site/en', '_blank')}
            className="bg-white text-rose-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Acesse Nossa Loja
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
            <p className="text-xl text-gray-600">Estamos aqui para ajudar você</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <Mail className="h-8 w-8 text-rose-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-gray-600">contato@alannasemijoias.com</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <Phone className="h-8 w-8 text-rose-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2">WhatsApp</h3>
                <p className="text-gray-600">(11) 99999-9999</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <Instagram className="h-8 w-8 text-rose-600 mx-auto mb-4" />
                <h3 className="font-bold mb-2">Redes Sociais</h3>
                <div className="flex justify-center space-x-4 mt-2">
                  <Instagram className="h-6 w-6 text-rose-600 hover:text-rose-700 cursor-pointer" />
                  <Facebook className="h-6 w-6 text-rose-600 hover:text-rose-700 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-bold text-rose-400 mb-4">Alanna Semijoias</div>
          <p className="text-gray-400 mb-4">
            Elegância e sofisticação em cada detalhe
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-400">
            <p>&copy; 2024 Alanna Semijoias. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
