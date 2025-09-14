import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/orders - Listar pedidos para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('payment_status')

    let query = supabase
      .from(tables.orders)
      .select(`
        *,
        order_items: ${tables.orderItems}(*)
      `)

    // Filtros
    if (search) {
      query = query.ilike('order_number', `%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (paymentStatus && paymentStatus !== 'all') {
      query = query.eq('payment_status', paymentStatus)
    }

    // Ordenação
    query = query.order('created_at', { ascending: false })

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: orders, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN ORDERS API] Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/orders - Atualizar status do pedido
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, status, paymentStatus } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID do pedido é obrigatório' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updateData.status = status
    }

    if (paymentStatus) {
      updateData.payment_status = paymentStatus
    }

    const { data, error } = await supabase
      .from(tables.orders)
      .update(updateData)
      .eq('id', orderId)
      .select(`
        *,
        user: ${tables.users}(id, name, email, phone),
        order_items: ${tables.orderItems}(
          *,
          product: ${tables.products}(
            id,
            name,
            sku,
            images: ${tables.productImages}(*)
          )
        ),
        address: ${tables.addresses}(*)
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN ORDERS API] Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
}
