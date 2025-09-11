import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - Listar produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const featured = searchParams.get('featured')

    let query = supabase
      .from('Rona_Products')
      .select(`
        *,
        category: Rona_Categories(*),
        brand: Rona_Brands(*),
        images: Rona_Product_Images(*)
      `)
      .eq('is_active', true)

    // Filtros
    if (category) {
      query = query.eq('category_id', category)
    }

    if (brand) {
      query = query.eq('brand_id', brand)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%, description.ilike.%${search}%, sku.ilike.%${search}%`)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Ordenação
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

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
      products,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

// POST /api/products - Criar produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('Rona_Products')
      .insert([body])
      .select(`
        *,
        category: Rona_Categories(*),
        brand: Rona_Brands(*),
        images: Rona_Product_Images(*)
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto' },
      { status: 500 }
    )
  }
}
