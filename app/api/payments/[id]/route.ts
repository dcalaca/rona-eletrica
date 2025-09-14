import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/payments/[id] - Atualizar método de pagamento
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Atualizar método de pagamento
    const { data: payment, error: paymentError } = await supabase
      .from(tables.payment_methods)
      .update({
        type,
        card_number: card_number.replace(/\s/g, ''), // Remove espaços
        card_holder_name,
        expiry_month,
        expiry_year,
        cvv,
        is_default,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (paymentError) {
      throw new Error(paymentError.message)
    }

    return NextResponse.json(payment)
  } catch (error) {
    console.error('Erro ao atualizar método de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar método de pagamento' },
      { status: 500 }
    )
  }
}

// DELETE /api/payments/[id] - Deletar método de pagamento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Deletar método de pagamento
    const { error: deleteError } = await supabase
      .from(tables.payment_methods)
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar método de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar método de pagamento' },
      { status: 500 }
    )
  }
}
