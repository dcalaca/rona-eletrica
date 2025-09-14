import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/cadastro">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao cadastro
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Termos de Uso</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar este site, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                A Rona Elétrica e Hidráulica Ltda oferece uma plataforma online para venda de materiais elétricos e hidráulicos, 
                instalação, reparos e serviços de caminhão muque para instalação de postes.
              </p>

              <h2>3. Cadastro e Conta do Usuário</h2>
              <p>
                Para realizar compras, você deve criar uma conta fornecendo informações precisas e atualizadas. 
                Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.
              </p>

              <h2>4. Produtos e Preços</h2>
              <p>
                Os preços dos produtos estão sujeitos a alterações sem aviso prévio. 
                Nos reservamos o direito de corrigir erros de preços, mesmo após o pedido ter sido confirmado.
              </p>

              <h2>5. Pagamentos</h2>
              <p>
                Aceitamos pagamentos através de cartão de crédito, débito e PIX. 
                O pagamento deve ser efetuado no momento da finalização do pedido.
              </p>

              <h2>6. Entrega</h2>
              <p>
                Os prazos de entrega são estimativas e podem variar conforme a região. 
                Não nos responsabilizamos por atrasos causados por terceiros.
              </p>

              <h2>7. Política de Devolução</h2>
              <p>
                Produtos podem ser devolvidos em até 7 dias após o recebimento, 
                desde que estejam em perfeito estado e com a nota fiscal.
              </p>

              <h2>8. Limitação de Responsabilidade</h2>
              <p>
                A Rona Elétrica e Hidráulica Ltda não se responsabiliza por danos indiretos, 
                lucros cessantes ou outros prejuízos decorrentes do uso dos produtos.
              </p>

              <h2>9. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site, incluindo textos, imagens e logotipos, 
                é propriedade da Rona Elétrica e Hidráulica Ltda.
              </p>

              <h2>10. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de alterar estes termos a qualquer momento. 
                As alterações entrarão em vigor imediatamente após sua publicação.
              </p>

              <h2>11. Contato</h2>
              <p>
                Para dúvidas sobre estes termos, entre em contato conosco:
                <br />
                <strong>Rona Elétrica e Hidráulica Ltda</strong>
                <br />
                CNPJ: 26.244.711/0001-03
                <br />
                Telefone: (14) 99145-4789
                <br />
                Email: contato@ronaeletrica.com.br
              </p>

              <p className="text-sm text-muted-foreground mt-8">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
