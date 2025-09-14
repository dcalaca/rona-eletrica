import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/orders/user - Buscar pedidos do usuário logado
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Buscar pedidos do usuário
    const { data: orders, error: ordersError } = await supabase
      .from(tables.orders)
      .select(`
        *,
        order_items: ${tables.order_items}(
          *,
          product: ${tables.products}(*)
        ),
        address: ${tables.addresses}(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('Erro ao buscar pedidos:', ordersError)
      // Retornar array vazio em caso de erro, não falhar
      return NextResponse.json([])
    }

    // Se não há pedidos, retornar array vazio
    if (!orders || orders.length === 0) {
      return NextResponse.json([])
    }

    // Formatar dados dos pedidos
    const formattedOrders = orders.map(order => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: order.total,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: order.order_items?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.product?.name || 'Produto não encontrado',
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      })) || [],
      address: order.address,
      payment_method: order.payment_method,
      tracking_code: order.tracking_code,
      notes: order.notes
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}
