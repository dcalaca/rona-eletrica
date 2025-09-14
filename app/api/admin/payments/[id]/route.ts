import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/payments/[id] - Buscar pagamento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar pagamento com detalhes completos
    const { data: payment, error: paymentError } = await supabase
      .from(tables.payments)
      .select('*')
      .eq('id', id)
      .single()

    if (paymentError) {
      throw new Error(paymentError.message)
    }

    // Buscar dados do pedido
    const { data: order } = await supabase
      .from(tables.orders)
      .select(`
        *,
        user: ${tables.users}!${tables.orders}_user_id_fkey(id, name, email, phone),
        order_items: ${tables.orderItems}(
          *,
          product: ${tables.products}(id, name, sku, price)
        )
      `)
      .eq('id', payment.order_id)
      .single()

    // Buscar histórico de transações relacionadas
    const { data: relatedPayments } = await supabase
      .from(tables.payments)
      .select('*')
      .eq('order_id', payment.order_id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      payment: {
        ...payment,
        order,
        related_payments: relatedPayments || []
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN PAYMENTS API] Erro ao buscar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pagamento' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/payments/[id] - Atualizar pagamento específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status, notes, refund_amount, refund_reason } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar pagamento
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (notes) updateData.notes = notes
    if (refund_amount) updateData.refund_amount = refund_amount
    if (refund_reason) updateData.refund_reason = refund_reason

    const { data: payment, error: paymentError } = await supabase
      .from(tables.payments)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (paymentError) {
      throw new Error(paymentError.message)
    }

    // Atualizar status do pedido baseado no status do pagamento
    let orderStatus = 'pending'
    if (status === 'paid') {
      orderStatus = 'confirmed'
    } else if (status === 'failed') {
      orderStatus = 'cancelled'
    } else if (status === 'refunded') {
      orderStatus = 'refunded'
    }

    const { error: orderError } = await supabase
      .from(tables.orders)
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.order_id)

    if (orderError) {
      console.error('❌ [ADMIN PAYMENTS API] Erro ao atualizar pedido:', orderError)
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('❌ [ADMIN PAYMENTS API] Erro ao atualizar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar pagamento' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/payments/[id] - Deletar pagamento (apenas se não processado)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Verificar se o pagamento pode ser deletado
    const { data: payment } = await supabase
      .from(tables.payments)
      .select('status')
      .eq('id', id)
      .single()

    if (payment?.status === 'paid') {
      return NextResponse.json(
        { error: 'Não é possível deletar um pagamento processado' },
        { status: 400 }
      )
    }

    // Deletar pagamento
    const { error } = await supabase
      .from(tables.payments)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ [ADMIN PAYMENTS API] Erro ao deletar pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar pagamento' },
      { status: 500 }
    )
  }
}
