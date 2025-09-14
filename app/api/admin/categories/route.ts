import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/categories - Listar categorias para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // active, inactive, all
    const parentId = searchParams.get('parent_id') // Para filtrar subcategorias

    let query = supabase
      .from(tables.categories)
      .select('*', { count: 'exact' })

    // Filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%, slug.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    if (parentId) {
      if (parentId === 'root') {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', parentId)
      }
    }

    // Ordenação
    query = query.order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: categories, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    // Calcular estatísticas básicas para cada categoria
    const categoriesWithStats = (categories || []).map((category) => {
      return {
        ...category,
        stats: {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0,
          totalSubcategories: 0,
          activeSubcategories: 0
        }
      }
    })

    return NextResponse.json({
      categories: categoriesWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN CATEGORIES API] Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories - Criar categoria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      description, 
      slug, 
      parent_id, 
      image_url, 
      icon, 
      is_active = true,
      sort_order = 0
    } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se slug já existe
    const { data: existingCategory } = await supabase
      .from(tables.categories)
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Slug já existe' },
        { status: 400 }
      )
    }

    // Criar categoria
    const { data: category, error } = await supabase
      .from(tables.categories)
      .insert([{
        name,
        description,
        slug,
        parent_id: parent_id || null,
        image_url,
        icon,
        is_active,
        sort_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('❌ [ADMIN CATEGORIES API] Erro ao criar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao criar categoria' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/categories - Atualizar categoria
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      categoryId, 
      name, 
      description, 
      slug, 
      parent_id, 
      image_url, 
      icon, 
      is_active,
      sort_order
    } = body

    if (!categoryId) {
      return NextResponse.json(
        { error: 'ID da categoria é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se slug já existe (exceto para a própria categoria)
    if (slug) {
      const { data: existingCategory } = await supabase
        .from(tables.categories)
        .select('id')
        .eq('slug', slug)
        .neq('id', categoryId)
        .single()

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Slug já existe' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (slug !== undefined) updateData.slug = slug
    if (parent_id !== undefined) updateData.parent_id = parent_id
    if (image_url !== undefined) updateData.image_url = image_url
    if (icon !== undefined) updateData.icon = icon
    if (is_active !== undefined) updateData.is_active = is_active
    if (sort_order !== undefined) updateData.sort_order = sort_order

    const { data, error } = await supabase
      .from(tables.categories)
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN CATEGORIES API] Erro ao atualizar categoria:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar categoria' },
      { status: 500 }
    )
  }
}
