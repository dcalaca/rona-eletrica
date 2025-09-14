import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/categories/[id] - Buscar categoria específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from(tables.categories)
      .select(`
        *,
        parent: ${tables.categories}!${tables.categories}_parent_id_fkey(id, name, slug),
        children: ${tables.categories}!${tables.categories}_parent_id_fkey(
          id, 
          name, 
          slug, 
          description,
          is_active,
          sort_order,
          created_at
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Buscar produtos da categoria
    const { data: products } = await supabase
      .from(tables.products)
      .select(`
        id,
        name,
        sku,
        price,
        stock_quantity,
        is_active,
        created_at
      `)
      .eq('category_id', params.id)
      .order('created_at', { ascending: false })

    // Calcular estatísticas detalhadas
    const totalProducts = products?.length || 0
    const activeProducts = products?.filter(p => p.is_active).length || 0
    const lowStockProducts = products?.filter(p => (p.stock_quantity || 0) < 10).length || 0
    const outOfStockProducts = products?.filter(p => (p.stock_quantity || 0) === 0).length || 0

    // Agrupar produtos por status
    const productsByStatus = products?.reduce((acc, product) => {
      const status = product.is_active ? 'active' : 'inactive'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Agrupar produtos por estoque
    const productsByStock = products?.reduce((acc, product) => {
      const stock = product.stock_quantity || 0
      if (stock === 0) {
        acc.outOfStock = (acc.outOfStock || 0) + 1
      } else if (stock < 10) {
        acc.lowStock = (acc.lowStock || 0) + 1
      } else {
        acc.inStock = (acc.inStock || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    const categoryWithStats = {
      ...data,
      products: products || [],
      stats: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        outOfStockProducts,
        productsByStatus,
        productsByStock
      }
    }

    return NextResponse.json(categoryWithStats)
  } catch (error) {
    console.error('❌ [ADMIN CATEGORY API] Erro ao buscar categoria:', error)
    return NextResponse.json(
      { error: 'Categoria não encontrada' },
      { status: 404 }
    )
  }
}

// PUT /api/admin/categories/[id] - Atualizar categoria
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData = {
      name: body.name,
      description: body.description,
      slug: body.slug,
      parent_id: body.parent_id,
      image_url: body.image_url,
      icon: body.icon,
      is_active: body.is_active,
      sort_order: body.sort_order,
      updated_at: new Date().toISOString()
    }

    // Verificar se slug já existe (exceto para a própria categoria)
    if (body.slug) {
      const { data: existingCategory } = await supabase
        .from(tables.categories)
        .select('id')
        .eq('slug', body.slug)
        .neq('id', params.id)
        .single()

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Slug já existe' },
          { status: 400 }
        )
      }
    }

    const { data, error } = await supabase
      .from(tables.categories)
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN CATEGORY API] Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories/[id] - Desativar categoria
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se há produtos na categoria
    const { data: products } = await supabase
      .from(tables.products)
      .select('id')
      .eq('category_id', params.id)
      .limit(1)

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir categoria com produtos' },
        { status: 400 }
      )
    }

    // Verificar se há subcategorias
    const { data: subcategories } = await supabase
      .from(tables.categories)
      .select('id')
      .eq('parent_id', params.id)
      .limit(1)

    if (subcategories && subcategories.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir categoria com subcategorias' },
        { status: 400 }
      )
    }

    // Desativar categoria em vez de deletar
    const { data, error } = await supabase
      .from(tables.categories)
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN CATEGORY API] Erro ao desativar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao desativar categoria' },
      { status: 500 }
    )
  }
}
