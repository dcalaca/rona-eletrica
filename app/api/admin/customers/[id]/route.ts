import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/customers/[id] - Buscar cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from(tables.users)
      .select(`
        *,
        addresses: ${tables.addresses}(*),
        orders: ${tables.orders}(
          id, 
          total_amount, 
          status, 
          created_at,
          order_items: ${tables.orderItems}(
            id,
            quantity,
            price,
            product: ${tables.products}(
              id,
              name,
              sku,
              images: ${tables.productImages}(*)
            )
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Calcular estatísticas detalhadas
    const orders = data.orders || []
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const lastOrder = orders.length > 0 ? orders[0].created_at : null
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0

    // Agrupar pedidos por status
    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const customerWithStats = {
      ...data,
      stats: {
        totalOrders,
        totalSpent,
        lastOrder,
        averageOrderValue,
        ordersByStatus
      }
    }

    return NextResponse.json(customerWithStats)
  } catch (error) {
    console.error('❌ [ADMIN CUSTOMER API] Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: 'Cliente não encontrado' },
      { status: 404 }
    )
  }
}

// PUT /api/admin/customers/[id] - Atualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      is_active: body.is_active,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(tables.users)
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN CUSTOMER API] Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
      { status: 500 }
    )
  }
}
