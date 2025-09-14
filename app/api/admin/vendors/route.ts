import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/vendors - Listar vendedores para admin
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
      `)
      .eq('role', 'vendor')

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

    const { data: vendors, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    // Calcular estatísticas para cada vendedor
    const vendorsWithStats = await Promise.all((vendors || []).map(async (vendor) => {
      // Buscar vendas do vendedor
      const { data: orders } = await supabase
        .from(tables.orders)
        .select('id, total_amount, status, created_at')
        .eq('vendor_id', vendor.id)
        .order('created_at', { ascending: false })

      // Buscar comissões
      const { data: commissions } = await supabase
        .from(tables.commissions)
        .select('commission_amount, status')
        .eq('vendor_id', vendor.id)

      const totalSales = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const totalOrders = orders?.length || 0
      const totalCommissions = commissions?.reduce((sum, comm) => 
        comm.status === 'paid' ? sum + (comm.commission_amount || 0) : sum, 0) || 0
      const pendingCommissions = commissions?.reduce((sum, comm) => 
        comm.status === 'pending' ? sum + (comm.commission_amount || 0) : sum, 0) || 0
      
      return {
        ...vendor,
        stats: {
          totalSales,
          totalOrders,
          totalCommissions,
          pendingCommissions,
          lastSale: orders && orders.length > 0 ? orders[0].created_at : null,
          averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
        }
      }
    }))

    return NextResponse.json({
      vendors: vendorsWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN VENDORS API] Erro ao buscar vendedores:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar vendedores' },
      { status: 500 }
    )
  }
}

// POST /api/admin/vendors - Criar vendedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, commissionRate } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar usuário vendedor
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .insert([{
        name,
        email,
        phone,
        role: 'vendor',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (userError) {
      throw new Error(userError.message)
    }

    // Criar registro de vendedor com taxa de comissão
    const { data: vendor, error: vendorError } = await supabase
      .from(tables.vendors)
      .insert([{
        user_id: user.id,
        commission_rate: commissionRate || 5.0, // 5% padrão
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (vendorError) {
      // Se falhar ao criar vendedor, remover usuário criado
      await supabase.from(tables.users).delete().eq('id', user.id)
      throw new Error(vendorError.message)
    }

    return NextResponse.json({ ...user, vendor_info: vendor }, { status: 201 })
  } catch (error) {
    console.error('❌ [ADMIN VENDORS API] Erro ao criar vendedor:', error)
    return NextResponse.json(
      { error: 'Erro ao criar vendedor' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/vendors - Atualizar vendedor
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { vendorId, isActive, commissionRate } = body

    if (!vendorId) {
      return NextResponse.json(
        { error: 'ID do vendedor é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar usuário
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq('id', vendorId)
      .select()
      .single()

    if (userError) {
      throw new Error(userError.message)
    }

    // Atualizar informações do vendedor
    if (commissionRate !== undefined) {
      const { error: vendorError } = await supabase
        .from(tables.vendors)
        .update({ 
          commission_rate: commissionRate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', vendorId)

      if (vendorError) {
        throw new Error(vendorError.message)
      }
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('❌ [ADMIN VENDORS API] Erro ao atualizar vendedor:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar vendedor' },
      { status: 500 }
    )
  }
}
