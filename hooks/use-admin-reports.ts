import { useState, useEffect } from 'react'

export interface ReportData {
  summary: {
    totalRevenue?: number
    totalOrders?: number
    averageOrderValue?: number
    salesByStatus?: Record<string, number>
    totalProducts?: number
    activeProducts?: number
    lowStockProducts?: number
    outOfStock?: number
    totalCustomers?: number
    activeCustomers?: number
    newCustomers?: number
    pendingOrders?: number
    confirmedOrders?: number
    deliveredOrders?: number
    cancelledOrders?: number
  }
  dailySales?: Array<{
    date: string
    revenue: number
    orders: number
  }>
  topProducts?: Array<{
    id: string
    name: string
    sales_count: number
    revenue: number
  }>
  topCustomers?: Array<{
    id: string
    name: string
    orders_count: number
    total_spent: number
  }>
  orders?: any[]
  products?: any[]
  customers?: any[]
}

export interface ReportFilters {
  type: 'sales' | 'products' | 'customers' | 'orders' | 'dashboard'
  period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  startDate?: string
  endDate?: string
  format?: 'json' | 'pdf' | 'excel'
}

export function useAdminReports() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ReportFilters>({
    type: 'dashboard',
    period: 'month',
    format: 'json'
  })

  // Gerar relatório
  const generateReport = async (reportFilters: ReportFilters) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('type', reportFilters.type)
      params.append('period', reportFilters.period)
      params.append('format', reportFilters.format || 'json')
      
      if (reportFilters.startDate) {
        params.append('start_date', reportFilters.startDate)
      }
      if (reportFilters.endDate) {
        params.append('end_date', reportFilters.endDate)
      }

      const response = await fetch(`/api/admin/reports?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao gerar relatório')
      }

      const data = await response.json()
      setReportData(data.report)
      setFilters(reportFilters)
      
      return data.report
    } catch (err) {
      console.error('❌ [useAdminReports] Erro ao gerar relatório:', err)
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Exportar relatório
  const exportReport = async (format: 'pdf' | 'excel', reportFilters: ReportFilters) => {
    try {
      const params = new URLSearchParams()
      params.append('type', reportFilters.type)
      params.append('period', reportFilters.period)
      params.append('format', format)
      
      if (reportFilters.startDate) {
        params.append('start_date', reportFilters.startDate)
      }
      if (reportFilters.endDate) {
        params.append('end_date', reportFilters.endDate)
      }

      const response = await fetch(`/api/admin/reports?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao exportar relatório')
      }

      // Criar download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-${reportFilters.type}-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return true
    } catch (err) {
      console.error('❌ [useAdminReports] Erro ao exportar relatório:', err)
      setError(err instanceof Error ? err.message : 'Erro ao exportar relatório')
      return false
    }
  }

  // Gerar relatório na montagem
  useEffect(() => {
    generateReport(filters)
  }, [])

  return {
    reportData,
    loading,
    error,
    filters,
    generateReport,
    exportReport
  }
}
