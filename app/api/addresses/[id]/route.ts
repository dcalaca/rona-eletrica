import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/addresses/[id] - Atualizar endereço
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
      street, 
      number, 
      complement, 
      neighborhood, 
      city, 
      state, 
      zip_code, 
      is_default = false 
    } = body

    // Se este endereço será o padrão, remover padrão dos outros
    if (is_default) {
      await supabase
        .from(tables.addresses)
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    // Atualizar endereço
    const { data: address, error: addressError } = await supabase
      .from(tables.addresses)
      .update({
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code,
        is_default,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (addressError) {
      throw new Error(addressError.message)
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar endereço' },
      { status: 500 }
    )
  }
}

// DELETE /api/addresses/[id] - Deletar endereço
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

    // Deletar endereço
    const { error: deleteError } = await supabase
      .from(tables.addresses)
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar endereço:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar endereço' },
      { status: 500 }
    )
  }
}