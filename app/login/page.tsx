import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
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
              <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
              <CardDescription>Acesse sua conta para continuar suas compras</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link href="/cadastro" className="text-primary hover:underline font-medium">
                    Cadastre-se aqui
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
