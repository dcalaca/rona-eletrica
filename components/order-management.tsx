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
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminOrders } from "@/hooks/use-admin-orders"
import { toast } from "@/hooks/use-toast"

export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const { orders, loading, error, updateOrderStatus, getOrderDetails } = useAdminOrders({
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined
  })

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
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-red-100 text-red-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-3 w-3" />
      case "shipped":
        return <Truck className="h-3 w-3" />
      case "processing":
        return <Clock className="h-3 w-3" />
      case "cancelled":
        return <X className="h-3 w-3" />
      default:
        return null
    }
  }

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

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Pago"
      case "pending": return "Pendente"
      case "refunded": return "Estornado"
      case "failed": return "Falhou"
      default: return status
    }
  }

  const handleViewDetails = async (order: any) => {
    try {
      const details = await getOrderDetails(order.id)
      setSelectedOrder(details)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes do pedido",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do pedido",
        variant: "destructive",
      })
    }
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
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status do pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os pagamentos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="refunded">Estornado</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({orders.length})</CardTitle>
          <CardDescription>Gerencie todos os pedidos da loja</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando pedidos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Erro ao carregar pedidos: {error}</p>
              <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <Package className="h-5 w-5 text-primary" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{order.order_number}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.payment_status)}>
                          {getPaymentStatusLabel(order.payment_status)}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>
                          {order.user.name} • {order.user.email}
                        </p>
                        <p>
                          {formatDate(order.created_at)} • {order.order_items?.length || 0} {order.order_items?.length === 1 ? "item" : "itens"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total_amount)}</p>
                      {order.tracking_code && (
                        <p className="text-sm text-muted-foreground">Rastreamento: {order.tracking_code}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pedido {order.order_number}</DialogTitle>
                            <DialogDescription>Informações completas do pedido</DialogDescription>
                          </DialogHeader>
                          {selectedOrder && <OrderDetails order={selectedOrder} onStatusUpdate={handleUpdateStatus} />}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function OrderDetails({
  order,
  onStatusUpdate,
}: {
  order: any
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

  const subtotal = order.order_items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0
  const shipping = order.shipping_cost || 0
  const total = order.total_amount || 0

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Informações do Cliente</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Nome:</strong> {order.user.name}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
            {order.user.phone && (
              <p>
                <strong>Telefone:</strong> {order.user.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Informações do Pedido</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Número:</strong> {order.order_number}
            </p>
            <p>
              <strong>Data:</strong> {formatDate(order.created_at)}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Pagamento:</strong> {order.payment_status}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <h4 className="font-medium mb-3">Itens do Pedido</h4>
        <div className="space-y-2">
          {order.order_items?.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div className="flex items-center space-x-3">
                {item.product?.images?.[0] && (
                  <img 
                    src={item.product.images[0].url} 
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded border"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product?.name || 'Produto não encontrado'}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {item.product?.sku || 'N/A'} • Quantidade: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
            </div>
          )) || []}
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
      {order.address && (
        <div>
          <h4 className="font-medium mb-2">Informações de Entrega</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Endereço:</strong> {order.address.street}, {order.address.number}
              {order.address.complement && `, ${order.address.complement}`}
            </p>
            <p>
              <strong>Bairro:</strong> {order.address.neighborhood}
            </p>
            <p>
              <strong>Cidade:</strong> {order.address.city} - {order.address.state}
            </p>
            <p>
              <strong>CEP:</strong> {order.address.zip_code}
            </p>
            {order.tracking_code && (
              <p>
                <strong>Rastreamento:</strong> {order.tracking_code}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Select onValueChange={(value) => onStatusUpdate(order.id, value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Alterar status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="shipped">Enviado</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
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
