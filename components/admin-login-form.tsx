'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, User, LogOut } from 'lucide-react'

export function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showLogout, setShowLogout] = useState(false)
  const router = useRouter()


  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/admin-login' })
      // Forçar redirecionamento para garantir que vá para a página correta
      window.location.href = '/admin-login'
    } catch (error) {
      // Mesmo com erro, redirecionar para a página correta
      window.location.href = '/admin-login'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Testar se as credenciais são as corretas
      if (email !== 'admin@ronaeletrica.com.br' || password !== 'admin123') {
        setError('Credenciais inválidas. Use: admin@ronaeletrica.com.br / admin123')
        setLoading(false)
        return
      }

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin'
      })

      if (result?.error) {
        setError('Erro no servidor: ' + result.error)
      } else if (result?.ok) {
        // Login bem-sucedido, redirecionar
        window.location.href = '/admin'
      } else {
        setError('Erro inesperado no login')
      }
    } catch (err) {
      setError('Erro ao fazer login: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5" />
          <span>Login Administrativo</span>
        </CardTitle>
        <CardDescription>
          Digite suas credenciais para acessar o painel administrativo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@ronaeletrica.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

                      <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md font-medium relative z-10"
                        disabled={loading}
                        onClick={(e) => {
                          e.preventDefault()
                          handleSubmit(e)
                        }}
                      >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Credenciais padrão:</p>
          <p><strong>E-mail:</strong> admin@ronaeletrica.com.br</p>
          <p><strong>Senha:</strong> admin123</p>
        </div>

        <div className="mt-4 pt-4 border-t">
          <button 
            className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 rounded-md font-medium"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2 inline" />
            Fazer Logout (Limpar Sessão)
          </button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Se você está vendo "carregando permissões", clique aqui para limpar a sessão atual
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
