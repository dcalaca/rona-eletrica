"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from "lucide-react"

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  totalCustomers: number
  customersChange: number
  totalProducts: number
  productsChange: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalCustomers: 0,
    customersChange: 0,
    totalProducts: 0,
    productsChange: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Buscar estatísticas em paralelo
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          fetch('/api/admin/orders?limit=5'),
          fetch('/api/admin/customers?limit=1'),
          fetch('/api/admin/products?limit=1')
        ])

        const ordersData = await ordersRes.json()
        const customersData = await customersRes.json()
        const productsData = await productsRes.json()

        // Calcular receita total
        const totalRevenue = ordersData.orders?.reduce((sum: number, order: any) => 
          sum + (order.total_amount || 0), 0) || 0

        // Calcular mudanças (simulado por enquanto)
        const revenueChange = 12.5 // TODO: Calcular mudança real
        const ordersChange = -2.3 // TODO: Calcular mudança real
        const customersChange = 8.7 // TODO: Calcular mudança real
        const productsChange = 5.2 // TODO: Calcular mudança real

        setStats({
          totalRevenue,
          revenueChange,
          totalOrders: ordersData.pagination?.total || 0,
          ordersChange,
          totalCustomers: customersData.pagination?.total || 0, // Usar total da paginação
          customersChange,
          totalProducts: productsData.pagination?.total || 0, // Usar total da paginação
          productsChange,
        })

        // Definir pedidos recentes
        setRecentOrders(ordersData.orders?.slice(0, 4) || [])

        // Buscar produtos com estoque baixo
        const lowStockRes = await fetch('/api/admin/products?limit=10')
        const lowStockData = await lowStockRes.json()
        
        const lowStock = lowStockData.products?.filter((product: any) => 
          product.stock_quantity <= product.min_stock
        ).slice(0, 4) || []
        
        setLowStockProducts(lowStock)

      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered": return "Entregue"
      case "shipped": return "Enviado"
      case "processing": return "Processando"
      case "cancelled": return "Cancelado"
      case "pending": return "Pendente"
      default: return status
    }
  }

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
      case "Enviado":
        return "bg-blue-100 text-blue-800"
      case "Processando":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Entregue":
        return <CheckCircle className="h-3 w-3" />
      case "Enviado":
        return <Package className="h-3 w-3" />
      case "Processando":
        return <Clock className="h-3 w-3" />
      case "Cancelado":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{stats.revenueChange}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              {stats.ordersChange}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{stats.customersChange}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{stats.productsChange}% em relação ao mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Últimos pedidos realizados</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Ver Todos
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Carregando pedidos...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">{order.user?.name || 'Cliente não encontrado'}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total_amount)}</p>
                      <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Nenhum pedido encontrado</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Estoque Baixo
              </CardTitle>
              <CardDescription>Produtos que precisam de reposição</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Gerenciar
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Carregando produtos...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">{product.name}</p>
                      <span className="text-sm text-muted-foreground">
                        {product.stock_quantity}/{product.min_stock}
                      </span>
                    </div>
                    <Progress value={(product.stock_quantity / product.min_stock) * 100} className="h-2" />
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Todos os produtos com estoque adequado</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais usadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Package className="h-6 w-6 mb-2" />
              Adicionar Produto
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Processar Pedidos
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Users className="h-6 w-6 mb-2" />
              Gerenciar Clientes
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <TrendingUp className="h-6 w-6 mb-2" />
              Ver Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
