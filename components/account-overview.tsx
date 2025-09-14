'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Heart, MapPin, TrendingUp, Clock, Loader2 } from "lucide-react"
import Link from "next/link"
import { useMyAccount } from "@/components/my-account-provider"
import { useSession } from "next-auth/react"

export function AccountOverview() {
  const { data: session, status } = useSession()
  const { user, addresses, wishlist, loading } = useMyAccount()

  // Dados reais do usuário
  const stats = {
    totalOrders: 0, // Será implementado com API de pedidos
    favoriteItems: wishlist?.length || 0,
    savedAddresses: addresses?.length || 0,
    loyaltyPoints: 0, // Será implementado depois
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando dados da conta...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center p-8">
        <p>Você precisa estar logado para acessar esta página.</p>
      </div>
    )
  }

  // Pedidos reais serão implementados depois
  const recentOrders: any[] = []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Entregue":
        return "bg-green-100 text-green-800"
      case "Em trânsito":
        return "bg-blue-100 text-blue-800"
      case "Processando":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }


  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo de volta, {user?.name || session.user?.name || 'Usuário'}!</CardTitle>
          <CardDescription>Aqui está um resumo da sua conta e atividades recentes</CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <p className="text-sm text-muted-foreground">Pedidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.favoriteItems}</p>
                <p className="text-sm text-muted-foreground">Favoritos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.savedAddresses}</p>
                <p className="text-sm text-muted-foreground">Endereços</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.loyaltyPoints}</p>
                <p className="text-sm text-muted-foreground">Pontos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>Seus últimos pedidos realizados</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/minha-conta/pedidos">Ver Todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(order.date).toLocaleDateString("pt-BR")}</span>
                        <span>•</span>
                        <span>
                          {order.items} {order.items === 1 ? "item" : "itens"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Você ainda não fez nenhum pedido</p>
              <p className="text-sm text-muted-foreground mb-4">
                Explore nossos produtos e faça seu primeiro pedido!
              </p>
              <Button asChild>
                <Link href="/produtos">Ver Produtos</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais usadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/minha-conta/pedidos">
                <Package className="h-6 w-6 mb-2" />
                Rastrear Pedido
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/minha-conta/favoritos">
                <Heart className="h-6 w-6 mb-2" />
                Ver Favoritos
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent" asChild>
              <Link href="/minha-conta/enderecos">
                <MapPin className="h-6 w-6 mb-2" />
                Gerenciar Endereços
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
