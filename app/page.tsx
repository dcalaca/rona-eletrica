import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Wrench, Shield, Truck, Star, ArrowRight, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4" variant="secondary">
                  Fundada em 2016 - CNPJ: 26.244.711/0001-03
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
                  Materiais Elétricos e Hidráulicos de
                  <span className="text-primary"> Qualidade</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 text-pretty">
                  Especializada em materiais elétricos e hidráulicos, instalação, reparos e caminhão muque para instalação de postes. 
                  Atendimento de Segunda a Sexta das 07h30 às 17h30, Sábado das 07h30 às 12h00.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg px-8">
                    Ver Produtos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                    WhatsApp: (14) 99145-4789
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img src="/loja-de-materiais-el-tricos-moderna-com-produtos-o.jpg" alt="Loja Rona Elétrica" className="rounded-lg shadow-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Por que escolher a Rona Elétrica?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Oferecemos qualidade, variedade e atendimento especializado para todos os seus projetos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Materiais Elétricos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Fios, cabos, disjuntores, tomadas e tudo para instalações elétricas</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Materiais Hidráulicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Tubos, conexões, registros e equipamentos para sistemas hidráulicos</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Qualidade Garantida</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Produtos das melhores marcas com garantia e certificação</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Serviços Especializados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Instalação, reparos e caminhão muque para instalação de postes</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Principais Categorias</h2>
              <p className="text-xl text-muted-foreground">Explore nossa ampla variedade de produtos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Fios e Cabos",
                  description: "Fios e cabos elétricos de todas as bitolas",
                  image: "/fios-e-cabos-el-tricos-organizados.jpg",
                },
                {
                  title: "Disjuntores",
                  description: "Disjuntores e dispositivos de proteção",
                  image: "/disjuntores-el-tricos-em-quadro.jpg",
                },
                {
                  title: "Tubos e Conexões",
                  description: "Tubos PVC, PPR e conexões hidráulicas",
                  image: "/tubos-e-conex-es-hidr-ulicas.jpg",
                },
                {
                  title: "Ferramentas",
                  description: "Ferramentas elétricas e manuais",
                  image: "/ferramentas-el-tricas-profissionais.jpg",
                },
                {
                  title: "Iluminação",
                  description: "Lâmpadas LED, luminárias e acessórios",
                  image: "/l-mpadas-led-e-lumin-rias-modernas.jpg",
                },
                {
                  title: "Bombas d'Água",
                  description: "Bombas centrífugas e pressurizadoras",
                  image: "/bombas-d--gua-e-pressurizadores.jpg",
                },
              ].map((category, index) => (
                <Card key={index} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
              <p className="text-xl text-muted-foreground">Depoimentos de quem confia na Rona Elétrica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "João Silva",
                  role: "Eletricista",
                  content: "Sempre encontro tudo que preciso na Rona. Produtos de qualidade e preço justo. Recomendo!",
                  rating: 5,
                },
                {
                  name: "Maria Santos",
                  role: "Engenheira Civil",
                  content: "Atendimento excelente e entrega rápida. Já indiquei para vários colegas da área.",
                  rating: 5,
                },
                {
                  name: "Carlos Oliveira",
                  role: "Construtor",
                  content: "Parceria de anos! Sempre me ajudam a encontrar a melhor solução para cada projeto.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Pronto para começar seu projeto?</h2>
            <p className="text-xl mb-8 opacity-90">Entre em contato conosco e receba atendimento especializado</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                <Phone className="mr-2 h-5 w-5" />
                (14) 99145-4789
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
