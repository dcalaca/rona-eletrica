'use client'

import { useState } from 'react'
import { useAdminPayments, Payment, PaymentFilters } from '@/hooks/use-admin-payments'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Search,
  Filter,
  Eye,
  MoreHorizontal,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

export function PaymentManagement() {
  const {
    payments,
    loading,
    error,
    stats,
    pagination,
    fetchPayments,
    updatePaymentStatus,
    processRefund,
    getPaymentDetails
  } = useAdminPayments()

  const [filters, setFilters] = useState<PaymentFilters>({
    search: '',
    status: 'all',
    method: 'all',
    page: 1,
    limit: 10
  })
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [updateNotes, setUpdateNotes] = useState('')

  // Aplicar filtros
  const handleFilter = () => {
    fetchPayments(filters)
  }

  // Limpar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      method: 'all',
      page: 1,
      limit: 10
    })
    fetchPayments({})
  }

  // Atualizar status
  const handleUpdateStatus = async (id: string, status: string) => {
    const success = await updatePaymentStatus(id, status, updateNotes)
    if (success) {
      setShowDetails(false)
      setUpdateNotes('')
    }
  }

  // Processar reembolso
  const handleRefund = async () => {
    if (!selectedPayment || !refundAmount) return

    const success = await processRefund(selectedPayment.id, parseFloat(refundAmount), refundReason)
    if (success) {
      setShowRefund(false)
      setRefundAmount('')
      setRefundReason('')
    }
  }

  // Abrir detalhes
  const handleViewDetails = async (payment: Payment) => {
    const details = await getPaymentDetails(payment.id)
    if (details) {
      setSelectedPayment(details)
      setShowDetails(true)
    }
  }

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-purple-100 text-purple-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Obter label do status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'pending': return 'Pendente'
      case 'failed': return 'Falhou'
      case 'refunded': return 'Reembolsado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  // Obter label do método
  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão de Crédito'
      case 'pix': return 'PIX'
      case 'boleto': return 'Boleto'
      case 'debit_card': return 'Cartão de Débito'
      default: return method
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Recebido</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pagamentos</p>
                  <p className="text-2xl font-bold">{stats.totalPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                  <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="ID da transação, pedido..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="method">Método</Label>
              <Select
                value={filters.method}
                onValueChange={(value) => setFilters({ ...filters, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Button onClick={handleFilter} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Limpar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>
            {pagination.total} pagamentos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID da Transação</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.transaction_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.customer?.name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.customer?.email || 'N/A'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-mono text-sm">
                          {payment.order?.order_number || 'N/A'}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getMethodLabel(payment.payment_method)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusLabel(payment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pagamento</DialogTitle>
            <DialogDescription>
              Informações completas sobre o pagamento
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID da Transação</Label>
                  <p className="font-mono text-sm">{selectedPayment.transaction_id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    {getStatusLabel(selectedPayment.status)}
                  </Badge>
                </div>
                <div>
                  <Label>Método de Pagamento</Label>
                  <p>{getMethodLabel(selectedPayment.payment_method)}</p>
                </div>
                <div>
                  <Label>Valor</Label>
                  <p className="font-medium">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <Label>Data de Criação</Label>
                  <p>{new Date(selectedPayment.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <Label>Última Atualização</Label>
                  <p>{new Date(selectedPayment.updated_at).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              {selectedPayment.customer && (
                <div>
                  <Label>Cliente</Label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><strong>Nome:</strong> {selectedPayment.customer.name}</p>
                    <p><strong>Email:</strong> {selectedPayment.customer.email}</p>
                    <p><strong>Telefone:</strong> {selectedPayment.customer.phone}</p>
                  </div>
                </div>
              )}

              {selectedPayment.order && (
                <div>
                  <Label>Pedido</Label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><strong>Número:</strong> {selectedPayment.order.order_number}</p>
                    <p><strong>Valor Total:</strong> {formatCurrency(selectedPayment.order.total_amount)}</p>
                    <p><strong>Status:</strong> {selectedPayment.order.status}</p>
                  </div>
                </div>
              )}

              {selectedPayment.notes && (
                <div>
                  <Label>Observações</Label>
                  <p className="bg-gray-50 p-3 rounded-md">{selectedPayment.notes}</p>
                </div>
              )}

              {selectedPayment.refund_amount && (
                <div>
                  <Label>Reembolso</Label>
                  <div className="bg-red-50 p-3 rounded-md">
                    <p><strong>Valor:</strong> {formatCurrency(selectedPayment.refund_amount)}</p>
                    <p><strong>Motivo:</strong> {selectedPayment.refund_reason}</p>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="space-y-4">
                <div>
                  <Label>Atualizar Status</Label>
                  <div className="flex space-x-2">
                    <Select onValueChange={(status) => handleUpdateStatus(selectedPayment.id, status)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => setShowRefund(true)}
                      variant="outline"
                      disabled={selectedPayment.status !== 'paid'}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reembolsar
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Observações</Label>
                  <Textarea
                    placeholder="Adicionar observações..."
                    value={updateNotes}
                    onChange={(e) => setUpdateNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Reembolso */}
      <Dialog open={showRefund} onOpenChange={setShowRefund}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processar Reembolso</DialogTitle>
            <DialogDescription>
              Processar reembolso para o pagamento selecionado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Valor do Reembolso</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
              />
            </div>

            <div>
              <Label>Motivo do Reembolso</Label>
              <Textarea
                placeholder="Descreva o motivo do reembolso..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRefund(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRefund} disabled={!refundAmount}>
                Processar Reembolso
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}