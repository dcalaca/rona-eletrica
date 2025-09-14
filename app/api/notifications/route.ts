import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Instância do Supabase com service key para bypassar RLS
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/notifications - Buscar notificações do admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json([])
    }

    // Verificar se é admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Buscar notificações baseadas em pedidos pendentes, mensagens não lidas, etc.
    const notifications = []

    // 1. Pedidos pendentes de confirmação
    const { data: pendingOrders, error: ordersError } = await supabaseService
      .from(tables.orders)
      .select('id, order_number, created_at, status')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5)

    if (!ordersError && pendingOrders) {
      pendingOrders.forEach(order => {
        notifications.push({
          id: `order-${order.id}`,
          type: 'order',
          title: 'Novo Pedido Pendente',
          message: `Pedido #${order.order_number} aguarda confirmação`,
          is_read: false,
          created_at: order.created_at,
          data: { order_id: order.id, order_number: order.order_number }
        })
      })
    }

    // 2. Pedidos com problemas de pagamento
    const { data: paymentIssues, error: paymentError } = await supabaseService
      .from(tables.orders)
      .select('id, order_number, created_at, payment_status')
      .eq('payment_status', 'failed')
      .order('created_at', { ascending: false })
      .limit(3)

    if (!paymentError && paymentIssues) {
      paymentIssues.forEach(order => {
        notifications.push({
          id: `payment-${order.id}`,
          type: 'alert',
          title: 'Problema de Pagamento',
          message: `Falha no pagamento do pedido #${order.order_number}`,
          is_read: false,
          created_at: order.created_at,
          data: { order_id: order.id, order_number: order.order_number }
        })
      })
    }

    // 3. Produtos com estoque baixo
    const { data: lowStockProducts, error: stockError } = await supabaseService
      .from(tables.products)
      .select('id, name, stock_quantity, min_stock_quantity')
      .lte('stock_quantity', 5)
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true })
      .limit(3)

    if (!stockError && lowStockProducts) {
      lowStockProducts.forEach(product => {
        notifications.push({
          id: `stock-${product.id}`,
          type: 'alert',
          title: 'Estoque Baixo',
          message: `${product.name} - apenas ${product.stock_quantity} unidades`,
          is_read: false,
          created_at: new Date().toISOString(),
          data: { product_id: product.id, product_name: product.name }
        })
      })
    }

    // 4. Mensagens não lidas (simuladas baseadas em pedidos)
    const { data: recentOrders, error: messagesError } = await supabaseService
      .from(tables.orders)
      .select('id, order_number, created_at, notes')
      .not('notes', 'is', null)
      .order('created_at', { ascending: false })
      .limit(2)

    if (!messagesError && recentOrders) {
      recentOrders.forEach(order => {
        if (order.notes && order.notes.trim()) {
          notifications.push({
            id: `message-${order.id}`,
            type: 'message',
            title: 'Nova Mensagem',
            message: `Mensagem no pedido #${order.order_number}`,
            is_read: false,
            created_at: order.created_at,
            data: { order_id: order.id, order_number: order.order_number }
          })
        }
      })
    }

    // Ordenar por data de criação (mais recentes primeiro)
    notifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json(notifications.slice(0, 10)) // Limitar a 10 notificações

  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PATCH /api/notifications/read-all - Marcar todas como lidas
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Como as notificações são geradas dinamicamente, 
    // vamos simular marcando como lidas (em um sistema real,
    // você salvaria isso no banco de dados)
    return NextResponse.json({ message: 'Todas as notificações foram marcadas como lidas' })

  } catch (error) {
    console.error('Erro ao marcar notificações como lidas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}