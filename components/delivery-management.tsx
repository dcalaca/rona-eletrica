"use client"

import { useState } from "react"
import { useAdminDeliveries } from "@/hooks/use-admin-deliveries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Eye, 
  Edit, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  XCircle,
  Package,
  User,
  Phone,
  Calendar,
  MoreHorizontal,
  Filter,
  Plus,
  Navigation
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function DeliveryManagement() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deliveryPersonFilter, setDeliveryPersonFilter] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const { 
    deliveries, 
    loading, 
    error, 
    updateDeliveryStatus,
    assignDeliveryPerson,
    addTrackingCode,
    getDeliveryDetails,
    addTrackingMovement
  } = useAdminDeliveries({
    search: search || undefined,
    status: statusFilter as 'pending' | 'in_transit' | 'delivered' | 'failed' | 'all',
    deliveryPerson: deliveryPersonFilter !== 'all' ? deliveryPersonFilter : undefined
  })

  const handleViewDetails = async (orderId: string) => {
    try {
      const details = await getDeliveryDetails(orderId)
      setSelectedDelivery(details)
      setIsDetailsDialogOpen(true)
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDeliveryStatus(orderId, newStatus)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleAssignDeliveryPerson = async (orderId: string, deliveryPersonId: string) => {
    try {
      await assignDeliveryPerson(orderId, deliveryPersonId)
    } catch (error) {
      console.error('Erro ao atribuir entregador:', error)
    }
  }

  const handleAddTrackingCode = async (orderId: string, trackingCode: string) => {
    try {
      await addTrackingCode(orderId, trackingCode)
    } catch (error) {
      console.error('Erro ao adicionar código de rastreamento:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_transit': return 'bg-blue-100 text-blue-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente'
      case 'in_transit': return 'Em Trânsito'
      case 'delivered': return 'Entregue'
      case 'failed': return 'Falhou'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Erro ao carregar entregas: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entregas</p>
                <p className="text-2xl font-bold">{deliveries.length}</p>
              </div>
              <Truck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Trânsito</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'in_transit').length}
                </p>
              </div>
              <Navigation className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold">
                  {deliveries.filter(d => d.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Entregas</CardTitle>
              <CardDescription>Acompanhe e gerencie entregas e logística</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por pedido ou código de rastreamento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in_transit">Em Trânsito</SelectItem>
                <SelectItem value="delivered">Entregues</SelectItem>
                <SelectItem value="failed">Falharam</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deliveryPersonFilter} onValueChange={setDeliveryPersonFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por entregador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Entregadores</SelectItem>
                <SelectItem value="unassigned">Não Atribuídos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Entregas */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Entregador</TableHead>
                <TableHead>Rastreamento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">#{delivery.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(delivery.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{delivery.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{delivery.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(delivery.status)}>
                      {getStatusLabel(delivery.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {delivery.delivery_person ? (
                      <div>
                        <p className="font-medium">{delivery.delivery_person.name}</p>
                        {delivery.delivery_person.phone && (
                          <p className="text-sm text-muted-foreground">
                            {delivery.delivery_person.phone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {delivery.tracking_code ? (
                      <div>
                        <p className="font-mono text-sm">{delivery.tracking_code}</p>
                        {delivery.estimated_delivery && (
                          <p className="text-xs text-muted-foreground">
                            Previsto: {new Date(delivery.estimated_delivery).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sem código</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{formatCurrency(delivery.total_amount)}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(delivery.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Select onValueChange={(value) => handleUpdateStatus(delivery.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="in_transit">Em Trânsito</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                          <SelectItem value="failed">Falhou</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {deliveries.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma entrega encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Entrega</DialogTitle>
            <DialogDescription>
              Informações completas e rastreamento da entrega
            </DialogDescription>
          </DialogHeader>
          {selectedDelivery && <DeliveryDetails delivery={selectedDelivery} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de Detalhes da Entrega
function DeliveryDetails({ delivery }: { delivery: any }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="tracking">Rastreamento</TabsTrigger>
        <TabsTrigger value="details">Detalhes</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Número do Pedido:</strong> #{delivery.order_number}</p>
              <p><strong>Status:</strong> 
                <Badge className="ml-2">
                  {delivery.delivery_status || delivery.status}
                </Badge>
              </p>
              <p><strong>Valor Total:</strong> {formatCurrency(delivery.total_amount)}</p>
              <p><strong>Data do Pedido:</strong> {new Date(delivery.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nome:</strong> {delivery.user?.name}</p>
              <p><strong>Email:</strong> {delivery.user?.email}</p>
              <p><strong>Telefone:</strong> {delivery.user?.phone || "Não informado"}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            {delivery.shipping_address ? (
              <div className="space-y-1">
                <p>{delivery.shipping_address.street}, {delivery.shipping_address.number}</p>
                {delivery.shipping_address.complement && (
                  <p>{delivery.shipping_address.complement}</p>
                )}
                <p>{delivery.shipping_address.neighborhood}</p>
                <p>{delivery.shipping_address.city} - {delivery.shipping_address.state}</p>
                <p>CEP: {delivery.shipping_address.zip_code}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Endereço não informado</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tracking" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Rastreamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {delivery.delivery_history?.map((movement: any, index: number) => (
                <div key={movement.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      movement.status === 'delivered' ? 'bg-green-500' :
                      movement.status === 'in_transit' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{movement.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {movement.location} • {new Date(movement.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Unit.</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {delivery.order_items?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.product_sku}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                    <TableCell>{formatCurrency(item.total_price)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Entregador:</strong> {delivery.delivery_person?.name || "Não atribuído"}</p>
            <p><strong>Código de Rastreamento:</strong> {delivery.tracking_code || "Não informado"}</p>
            <p><strong>Previsão de Entrega:</strong> {
              delivery.estimated_delivery 
                ? new Date(delivery.estimated_delivery).toLocaleDateString()
                : "Não informada"
            }</p>
            <p><strong>Data de Entrega:</strong> {
              delivery.delivered_at 
                ? new Date(delivery.delivered_at).toLocaleDateString()
                : "Não entregue"
            }</p>
            <p><strong>Peso Total:</strong> {delivery.total_weight || 0} kg</p>
            <p><strong>Total de Itens:</strong> {delivery.total_items || 0}</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
