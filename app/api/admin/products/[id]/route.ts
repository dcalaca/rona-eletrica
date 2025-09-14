import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/admin/products/[id] - Buscar produto específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from(tables.products)
      .select(`
        *,
        category: ${tables.categories}(id, name),
        brand: ${tables.brands}(id, name),
        images: ${tables.productImages}(*)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN PRODUCT API] Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 }
    )
  }
}

// PUT /api/admin/products/[id] - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      specifications: body.specifications || null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(tables.products)
      .update(productData)
      .eq('id', params.id)
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ [ADMIN PRODUCT API] Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products/[id] - Excluir produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from(tables.products)
      .delete()
      .eq('id', params.id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ message: 'Produto excluído com sucesso' })
  } catch (error) {
    console.error('❌ [ADMIN PRODUCT API] Erro ao excluir produto:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir produto' },
      { status: 500 }
    )
  }
}
