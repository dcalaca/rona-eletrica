import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/payments - Buscar métodos de pagamento do usuário logado
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

    // Buscar métodos de pagamento do usuário
    const { data: payments, error: paymentsError } = await supabase
      .from(tables.payment_methods)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (paymentsError) {
      console.error('Erro ao buscar métodos de pagamento:', paymentsError)
      return NextResponse.json([])
    }

    return NextResponse.json(payments || [])
  } catch (error) {
    console.error('Erro ao buscar métodos de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar métodos de pagamento' },
      { status: 500 }
    )
  }
}

// POST /api/payments - Criar novo método de pagamento
export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { 
      type, 
      card_number, 
      card_holder_name, 
      expiry_month, 
      expiry_year, 
      cvv,
      is_default = false 
    } = body

    // Se este método será o padrão, remover padrão dos outros
    if (is_default) {
      await supabase
        .from(tables.payment_methods)
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    // Criar novo método de pagamento
    const { data: payment, error: paymentError } = await supabase
      .from(tables.payment_methods)
      .insert({
        user_id: user.id,
        type,
        card_number: card_number.replace(/\s/g, ''), // Remove espaços
        card_holder_name,
        expiry_month,
        expiry_year,
        cvv,
        is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error(paymentError.message)
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Erro ao criar método de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar método de pagamento' },
      { status: 500 }
    )
  }
}
