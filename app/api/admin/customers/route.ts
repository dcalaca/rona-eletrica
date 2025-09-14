import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/customers - Listar clientes para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // active, inactive, all

    let query = supabase
      .from(tables.users)
      .select(`
        *,
        addresses: ${tables.addresses}(*)
      `, { count: 'exact' })

    // Filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%, email.ilike.%${search}%, phone.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    // Ordenação
    query = query.order('created_at', { ascending: false })

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: customers, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    // Calcular estatísticas para cada cliente
    const customersWithStats = await Promise.all((customers || []).map(async (customer) => {
      // Buscar pedidos do cliente
      const { data: orders } = await supabase
        .from(tables.orders)
        .select('id, total_amount, status, created_at')
        .eq('user_id', customer.id)
        .order('created_at', { ascending: false })

      const totalOrders = orders?.length || 0
      const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const lastOrder = orders && orders.length > 0 ? orders[0].created_at : null
      
      return {
        ...customer,
        stats: {
          totalOrders,
          totalSpent,
          lastOrder,
          averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0
        }
      }
    }))

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN CUSTOMERS API] Erro ao buscar clientes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar clientes' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/customers - Atualizar status do cliente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, isActive } = body

    if (!customerId) {
      return NextResponse.json(
        { error: 'ID do cliente é obrigatório' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from(tables.users)
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN CUSTOMERS API] Erro ao atualizar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente' },
      { status: 500 }
    )
  }
}
