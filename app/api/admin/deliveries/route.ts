import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/deliveries - Listar entregas para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // pending, in_transit, delivered, failed, all
    const deliveryPerson = searchParams.get('delivery_person') // ID do entregador

    // Buscar pedidos que precisam de entrega
    let query = supabase
      .from(tables.orders)
      .select('*', { count: 'exact' })
      .in('status', ['confirmed', 'processing', 'shipped', 'delivered'])
      .order('created_at', { ascending: false })

    // Filtros
    if (search) {
      query = query.or(`order_number.ilike.%${search}%, tracking_code.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      if (status === 'pending') {
        query = query.in('status', ['confirmed', 'processing'])
      } else if (status === 'in_transit') {
        query = query.eq('status', 'shipped')
      } else if (status === 'delivered') {
        query = query.eq('status', 'delivered')
      } else if (status === 'failed') {
        query = query.eq('status', 'cancelled')
      }
    }

    if (deliveryPerson) {
      query = query.eq('delivery_person_id', deliveryPerson)
    }

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: orders, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    // Transformar pedidos em entregas com informações básicas
    const deliveries = (orders || []).map(order => {
      // Determinar status da entrega baseado no status do pedido
      let deliveryStatus = 'pending'
      if (order.status === 'shipped') {
        deliveryStatus = 'in_transit'
      } else if (order.status === 'delivered') {
        deliveryStatus = 'delivered'
      } else if (order.status === 'cancelled') {
        deliveryStatus = 'failed'
      }

      return {
        id: order.id,
        order_number: order.order_number || `#${order.id.slice(0, 8)}`,
        customer: {
          id: order.user_id || '',
          name: 'Cliente',
          email: 'cliente@email.com',
          phone: ''
        },
        delivery_person: null,
        status: deliveryStatus,
        order_status: order.status,
        total_amount: order.total_amount || 0,
        shipping_address: order.shipping_address || null,
        tracking_code: order.tracking_code || null,
        estimated_delivery: order.estimated_delivery || null,
        delivered_at: order.delivered_at || null,
        created_at: order.created_at,
        updated_at: order.updated_at,
        items: [],
        notes: order.notes || ''
      }
    })

    return NextResponse.json({
      deliveries,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN DELIVERIES API] Erro ao buscar entregas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar entregas' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/deliveries - Atualizar entrega
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      orderId, 
      deliveryPersonId, 
      status, 
      trackingCode, 
      estimatedDelivery,
      notes 
    } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID do pedido é obrigatório' },
        { status: 400 }
      )
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (deliveryPersonId !== undefined) updateData.delivery_person_id = deliveryPersonId
    if (trackingCode !== undefined) updateData.tracking_code = trackingCode
    if (estimatedDelivery !== undefined) updateData.estimated_delivery = estimatedDelivery
    if (notes !== undefined) updateData.notes = notes

    // Atualizar status do pedido baseado no status da entrega
    if (status) {
      if (status === 'in_transit') {
        updateData.status = 'shipped'
      } else if (status === 'delivered') {
        updateData.status = 'delivered'
        updateData.delivered_at = new Date().toISOString()
      } else if (status === 'failed') {
        updateData.status = 'cancelled'
      }
    }

    const { data, error } = await supabase
      .from(tables.orders)
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN DELIVERIES API] Erro ao atualizar entrega:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar entrega' },
      { status: 500 }
    )
  }
}
