"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Eye, RotateCcw, MessageCircle, Truck } from "lucide-react"

// Mock orders data
const orders = [
  {
    id: "#12345",
    date: "2024-01-15",
    status: "Entregue",
    total: 189.9,
    items: [
      { name: "Fio Flexível 2,5mm² 100m", quantity: 2, price: 89.9 },
      { name: "Disjuntor Bipolar 25A", quantity: 1, price: 45.5 },
    ],
    tracking: "BR123456789",
    deliveryDate: "2024-01-18",
  },
  {
    id: "#12344",
    date: "2024-01-10",
    status: "Em trânsito",
    total: 89.9,
    items: [{ name: "Lâmpada LED 12W", quantity: 4, price: 22.45 }],
    tracking: "BR987654321",
    estimatedDelivery: "2024-01-20",
  },
  {
    id: "#12343",
    date: "2024-01-05",
    status: "Processando",
    total: 245.5,
    items: [
      { name: "Bomba Centrífuga 1/2CV", quantity: 1, price: 199.9 },
      { name: "Tubo PVC 32mm 6m", quantity: 3, price: 15.2 },
    ],
    tracking: null,
  },
  {
    id: "#12342",
    date: "2023-12-28",
    status: "Cancelado",
    total: 156.8,
    items: [{ name: "Furadeira de Impacto 650W", quantity: 1, price: 156.8 }],
    tracking: null,
    cancelReason: "Produto fora de estoque",
  },
]

export function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

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
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
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
                <SelectItem value="Processando">Processando</SelectItem>
                <SelectItem value="Em trânsito">Em trânsito</SelectItem>
                <SelectItem value="Entregue">Entregue</SelectItem>
                <SelectItem value="Cancelado">Cancelado</SelectItem>
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
              <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
              <p className="text-muted-foreground">Tente ajustar os filtros ou fazer uma nova busca</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Pedido realizado em {new Date(order.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
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
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                            </div>
                            <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.tracking && (
                      <div>
                        <h4 className="font-medium mb-2">Rastreamento</h4>
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-primary" />
                            <span className="font-mono text-sm">{order.tracking}</span>
                          </div>
                          {order.deliveryDate && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Entregue em {new Date(order.deliveryDate).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                          {order.estimatedDelivery && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Previsão de entrega: {new Date(order.estimatedDelivery).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cancel Reason */}
                    {order.cancelReason && (
                      <div>
                        <h4 className="font-medium mb-2">Motivo do Cancelamento</h4>
                        <p className="text-sm text-muted-foreground bg-red-50 p-3 rounded-lg">{order.cancelReason}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {order.status === "Entregue" && (
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

                      {order.status === "Em trânsito" && (
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Rastrear Pedido
                        </Button>
                      )}

                      {order.status === "Processando" && (
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
          ))
        )}
      </div>
    </div>
  )
}
