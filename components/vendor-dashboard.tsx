import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Target,
  Phone,
  MessageCircle,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react"

export function VendorDashboard() {
  // Mock vendor data
  const vendorStats = {
    monthlyRevenue: 15678.9,
    revenueChange: 8.5,
    totalCustomers: 45,
    customersChange: 12.3,
    monthlyOrders: 28,
    ordersChange: -5.2,
    commission: 2341.84,
    commissionChange: 15.7,
  }

  const goals = {
    monthly: {
      target: 20000,
      current: 15678.9,
      percentage: 78.4,
    },
    customers: {
      target: 50,
      current: 45,
      percentage: 90,
    },
    orders: {
      target: 35,
      current: 28,
      percentage: 80,
    },
  }

  const recentActivities = [
    {
      type: "order",
      customer: "João Silva",
      action: "Pedido #12345 finalizado",
      value: 189.9,
      time: "2 horas atrás",
      icon: ShoppingCart,
    },
    {
      type: "lead",
      customer: "Maria Santos",
      action: "Novo lead via WhatsApp",
      value: null,
      time: "4 horas atrás",
      icon: MessageCircle,
    },
    {
      type: "meeting",
      customer: "Carlos Oliveira",
      action: "Reunião agendada",
      value: null,
      time: "1 dia atrás",
      icon: Calendar,
    },
    {
      type: "call",
      customer: "Ana Costa",
      action: "Ligação realizada",
      value: null,
      time: "2 dias atrás",
      icon: Phone,
    },
  ]

  const topCustomers = [
    { name: "João Silva", orders: 8, revenue: 2456.8, lastOrder: "2024-01-15" },
    { name: "Maria Santos", orders: 6, revenue: 1890.5, lastOrder: "2024-01-14" },
    { name: "Carlos Oliveira", orders: 5, revenue: 1567.2, lastOrder: "2024-01-13" },
    { name: "Ana Costa", orders: 4, revenue: 1234.6, lastOrder: "2024-01-12" },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-4 w-4 text-green-500" />
      case "lead":
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case "meeting":
        return <Calendar className="h-4 w-4 text-purple-500" />
      case "call":
        return <Phone className="h-4 w-4 text-orange-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(vendorStats.monthlyRevenue)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{vendorStats.revenueChange}% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorStats.totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{vendorStats.customersChange}% novos clientes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos do Mês</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorStats.monthlyOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              {vendorStats.ordersChange}% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comissão</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(vendorStats.commission)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{vendorStats.commissionChange}% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Metas do Mês
            </CardTitle>
            <CardDescription>Acompanhe seu progresso nas metas mensais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Vendas</span>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(goals.monthly.current)} / {formatPrice(goals.monthly.target)}
                </span>
              </div>
              <Progress value={goals.monthly.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{goals.monthly.percentage}% da meta</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Novos Clientes</span>
                <span className="text-sm text-muted-foreground">
                  {goals.customers.current} / {goals.customers.target}
                </span>
              </div>
              <Progress value={goals.customers.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{goals.customers.percentage}% da meta</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Pedidos</span>
                <span className="text-sm text-muted-foreground">
                  {goals.orders.current} / {goals.orders.target}
                </span>
              </div>
              <Progress value={goals.orders.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{goals.orders.percentage}% da meta</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Suas últimas interações e vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-muted p-2 rounded-full">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.customer}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    {activity.value && <p className="text-sm font-medium">{formatPrice(activity.value)}</p>}
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Melhores Clientes</CardTitle>
            <CardDescription>Clientes com maior volume de compras</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.orders} pedidos • Último: {new Date(customer.lastOrder).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium">{formatPrice(customer.revenue)}</p>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Acesse rapidamente as funcionalidades mais usadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <MessageCircle className="h-6 w-6 mb-2" />
              WhatsApp
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Phone className="h-6 w-6 mb-2" />
              Ligar para Cliente
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Calendar className="h-6 w-6 mb-2" />
              Agendar Reunião
            </Button>

            <Button variant="outline" className="h-20 flex-col bg-transparent">
              <Users className="h-6 w-6 mb-2" />
              Novo Cliente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
