import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar chave de serviço para contornar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/reports - Gerar relatórios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // sales, products, customers, orders
    const period = searchParams.get('period') // today, week, month, quarter, year, custom
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const format = searchParams.get('format') // json, pdf, excel

    // Calcular datas baseado no período
    const now = new Date()
    let dateFrom = new Date()
    let dateTo = new Date()

    switch (period) {
      case 'today':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
        break
      case 'week':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3)
        dateFrom = new Date(now.getFullYear(), quarter * 3, 1)
        break
      case 'year':
        dateFrom = new Date(now.getFullYear(), 0, 1)
        break
      case 'custom':
        if (startDate) dateFrom = new Date(startDate)
        if (endDate) dateTo = new Date(endDate)
        break
      default:
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
    }

    let reportData = {}

    switch (type) {
      case 'sales':
        reportData = await generateSalesReport(dateFrom, dateTo)
        break
      case 'products':
        reportData = await generateProductsReport(dateFrom, dateTo)
        break
      case 'customers':
        reportData = await generateCustomersReport(dateFrom, dateTo)
        break
      case 'orders':
        reportData = await generateOrdersReport(dateFrom, dateTo)
        break
      default:
        reportData = await generateDashboardReport(dateFrom, dateTo)
    }

    return NextResponse.json({
      report: reportData,
      period: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString(),
        type: period
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN REPORTS API] Erro ao gerar relatório:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    )
  }
}

// Relatório de Vendas
async function generateSalesReport(dateFrom: Date, dateTo: Date) {
  // Buscar pedidos no período
  const { data: orders, error } = await supabase
    .from('rona_orders')
    .select('*')
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
  const totalOrders = orders?.length || 0
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Vendas por status
  const salesByStatus = orders?.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + (order.total_amount || 0)
    return acc
  }, {} as Record<string, number>) || {}

  // Vendas por dia (últimos 30 dias)
  const dailySales = await getDailySales(dateFrom, dateTo)

  return {
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      salesByStatus
    },
    dailySales,
    orders: orders || []
  }
}

// Relatório de Produtos
async function generateProductsReport(dateFrom: Date, dateTo: Date) {
  // Buscar produtos
  const { data: products, error } = await supabase
    .from('rona_products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const totalProducts = products?.length || 0
  const activeProducts = products?.filter(p => p.is_active).length || 0
  const lowStockProducts = products?.filter(p => (p.stock || 0) < 10).length || 0

  // Produtos mais vendidos (simulado)
  const topProducts = products?.slice(0, 10).map(product => ({
    ...product,
    sales_count: Math.floor(Math.random() * 100),
    revenue: Math.floor(Math.random() * 10000)
  })) || []

  return {
    summary: {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStock: products?.filter(p => (p.stock || 0) === 0).length || 0
    },
    topProducts,
    products: products || []
  }
}

// Relatório de Clientes
async function generateCustomersReport(dateFrom: Date, dateTo: Date) {
  // Buscar clientes
  const { data: customers, error } = await supabase
    .from('rona_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const totalCustomers = customers?.length || 0
  const activeCustomers = customers?.filter(c => c.is_active).length || 0

  // Clientes com mais pedidos (simulado)
  const topCustomers = customers?.slice(0, 10).map(customer => ({
    ...customer,
    orders_count: Math.floor(Math.random() * 20),
    total_spent: Math.floor(Math.random() * 5000)
  })) || []

  return {
    summary: {
      totalCustomers,
      activeCustomers,
      newCustomers: customers?.filter(c => 
        new Date(c.created_at) >= dateFrom
      ).length || 0
    },
    topCustomers,
    customers: customers || []
  }
}

// Relatório de Pedidos
async function generateOrdersReport(dateFrom: Date, dateTo: Date) {
  // Buscar pedidos no período
  const { data: orders, error } = await supabase
    .from('rona_orders')
    .select('*')
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString())
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  const totalOrders = orders?.length || 0
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0
  const confirmedOrders = orders?.filter(o => o.status === 'confirmed').length || 0
  const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0
  const cancelledOrders = orders?.filter(o => o.status === 'cancelled').length || 0

  return {
    summary: {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders
    },
    orders: orders || []
  }
}

// Relatório do Dashboard
async function generateDashboardReport(dateFrom: Date, dateTo: Date) {
  const [salesData, productsData, customersData, ordersData] = await Promise.all([
    generateSalesReport(dateFrom, dateTo),
    generateProductsReport(dateFrom, dateTo),
    generateCustomersReport(dateFrom, dateTo),
    generateOrdersReport(dateFrom, dateTo)
  ])

  return {
    sales: salesData,
    products: productsData,
    customers: customersData,
    orders: ordersData
  }
}

// Vendas diárias
async function getDailySales(dateFrom: Date, dateTo: Date) {
  const { data: orders, error } = await supabase
    .from('rona_orders')
    .select('created_at, total_amount')
    .gte('created_at', dateFrom.toISOString())
    .lte('created_at', dateTo.toISOString())

  if (error) throw new Error(error.message)

  // Agrupar por dia
  const dailyData = orders?.reduce((acc, order) => {
    const date = new Date(order.created_at).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, orders: 0 }
    }
    acc[date].revenue += order.total_amount || 0
    acc[date].orders += 1
    return acc
  }, {} as Record<string, { date: string; revenue: number; orders: number }>) || {}

  return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date))
}
