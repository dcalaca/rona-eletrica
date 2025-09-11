"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  X,
  MoreHorizontal,
  MessageSquare,
  Printer,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock orders data
const orders = [
  {
    id: "#12345",
    customer: {
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
    },
    date: "2024-01-15T10:30:00",
    status: "Processando",
    paymentStatus: "Pago",
    total: 189.9,
    items: [
      { name: "Fio Flexível 2,5mm² 100m", quantity: 2, price: 89.9 },
      { name: "Disjuntor Bipolar 25A", quantity: 1, price: 45.5 },
    ],
    shipping: {
      method: "Entrega Expressa",
      address: "Rua das Flores, 123 - São Paulo, SP",
      tracking: null,
    },
  },
  {
    id: "#12344",
    customer: {
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(11) 88888-8888",
    },
    date: "2024-01-14T15:45:00",
    status: "Enviado",
    paymentStatus: "Pago",
    total: 89.9,
    items: [{ name: "Lâmpada LED 12W", quantity: 4, price: 22.45 }],
    shipping: {
      method: "Correios PAC",
      address: "Av. Paulista, 456 - São Paulo, SP",
      tracking: "BR123456789",
    },
  },
  {
    id: "#12343",
    customer: {
      name: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      phone: "(11) 77777-7777",
    },
    date: "2024-01-13T09:15:00",
    status: "Entregue",
    paymentStatus: "Pago",
    total: 245.5,
    items: [
      { name: "Bomba Centrífuga 1/2CV", quantity: 1, price: 199.9 },
      { name: "Tubo PVC 32mm 6m", quantity: 3, price: 15.2 },
    ],
    shipping: {
      method: "Entrega Própria",
      address: "Rua do Comércio, 789 - São Paulo, SP",
      tracking: "ENTREGUE",
    },
  },
  {
    id: "#12342",
    customer: {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      phone: "(11) 66666-6666",
    },
    date: "2024-01-12T14:20:00",
    status: "Cancelado",
    paymentStatus: "Estornado",
    total: 156.8,
    items: [{ name: "Furadeira de Impacto 650W", quantity: 1, price: 156.8 }],
    shipping: {
      method: "Correios SEDEX",
      address: "Rua das Palmeiras, 321 - São Paulo, SP",
      tracking: null,
    },
  },
]

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Estornado":
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
        return <Truck className="h-3 w-3" />
      case "Processando":
        return <Clock className="h-3 w-3" />
      case "Cancelado":
        return <X className="h-3 w-3" />
      default:
        return null
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    return matchesSearch && matchesStatus && matchesPayment
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // TODO: Implement status update
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Buscar por pedido, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status do pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Processando">Processando</SelectItem>
                <SelectItem value="Enviado">Enviado</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status do pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pagamentos</SelectItem>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Estornado">Estornado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
          <CardDescription>Gerencie todos os pedidos da loja</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded">
                    <Package className="h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>
                        {order.customer.name} • {order.customer.email}
                      </p>
                      <p>
                        {formatDate(order.date)} • {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping.method}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Pedido {order.id}</DialogTitle>
                          <DialogDescription>Informações completas do pedido</DialogDescription>
                        </DialogHeader>
                        {selectedOrder && <OrderDetails order={selectedOrder} onStatusUpdate={updateOrderStatus} />}
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir Etiqueta
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contatar Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="h-4 w-4 mr-2" />
                          Atualizar Rastreamento
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OrderDetails({
  order,
  onStatusUpdate,
}: {
  order: (typeof orders)[0]
  onStatusUpdate: (orderId: string, status: string) => void
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR")
  }

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 15.9
  const total = subtotal + shipping

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Informações do Cliente</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Nome:</strong> {order.customer.name}
            </p>
            <p>
              <strong>Email:</strong> {order.customer.email}
            </p>
            <p>
              <strong>Telefone:</strong> {order.customer.phone}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Informações do Pedido</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Data:</strong> {formatDate(order.date)}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Pagamento:</strong> {order.paymentStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="font-medium mb-3">Itens do Pedido</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete:</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between font-medium text-base border-t pt-2">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div>
        <h4 className="font-medium mb-2">Informações de Entrega</h4>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Método:</strong> {order.shipping.method}
          </p>
          <p>
            <strong>Endereço:</strong> {order.shipping.address}
          </p>
          {order.shipping.tracking && (
            <p>
              <strong>Rastreamento:</strong> {order.shipping.tracking}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Select onValueChange={(value) => onStatusUpdate(order.id, value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alterar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Processando">Processando</SelectItem>
            <SelectItem value="Enviado">Enviado</SelectItem>
            <SelectItem value="Entregue">Entregue</SelectItem>
            <SelectItem value="Cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>

        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contatar Cliente
        </Button>
      </div>
    </div>
  )
}
