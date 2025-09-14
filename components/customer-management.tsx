"use client"

import type React from "react"

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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Search, 
  Eye, 
  Edit, 
  MoreHorizontal, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Filter
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdminCustomers } from "@/hooks/use-admin-customers"
import { toast } from "@/hooks/use-toast"

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const { customers, loading, error, updateCustomerStatus, getCustomerDetails } = useAdminCustomers({
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  const handleViewDetails = async (customer: any) => {
    try {
      const details = await getCustomerDetails(customer.id)
      setSelectedCustomer(details)
      setIsDetailsDialogOpen(true)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar detalhes do cliente",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (customerId: string, currentStatus: boolean) => {
    try {
      await updateCustomerStatus(customerId, !currentStatus)
      toast({
        title: "Sucesso",
        description: `Cliente ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do cliente",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(customers.reduce((sum, c) => sum + c.stats.totalSpent, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                customers.length > 0 
                  ? customers.reduce((sum, c) => sum + c.stats.averageOrderValue, 0) / customers.length 
                  : 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({customers.length})</CardTitle>
          <CardDescription>Gerencie seus clientes e visualize informações detalhadas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando clientes...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Erro ao carregar clientes: {error}</p>
              <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-medium">{customer.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                        {customer.phone && (
                          <>
                            <span>•</span>
                            <Phone className="h-3 w-3" />
                            <span>{customer.phone}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">
                          Cliente desde {formatDate(customer.created_at)}
                        </span>
                        <Badge variant={customer.is_active ? "default" : "secondary"}>
                          {customer.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {customer.stats.totalOrders} pedidos
                      </div>
                      <div className="font-medium">
                        {formatPrice(customer.stats.totalSpent)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(customer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus(customer.id, customer.is_active)}
                          >
                            <Switch className="h-4 w-4 mr-2" />
                            {customer.is_active ? 'Desativar' : 'Ativar'}
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

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Informações completas e histórico de compras</DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <CustomerDetails customer={selectedCustomer} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CustomerDetails({ customer }: { customer: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-6">
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Nome</Label>
              <p className="text-sm text-muted-foreground">{customer.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <Label className="text-sm font-medium">Telefone</Label>
                <p className="text-sm text-muted-foreground">{customer.phone}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge variant={customer.is_active ? "default" : "secondary"}>
                {customer.is_active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Cliente desde</Label>
              <p className="text-sm text-muted-foreground">{formatDate(customer.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Total de Pedidos</Label>
                <p className="text-2xl font-bold">{customer.stats.totalOrders}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Valor Total</Label>
                <p className="text-2xl font-bold">{formatPrice(customer.stats.totalSpent)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Ticket Médio</Label>
                <p className="text-2xl font-bold">{formatPrice(customer.stats.averageOrderValue)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Último Pedido</Label>
                <p className="text-sm text-muted-foreground">
                  {customer.stats.lastOrder ? formatDate(customer.stats.lastOrder) : 'Nenhum'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      {customer.addresses && customer.addresses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.addresses.map((address: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Endereço</Label>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.number}
                        {address.complement && `, ${address.complement}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.neighborhood}, {address.city} - {address.state}
                      </p>
                      <p className="text-sm text-muted-foreground">CEP: {address.zip_code}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tipo</Label>
                      <Badge variant="outline">{address.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders History */}
      {customer.orders && customer.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.orders.map((order: any) => (
                <div key={order.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pedido #{order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total_amount)}</p>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                  </div>
                  
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">Itens:</Label>
                      {order.order_items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{item.product?.name} x {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}