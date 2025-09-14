import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/vendors/[id] - Buscar vendedor específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from(tables.users)
      .select(`
        *,
        addresses: ${tables.addresses}(*),
        vendor_info: ${tables.vendors}(*)
      `)
      .eq('id', params.id)
      .eq('role', 'vendor')
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Buscar vendas do vendedor
    const { data: orders } = await supabase
      .from(tables.orders)
      .select(`
        *,
        user: ${tables.users}!${tables.orders}_user_id_fkey(id, name, email),
        order_items: ${tables.orderItems}(
          *,
          product: ${tables.products}(
            id,
            name,
            sku,
            price
          )
        )
      `)
      .eq('vendor_id', params.id)
      .order('created_at', { ascending: false })

    // Buscar comissões
    const { data: commissions } = await supabase
      .from(tables.commissions)
      .select('*')
      .eq('vendor_id', params.id)
      .order('created_at', { ascending: false })

    // Calcular estatísticas detalhadas
    const totalSales = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalOrders = orders?.length || 0
    const totalCommissions = commissions?.reduce((sum, comm) => 
      comm.status === 'paid' ? sum + (comm.commission_amount || 0) : sum, 0) || 0
    const pendingCommissions = commissions?.reduce((sum, comm) => 
      comm.status === 'pending' ? sum + (comm.commission_amount || 0) : sum, 0) || 0

    // Agrupar vendas por status
    const salesByStatus = orders?.reduce((acc, order) => {
      const status = order.status || 'unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Agrupar vendas por mês (últimos 12 meses)
    const salesByMonth = orders?.reduce((acc, order) => {
      const month = new Date(order.created_at).toISOString().substring(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + (order.total_amount || 0)
      return acc
    }, {} as Record<string, number>) || {}

    const vendorWithStats = {
      ...data,
      orders: orders || [],
      commissions: commissions || [],
      stats: {
        totalSales,
        totalOrders,
        totalCommissions,
        pendingCommissions,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        salesByStatus,
        salesByMonth
      }
    }

    return NextResponse.json(vendorWithStats)
  } catch (error) {
    console.error('❌ [ADMIN VENDOR API] Erro ao buscar vendedor:', error)
    return NextResponse.json(
      { error: 'Vendedor não encontrado' },
      { status: 404 }
    )
  }
}

// PUT /api/admin/vendors/[id] - Atualizar vendedor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      is_active: body.is_active,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(tables.users)
      .update(updateData)
      .eq('id', params.id)
      .eq('role', 'vendor')
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Atualizar informações do vendedor se fornecidas
    if (body.commission_rate !== undefined) {
      const { error: vendorError } = await supabase
        .from(tables.vendors)
        .update({ 
          commission_rate: body.commission_rate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', params.id)

      if (vendorError) {
        throw new Error(vendorError.message)
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN VENDOR API] Erro ao atualizar vendedor:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar vendedor' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/vendors/[id] - Desativar vendedor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Desativar vendedor em vez de deletar
    const { data, error } = await supabase
      .from(tables.users)
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('role', 'vendor')
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN VENDOR API] Erro ao desativar vendedor:', error)
    return NextResponse.json(
      { error: 'Erro ao desativar vendedor' },
      { status: 500 }
    )
  }
}
