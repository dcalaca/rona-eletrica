import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta área administrativa.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Apenas administradores autorizados podem acessar o painel administrativo.
            Se você acredita que deveria ter acesso, entre em contato com o administrador do sistema.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Ir para o Site
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/admin-login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tentar Login Novamente
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
