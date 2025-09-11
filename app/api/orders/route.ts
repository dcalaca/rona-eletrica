import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/orders - Listar pedidos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const vendorId = searchParams.get('vendor_id')

    let query = supabase
      .from('Rona_Orders')
      .select(`
        *,
        user: Rona_Users(*),
        vendor: Rona_Users(*),
        items: Rona_Order_Items(*)
      `)

    // Filtros baseados no role do usuário
    if (session.user.role === 'customer') {
      query = query.eq('user_id', session.user.id)
    } else if (session.user.role === 'vendor') {
      query = query.eq('vendor_id', session.user.id)
    } else if (session.user.role === 'admin' && vendorId) {
      query = query.eq('vendor_id', vendorId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    // Ordenação
    query = query.order('created_at', { ascending: false })

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: orders, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    )
  }
}

// POST /api/orders - Criar pedido
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Gerar número do pedido
    const orderNumber = `RONA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    
    const orderData = {
      ...body,
      order_number: orderNumber,
      user_id: session.user.id,
      status: 'pending',
      payment_status: 'pending',
      currency: 'BRL'
    }

    const { data: order, error } = await supabase
      .from('Rona_Orders')
      .insert([orderData])
      .select(`
        *,
        user: Rona_Users(*),
        items: Rona_Order_Items(*)
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    )
  }
}
