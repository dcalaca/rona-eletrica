"use client"

import { useState } from "react"
import { useAdminVendors } from "@/hooks/use-admin-vendors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  MoreHorizontal,
  Filter
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function VendorManagement() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedVendor, setSelectedVendor] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const { 
    vendors, 
    loading, 
    error, 
    updateVendorStatus, 
    updateVendorCommission,
    getVendorDetails,
    createVendor
  } = useAdminVendors({
    search: search || undefined,
    status: statusFilter as 'active' | 'inactive' | 'all'
  })

  const handleViewDetails = async (vendorId: string) => {
    try {
      const details = await getVendorDetails(vendorId)
      setSelectedVendor(details)
      setIsDetailsDialogOpen(true)
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error)
    }
  }

  const handleToggleStatus = async (vendorId: string, currentStatus: boolean) => {
    try {
      await updateVendorStatus(vendorId, !currentStatus)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleUpdateCommission = async (vendorId: string, newRate: number) => {
    try {
      await updateVendorCommission(vendorId, newRate)
    } catch (error) {
      console.error('Erro ao atualizar comissão:', error)
    }
  }

  const handleCreateVendor = async (formData: any) => {
    try {
      await createVendor(formData)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Erro ao criar vendedor:', error)
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
            <p>Erro ao carregar vendedores: {error}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Vendedores</p>
                <p className="text-2xl font-bold">{vendors.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vendas Totais</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(vendors.reduce((sum, v) => sum + v.stats.totalSales, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comissões Pagas</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(vendors.reduce((sum, v) => sum + v.stats.totalCommissions, 0))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comissões Pendentes</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(vendors.reduce((sum, v) => sum + v.stats.pendingCommissions, 0))}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vendedores</CardTitle>
              <CardDescription>Gerencie vendedores e suas comissões</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Vendedor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Vendedor</DialogTitle>
                  <DialogDescription>
                    Adicione um novo vendedor ao sistema
                  </DialogDescription>
                </DialogHeader>
                <CreateVendorForm onSubmit={handleCreateVendor} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar vendedores..."
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
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de Vendedores */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendedor</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Comissões</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.vendor_info?.commission_rate || 5}% comissão
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{vendor.email}</p>
                      {vendor.phone && (
                        <p className="text-sm text-muted-foreground">{vendor.phone}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.is_active ? "default" : "secondary"}>
                      {vendor.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(vendor.stats.totalSales)}</p>
                      <p className="text-sm text-muted-foreground">
                        {vendor.stats.totalOrders} pedidos
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{formatCurrency(vendor.stats.totalCommissions)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(vendor.stats.pendingCommissions)} pendente
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={vendor.vendor_info?.commission_rate || 5}
                        onChange={(e) => {
                          const newRate = parseFloat(e.target.value)
                          if (!isNaN(newRate)) {
                            handleUpdateCommission(vendor.id, newRate)
                          }
                        }}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(vendor.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={vendor.is_active}
                        onCheckedChange={() => handleToggleStatus(vendor.id, vendor.is_active)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {vendors.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum vendedor encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Vendedor</DialogTitle>
            <DialogDescription>
              Informações completas e histórico de vendas
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && <VendorDetails vendor={selectedVendor} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de Formulário de Criação
function CreateVendorForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    commissionRate: 5.0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
        <Input
          id="commissionRate"
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.commissionRate}
          onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
        />
      </div>
      <Button type="submit" className="w-full">
        Criar Vendedor
      </Button>
    </form>
  )
}

// Componente de Detalhes do Vendedor
function VendorDetails({ vendor }: { vendor: any }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="sales">Vendas</TabsTrigger>
        <TabsTrigger value="commissions">Comissões</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Nome:</strong> {vendor.name}</p>
              <p><strong>Email:</strong> {vendor.email}</p>
              <p><strong>Telefone:</strong> {vendor.phone || "Não informado"}</p>
              <p><strong>Status:</strong> 
                <Badge variant={vendor.is_active ? "default" : "secondary"} className="ml-2">
                  {vendor.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Total de Vendas:</strong> {formatCurrency(vendor.stats.totalSales)}</p>
              <p><strong>Total de Pedidos:</strong> {vendor.stats.totalOrders}</p>
              <p><strong>Ticket Médio:</strong> {formatCurrency(vendor.stats.averageOrderValue)}</p>
              <p><strong>Taxa de Comissão:</strong> {vendor.vendor_info?.commission_rate || 5}%</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="sales" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendor.orders?.slice(0, 10).map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.order_number}</TableCell>
                    <TableCell>{order.user?.name || "N/A"}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.status}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="commissions" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Comissões</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pedido</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendor.commissions?.slice(0, 10).map((commission: any) => (
                  <TableRow key={commission.id}>
                    <TableCell>{new Date(commission.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(commission.commission_amount)}</TableCell>
                    <TableCell>
                      <Badge variant={commission.status === 'paid' ? 'default' : 'secondary'}>
                        {commission.status === 'paid' ? 'Pago' : 'Pendente'}
                      </Badge>
                    </TableCell>
                    <TableCell>#{commission.order_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Status</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(vendor.stats.salesByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center py-2">
                  <span className="capitalize">{status}</span>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(vendor.stats.salesByMonth || {})
                .sort(([a], [b]) => b.localeCompare(a))
                .slice(0, 6)
                .map(([month, amount]) => (
                  <div key={month} className="flex justify-between items-center py-2">
                    <span>{month}</span>
                    <span className="font-medium">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
