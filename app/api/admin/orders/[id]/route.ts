import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/orders/[id] - Buscar pedido específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from(tables.orders)
      .select(`
        *,
        user: ${tables.users}!${tables.orders}_user_id_fkey(id, name, email, phone),
        order_items: ${tables.orderItems}(
          *,
          product: ${tables.products}(
            id,
            name,
            sku,
            price,
            images: ${tables.productImages}(*)
          )
        ),
        address: ${tables.addresses}(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN ORDER API] Erro ao buscar pedido:', error)
    return NextResponse.json(
      { error: 'Pedido não encontrado' },
      { status: 404 }
    )
  }
}

// PUT /api/admin/orders/[id] - Atualizar pedido
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData = {
      status: body.status,
      payment_status: body.payment_status,
      tracking_code: body.tracking_code,
      notes: body.notes,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(tables.orders)
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        user: ${tables.users}!${tables.orders}_user_id_fkey(id, name, email, phone),
        order_items: ${tables.orderItems}(
          *,
          product: ${tables.products}(
            id,
            name,
            sku,
            price,
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
    console.error('❌ [ADMIN ORDER API] Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    )
  }
}
