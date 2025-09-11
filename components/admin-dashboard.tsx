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
} from "lucide-react"

export function AdminDashboard() {
  // Mock data
  const stats = {
    totalRevenue: 45678.9,
    revenueChange: 12.5,
    totalOrders: 1234,
    ordersChange: -2.3,
    totalCustomers: 5678,
    customersChange: 8.7,
    totalProducts: 892,
    productsChange: 5.2,
  }

  const recentOrders = [
    {
      id: "#12345",
      customer: "João Silva",
      total: 189.9,
      status: "Processando",
      date: "2024-01-15",
    },
    {
      id: "#12344",
      customer: "Maria Santos",
      total: 89.9,
      status: "Enviado",
      date: "2024-01-15",
    },
    {
      id: "#12343",
      customer: "Carlos Oliveira",
      total: 245.5,
      status: "Entregue",
      date: "2024-01-14",
    },
    {
      id: "#12342",
      customer: "Ana Costa",
      total: 156.8,
      status: "Cancelado",
      date: "2024-01-14",
    },
  ]

  const lowStockProducts = [
    { name: "Fio Flexível 2,5mm²", stock: 5, minStock: 20 },
    { name: "Disjuntor Bipolar 25A", stock: 8, minStock: 15 },
    { name: "Lâmpada LED 12W", stock: 12, minStock: 30 },
    { name: "Tubo PVC 32mm", stock: 3, minStock: 25 },
  ]

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
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <ShoppingCart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{product.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {product.stock}/{product.minStock}
                    </span>
                  </div>
                  <Progress value={(product.stock / product.minStock) * 100} className="h-2" />
                </div>
              ))}
            </div>
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
