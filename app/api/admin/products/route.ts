import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/products - Listar produtos para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let query = supabase
      .from(tables.products)
      .select(`
        *,
        category: ${tables.categories}(id, name),
        brand: ${tables.brands}(id, name),
        images: ${tables.productImages}(*)
      `)

    // Filtros
    if (search) {
      query = query.or(`name.ilike.%${search}%, sku.ilike.%${search}%, description.ilike.%${search}%`)
    }

    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }

    if (status && status !== 'all') {
      query = query.eq('is_active', status === 'Ativo')
    }

    // Ordenação
    query = query.order('created_at', { ascending: false })

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: products, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN PRODUCTS API] Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Criar produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Buscar categoria e marca por nome se não for ID
    let categoryId = body.category_id
    let brandId = body.brand_id

    if (body.category_name && !categoryId) {
      const { data: category } = await supabase
        .from(tables.categories)
        .select('id')
        .eq('name', body.category_name)
        .single()
      
      if (category) {
        categoryId = category.id
      }
    }

    if (body.brand_name && !brandId) {
      const { data: brand } = await supabase
        .from(tables.brands)
        .select('id')
        .eq('name', body.brand_name)
        .single()
      
      if (brand) {
        brandId = brand.id
      }
    }

    const productData = {
      name: body.name,
      sku: body.sku,
      description: body.description,
      price: parseFloat(body.price),
      compare_price: body.compare_price ? parseFloat(body.compare_price) : null,
      cost: body.cost ? parseFloat(body.cost) : null,
      stock_quantity: parseInt(body.stock_quantity || '0'),
      min_stock: parseInt(body.min_stock || '0'),
      category_id: categoryId,
      brand_id: brandId,
      is_active: body.is_active !== false,
      is_featured: body.is_featured || false,
      weight: body.weight ? parseFloat(body.weight) : null,
      dimensions: body.dimensions || null,
      warranty: body.warranty || null,
      specifications: body.specifications || null
    }

    const { data, error } = await supabase
      .from(tables.products)
      .insert([productData])
      .select(`
        *,
        category: ${tables.categories}(id, name),
        brand: ${tables.brands}(id, name),
        images: ${tables.productImages}(*)
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('❌ [ADMIN PRODUCTS API] Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
