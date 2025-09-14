import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar chave de serviço para contornar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/payments - Listar pagamentos para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // pending, paid, failed, refunded, all
    const method = searchParams.get('method') // credit_card, pix, boleto, all

    // Buscar pedidos do Supabase para simular pagamentos
    let query = supabase
      .from('rona_orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Filtros
    if (search) {
      query = query.or(`order_number.ilike.%${search}%, id.ilike.%${search}%`)
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

    // Simular pagamentos baseados nos pedidos
    const payments = (orders || []).map((order, index) => {
      // Simular diferentes métodos de pagamento
      const methods = ['credit_card', 'pix', 'boleto', 'debit_card']
      const paymentMethod = methods[index % methods.length]
      
      // Simular status baseado no status do pedido
      let paymentStatus = 'pending'
      if (order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
        paymentStatus = 'paid'
      } else if (order.status === 'cancelled') {
        paymentStatus = 'failed'
      }

      // Simular gateway e transaction_id
      const gateway = 'mercadopago'
      const transactionId = `TXN-${order.id.slice(0, 8).toUpperCase()}`

      return {
        id: order.id,
        order_id: order.id,
        transaction_id: transactionId,
        payment_method: paymentMethod,
        amount: order.total_amount || 0,
        status: paymentStatus,
        gateway: gateway,
        gateway_transaction_id: `MP-${order.id.slice(0, 8).toUpperCase()}`,
        notes: paymentStatus === 'paid' ? 'Pagamento processado com sucesso' : 
               paymentStatus === 'failed' ? 'Pagamento não processado' : 'Aguardando processamento',
        created_at: order.created_at,
        updated_at: order.updated_at,
        order: {
          id: order.id,
          order_number: order.order_number || `#${order.id.slice(0, 8)}`,
          total_amount: order.total_amount || 0,
          status: order.status,
          created_at: order.created_at
        },
        customer: {
          id: order.user_id || 'unknown',
          name: 'Cliente Exemplo',
          email: 'cliente@exemplo.com',
          phone: '(11) 99999-9999'
        }
      }
    })

    // Aplicar filtros adicionais
    let filteredPayments = payments

    if (status && status !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.status === status)
    }

    if (method && method !== 'all') {
      filteredPayments = filteredPayments.filter(payment => payment.payment_method === method)
    }

    return NextResponse.json({
      payments: filteredPayments,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN PAYMENTS API] Erro ao buscar pagamentos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pagamentos' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/payments - Atualizar status de pagamento
export async function PUT(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID e status são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar pagamento
    const { data: payment, error: paymentError } = await supabase
      .from('rona_payments')
      .update({
        status,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (paymentError) {
      throw new Error(paymentError.message)
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
