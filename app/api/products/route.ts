import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/products - Listar produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || []
    const search = searchParams.get('search')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'
    const featured = searchParams.get('featured')

    let query = supabase
      .from(tables.products)
      .select(`
        *,
        category: ${tables.categories}(*),
        brand: ${tables.brands}(*),
        images: ${tables.productImages}(*)
      `)
      .eq('is_active', true)

    // Filtros
    if (categories.length > 0) {
      query = query.in('category_id', categories)
    }

    if (brands.length > 0) {
      query = query.in('brand_id', brands)
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

    // Para ofertas, filtrar produtos com desconto (preço menor que preço de comparação)
    if (searchParams.get('offers') === 'true') {
      query = query.not('compare_price', 'is', null)
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

    // Filtrar produtos em oferta se necessário
    let filteredProducts = products || []
    if (searchParams.get('offers') === 'true') {
      try {
        filteredProducts = (products || []).filter(product => {
          if (!product || !product.compare_price) return false
          return product.price < product.compare_price
        })
        } catch (filterError) {
        console.error('❌ [PRODUCTS API] Erro no filtro:', filterError)
        filteredProducts = []
      }
    }

    return NextResponse.json({
      products: filteredProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit)
      }
    })
  } catch (error) {
    console.error('❌ [PRODUCTS API] Erro ao buscar produtos:', error)
    
    // Se for erro de ofertas, retornar array vazio em vez de erro
    if (searchParams.get('offers') === 'true') {
      return NextResponse.json({
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          pages: 0
        }
      })
    }
    
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
      .from(tables.products)
      .insert([body])
      .select(`
        *,
        category: ${tables.categories}(*),
        brand: ${tables.brands}(*),
        images: ${tables.productImages}(*)
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
