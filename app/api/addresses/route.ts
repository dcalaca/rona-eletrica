import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/addresses - Buscar endereços do usuário logado
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

    // Buscar endereços do usuário
    const { data: addresses, error: addressesError } = await supabase
      .from(tables.addresses)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (addressesError) {
      console.error('Erro ao buscar endereços:', addressesError)
      return NextResponse.json([])
    }

    return NextResponse.json(addresses || [])
  } catch (error) {
    console.error('Erro ao buscar endereços:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar endereços' },
      { status: 500 }
    )
  }
}

// POST /api/addresses - Criar novo endereço
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

    // Criar novo endereço
    const { data: address, error: addressError } = await supabase
      .from(tables.addresses)
      .insert({
        user_id: user.id,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zip_code,
        is_default,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (addressError) {
      throw new Error(addressError.message)
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error('Erro ao criar endereço:', error)
    return NextResponse.json(
      { error: 'Erro ao criar endereço' },
      { status: 500 }
    )
  }
}