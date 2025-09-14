"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Eye, RotateCcw, MessageCircle, Truck, Loader2 } from "lucide-react"
import { useOrders, Order } from "@/hooks/use-orders"

export function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const { orders, loading, error } = useOrders()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "delivered":
        return { label: "Entregue", color: "bg-green-100 text-green-800" }
      case "shipped":
        return { label: "Em trânsito", color: "bg-blue-100 text-blue-800" }
      case "processing":
        return { label: "Processando", color: "bg-yellow-100 text-yellow-800" }
      case "cancelled":
        return { label: "Cancelado", color: "bg-red-100 text-red-800" }
      case "pending":
        return { label: "Pendente", color: "bg-gray-100 text-gray-800" }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" }
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando pedidos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Erro ao carregar pedidos</h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Buscar por número do pedido ou produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="shipped">Em trânsito</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {orders.length === 0 ? "Você ainda não fez nenhum pedido" : "Nenhum pedido encontrado"}
              </h3>
              <p className="text-muted-foreground">
                {orders.length === 0 
                  ? "Explore nossos produtos e faça seu primeiro pedido!" 
                  : "Tente ajustar os filtros ou fazer uma nova busca"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{order.order_number}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Pedido realizado em {new Date(order.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.total)}</p>
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleOrderExpansion(order.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        {expandedOrder === order.id ? "Ocultar" : "Ver Detalhes"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedOrder === order.id && (
                  <CardContent className="pt-0">
                    <div className="border-t pt-4 space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-3">Itens do Pedido</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-border last:border-0"
                            >
                              <div>
                                <p className="font-medium">{item.product_name}</p>
                                <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                              </div>
                              <p className="font-medium">{formatPrice(item.total)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address Info */}
                      {order.address && (
                        <div>
                          <h4 className="font-medium mb-2">Endereço de Entrega</h4>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">
                              {order.address.street}, {order.address.number}
                              {order.address.complement && `, ${order.address.complement}`}
                            </p>
                            <p className="text-sm">
                              {order.address.neighborhood} - {order.address.city}/{order.address.state}
                            </p>
                            <p className="text-sm">CEP: {order.address.zip_code}</p>
                          </div>
                        </div>
                      )}

                      {/* Payment Info */}
                      <div>
                        <h4 className="font-medium mb-2">Forma de Pagamento</h4>
                        <p className="text-sm text-muted-foreground">{order.payment_method}</p>
                      </div>

                      {/* Tracking Info */}
                      {order.tracking_code && (
                        <div>
                          <h4 className="font-medium mb-2">Rastreamento</h4>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Truck className="h-4 w-4 text-primary" />
                              <span className="font-mono text-sm">{order.tracking_code}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {order.notes && (
                        <div>
                          <h4 className="font-medium mb-2">Observações</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{order.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {order.status === "delivered" && (
                          <>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Comprar Novamente
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Avaliar Produtos
                            </Button>
                          </>
                        )}

                        {order.status === "shipped" && (
                          <Button variant="outline" size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Rastrear Pedido
                          </Button>
                        )}

                        {order.status === "processing" && (
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Entrar em Contato
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
