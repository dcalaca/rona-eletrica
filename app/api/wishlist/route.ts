import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/wishlist - Listar itens da lista de desejos
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: wishlist, error } = await supabase
      .from(tables.cartItems)
      .select(`
        *,
        product: ${tables.products}(
          *,
          category: ${tables.categories}(*),
          brand: ${tables.brands}(*),
          images: ${tables.productImages}(*)
        )
      `)
      .eq('user_id', session.user.id)
      .eq('is_wishlist', true)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error('Erro ao buscar lista de desejos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar lista de desejos' },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Adicionar item à lista de desejos
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 })
    }

    // Verificar se o produto existe
    const { data: product, error: productError } = await supabase
      .from(tables.products)
      .select('id, name, price')
      .eq('id', product_id)
      .eq('is_active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Verificar se já está na lista de desejos
    const { data: existingItem } = await supabase
      .from(tables.cartItems)
      .select('id')
      .eq('user_id', session.user.id)
      .eq('product_id', product_id)
      .eq('is_wishlist', true)
      .single()

    if (existingItem) {
      return NextResponse.json({ error: 'Produto já está na lista de desejos' }, { status: 400 })
    }

    // Adicionar à lista de desejos
    const { data, error } = await supabase
      .from(tables.cartItems)
      .insert([{
        user_id: session.user.id,
        product_id,
        quantity: 1,
        is_wishlist: true
      }])
      .select(`
        *,
        product: ${tables.products}(
          *,
          category: ${tables.categories}(*),
          brand: ${tables.brands}(*),
          images: ${tables.productImages}(*)
        )
      `)
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erro ao adicionar à lista de desejos:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar à lista de desejos' },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remover item da lista de desejos
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')

    if (!product_id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 })
    }

    const { error } = await supabase
      .from(tables.cartItems)
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', product_id)
      .eq('is_wishlist', true)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover da lista de desejos:', error)
    return NextResponse.json(
      { error: 'Erro ao remover da lista de desejos' },
      { status: 500 }
    )
  }
}
