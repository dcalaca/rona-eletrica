import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/deliveries/[id] - Buscar entrega específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from(tables.orders)
      .select(`
        *,
        user: ${tables.users}!${tables.orders}_user_id_fkey(
          id, 
          name, 
          email, 
          phone,
          addresses: ${tables.addresses}(*)
        ),
        delivery_person: ${tables.users}!${tables.orders}_delivery_person_id_fkey(
          id, 
          name, 
          phone
        ),
        order_items: ${tables.orderItems}(
          *,
          product: ${tables.products}(
            id,
            name,
            sku,
            price,
            weight,
            dimensions
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Determinar status da entrega
    let deliveryStatus = 'pending'
    if (data.status === 'shipped') {
      deliveryStatus = 'in_transit'
    } else if (data.status === 'delivered') {
      deliveryStatus = 'delivered'
    } else if (data.status === 'cancelled') {
      deliveryStatus = 'failed'
    }

    // Buscar histórico de movimentações (simulado por enquanto)
    const deliveryHistory = [
      {
        id: '1',
        status: 'pending',
        description: 'Pedido confirmado e aguardando separação',
        timestamp: data.created_at,
        location: 'Centro de Distribuição'
      },
      {
        id: '2',
        status: 'processing',
        description: 'Produtos sendo separados',
        timestamp: data.updated_at,
        location: 'Centro de Distribuição'
      }
    ]

    if (data.status === 'shipped' || data.status === 'delivered') {
      deliveryHistory.push({
        id: '3',
        status: 'in_transit',
        description: 'Produto enviado para entrega',
        timestamp: data.updated_at,
        location: 'Em trânsito'
      })
    }

    if (data.status === 'delivered') {
      deliveryHistory.push({
        id: '4',
        status: 'delivered',
        description: 'Produto entregue com sucesso',
        timestamp: data.delivered_at || data.updated_at,
        location: data.shipping_address?.address || 'Endereço de entrega'
      })
    }

    const deliveryWithDetails = {
      ...data,
      delivery_status: deliveryStatus,
      delivery_history: deliveryHistory,
      // Informações calculadas
      total_weight: data.order_items?.reduce((sum: number, item: any) => 
        sum + ((item.product?.weight || 0) * item.quantity), 0) || 0,
      total_items: data.order_items?.reduce((sum: number, item: any) => 
        sum + item.quantity, 0) || 0
    }

    return NextResponse.json(deliveryWithDetails)
  } catch (error) {
    console.error('❌ [ADMIN DELIVERY API] Erro ao buscar entrega:', error)
    return NextResponse.json(
      { error: 'Entrega não encontrada' },
      { status: 404 }
    )
  }
}

// PUT /api/admin/deliveries/[id] - Atualizar entrega
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData = {
      delivery_person_id: body.delivery_person_id,
      tracking_code: body.tracking_code,
      estimated_delivery: body.estimated_delivery,
      notes: body.notes,
      updated_at: new Date().toISOString()
    }

    // Atualizar status do pedido baseado no status da entrega
    if (body.status) {
      if (body.status === 'in_transit') {
        updateData.status = 'shipped'
      } else if (body.status === 'delivered') {
        updateData.status = 'delivered'
        updateData.delivered_at = new Date().toISOString()
      } else if (body.status === 'failed') {
        updateData.status = 'cancelled'
      }
    }

    const { data, error } = await supabase
      .from(tables.orders)
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN DELIVERY API] Erro ao atualizar entrega:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar entrega' },
      { status: 500 }
    )
  }
}

// POST /api/admin/deliveries/[id]/track - Adicionar movimentação de rastreamento
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, description, location } = body

    if (!status || !description) {
      return NextResponse.json(
        { error: 'Status e descrição são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar pedido com nova movimentação
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status === 'in_transit') {
      updateData.status = 'shipped'
    } else if (status === 'delivered') {
      updateData.status = 'delivered'
      updateData.delivered_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(tables.orders)
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Movimentação adicionada com sucesso',
      delivery: data
    })
  } catch (error) {
    console.error('❌ [ADMIN DELIVERY API] Erro ao adicionar movimentação:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar movimentação' },
      { status: 500 }
    )
  }
}
