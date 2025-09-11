import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products/[id] - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('Rona_Products')
      .select(`
        *,
        category: Rona_Categories(*),
        brand: Rona_Brands(*),
        images: Rona_Product_Images(*),
        reviews: Rona_Product_Reviews(
          *,
          user: Rona_Users(name)
        )
      `)
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Produto não encontrado' },
      { status: 404 }
    )
  }
}

// PUT /api/products/[id] - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('Rona_Products')
      .update(body)
      .eq('id', params.id)
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Deletar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('Rona_Products')
      .delete()
      .eq('id', params.id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ message: 'Produto deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar produto' },
      { status: 500 }
    )
  }
}
