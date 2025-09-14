'use client'

import { useState } from 'react'
import { useAdminReports, ReportFilters } from '@/hooks/use-admin-reports'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  Download,
  FileText,
  Calendar,
  DollarSign,
  Activity,
  AlertTriangle
} from 'lucide-react'

export function ReportsManagement() {
  const {
    reportData,
    loading,
    error,
    filters,
    generateReport,
    exportReport
  } = useAdminReports()

  const [selectedType, setSelectedType] = useState<ReportFilters['type']>('dashboard')
  const [selectedPeriod, setSelectedPeriod] = useState<ReportFilters['period']>('month')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Gerar relatório
  const handleGenerateReport = () => {
    const reportFilters: ReportFilters = {
      type: selectedType,
      period: selectedPeriod,
      startDate: selectedPeriod === 'custom' ? startDate : undefined,
      endDate: selectedPeriod === 'custom' ? endDate : undefined,
      format: 'json'
    }
    generateReport(reportFilters)
  }

  // Exportar relatório
  const handleExport = async (format: 'pdf' | 'excel') => {
    const reportFilters: ReportFilters = {
      type: selectedType,
      period: selectedPeriod,
      startDate: selectedPeriod === 'custom' ? startDate : undefined,
      endDate: selectedPeriod === 'custom' ? endDate : undefined,
      format
    }
    await exportReport(format, reportFilters)
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
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Filtros de Relatório</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Relatório</Label>
              <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard Geral</SelectItem>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="products">Produtos</SelectItem>
                  <SelectItem value="customers">Clientes</SelectItem>
                  <SelectItem value="orders">Pedidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="period">Período</Label>
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                  <SelectItem value="quarter">Último Trimestre</SelectItem>
                  <SelectItem value="year">Último Ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <>
                <div>
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button onClick={handleGenerateReport}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Erro */}
      {error && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Relatórios */}
      {reportData && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {reportData.summary?.totalRevenue !== undefined && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                        <p className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {reportData.summary?.totalOrders !== undefined && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Pedidos</p>
                        <p className="text-2xl font-bold">{reportData.summary.totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {reportData.summary?.totalProducts !== undefined && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Produtos</p>
                        <p className="text-2xl font-bold">{reportData.summary.totalProducts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {reportData.summary?.totalCustomers !== undefined && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total de Clientes</p>
                        <p className="text-2xl font-bold">{reportData.summary.totalCustomers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Estatísticas Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.summary?.averageOrderValue !== undefined && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Valor Médio do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{formatCurrency(reportData.summary.averageOrderValue)}</p>
                  </CardContent>
                </Card>
              )}

              {reportData.summary?.lowStockProducts !== undefined && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Produtos com Estoque Baixo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">{reportData.summary.lowStockProducts}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {/* Produtos Mais Vendidos */}
            {reportData.topProducts && reportData.topProducts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.topProducts.map((product, index) => (
                      <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.sales_count} vendas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clientes com Mais Pedidos */}
            {reportData.topCustomers && reportData.topCustomers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Clientes com Mais Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.topCustomers.map((customer, index) => (
                      <div key={customer.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {customer.orders_count} pedidos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(customer.total_spent)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            {/* Vendas Diárias */}
            {reportData.dailySales && reportData.dailySales.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendas Diárias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {reportData.dailySales.map((day, index) => (
                      <div key={day.date} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{new Date(day.date).toLocaleDateString('pt-BR')}</p>
                          <p className="text-sm text-muted-foreground">
                            {day.orders} pedidos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(day.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vendas por Status */}
            {reportData.summary?.salesByStatus && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(reportData.summary.salesByStatus).map(([status, value]) => (
                      <div key={status} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium capitalize">{status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(value)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
