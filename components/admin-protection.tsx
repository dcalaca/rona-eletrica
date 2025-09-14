'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface AdminProtectionProps {
  children: React.ReactNode
}

export function AdminProtection({ children }: AdminProtectionProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Ainda carregando

    if (!session) {
      // Não está logado, redirecionar para login
      if (!isRedirecting) {
        setIsRedirecting(true)
        router.push('/admin-login')
      }
      return
    }

    if (session.user?.role !== 'admin') {
      // Não é admin, redirecionar para página de acesso negado
      if (!isRedirecting) {
        setIsRedirecting(true)
        router.push('/unauthorized')
      }
      return
    }
  }, [session, status, router, isRedirecting])

  // Mostrar loading enquanto verifica autenticação
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  // Se não está logado ou não é admin, mostrar mensagem de redirecionamento
  if (!session || session.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecionando para login...</p>
        </div>
      </div>
    )
  }

  // Se é admin, renderizar o conteúdo
  return <>{children}</>
}
