import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Back button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Criar sua conta</CardTitle>
              <CardDescription>Cadastre-se para ter acesso a ofertas exclusivas</CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
