import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { createClient } from '@supabase/supabase-js'

// Instância do Supabase com service key para bypassar RLS
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/cart - Buscar itens do carrinho do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Se não há sessão, retornar carrinho vazio
    if (!session?.user?.email) {
      return NextResponse.json([])
    }

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json([])
    }

    // Buscar itens do carrinho do usuário
    const { data: cartItems, error: cartError } = await supabaseService
      .from(tables.cartItems)
      .select('*')
      .eq('user_id', user.id)

    if (cartError) {
      console.error('Erro ao buscar itens do carrinho:', cartError.message)
      return NextResponse.json([])
    }

    // Buscar dados dos produtos para cada item do carrinho
    const formattedItems = []
    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        const { data: product, error: productError } = await supabaseService
          .from(tables.products)
          .select('*')
          .eq('id', item.product_id)
          .single()

        formattedItems.push({
          id: item.id,
          product_id: item.product_id,
          name: product?.name || 'Produto não encontrado',
          price: product?.price || 0,
          quantity: item.quantity,
          image: product?.image || '/placeholder.svg',
          total: (product?.price || 0) * item.quantity
        })
      }
    }

    return NextResponse.json(formattedItems)
  } catch (error) {
    console.error('❌ [CART GET] Erro geral:', error)
    return NextResponse.json([])
  }
}

// POST /api/cart - Adicionar item ao carrinho
export async function POST(request: NextRequest) {
  try {
    // Log detalhado da sessão
    const session = await getServerSession(authOptions)
    // Se não há sessão, retornar erro
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Você precisa fazer login para adicionar produtos ao carrinho' }, { status: 401 })
    }

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { product_id, quantity = 1 } = body

    if (!product_id) {
      return NextResponse.json({ error: 'ID do produto é obrigatório' }, { status: 400 })
    }

    // Verificar se o produto existe
    const { data: product, error: productError } = await supabaseService
      .from(tables.products)
      .select('*')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    // Verificar se o item já existe no carrinho
    const { data: existingItem, error: existingError } = await supabaseService
      .from(tables.cartItems)
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', product_id)
      .single()

    if (existingItem) {
      // Atualizar quantidade do item existente
      const { data: updatedItem, error: updateError } = await supabaseService
        .from(tables.cartItems)
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ [CART POST] Erro ao atualizar:', updateError.message)
        throw new Error(updateError.message)
      }

      return NextResponse.json(updatedItem)
    } else {
      // Criar novo item no carrinho
      const { data: newItem, error: createError } = await supabaseService
        .from(tables.cartItems)
        .insert({
          user_id: user.id,
          product_id,
          quantity
        })
        .select()
        .single()

      if (createError) {
        console.error('❌ [CART POST] Erro ao criar:', createError)
        console.error('❌ [CART POST] Erro message:', createError.message)
        console.error('❌ [CART POST] Erro code:', createError.code)
        throw new Error(createError.message || 'Erro desconhecido ao criar item')
      }

      return NextResponse.json(newItem)
    }
  } catch (error) {
    console.error('❌ [CART POST] Erro geral:', error)
    console.error('❌ [CART POST] Stack trace:', error.stack)
    return NextResponse.json(
      { error: 'Erro ao adicionar ao carrinho' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remover item do carrinho
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const item_id = searchParams.get('item_id')

    if (!item_id) {
      return NextResponse.json({ error: 'ID do item é obrigatório' }, { status: 400 })
    }

    const { error: deleteError } = await supabaseService
      .from(tables.cartItems)
      .delete()
      .eq('id', item_id)
      .eq('user_id', user.id)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    return NextResponse.json({ message: 'Item removido do carrinho' })
  } catch (error) {
    console.error('Erro ao remover do carrinho:', error)
    return NextResponse.json(
      { error: 'Erro ao remover do carrinho' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Atualizar quantidade de um item no carrinho
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    // Se não há sessão, retornar erro
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Você precisa fazer login para atualizar o carrinho' }, { status: 401 })
    }

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { item_id, quantity } = body

    if (!item_id || quantity === undefined) {
      return NextResponse.json({ error: 'ID do item e quantidade são obrigatórios' }, { status: 400 })
    }

    // Se quantidade for 0 ou menor, remover o item
    if (quantity <= 0) {
      const { error: deleteError } = await supabaseService
        .from(tables.cartItems)
        .delete()
        .eq('id', item_id)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('❌ [CART PUT] Erro ao remover item:', deleteError.message)
        throw new Error(deleteError.message)
      }

      return NextResponse.json({ message: 'Item removido do carrinho' })
    }

    // Atualizar quantidade do item
    const { data: updatedItem, error: updateError } = await supabaseService
      .from(tables.cartItems)
      .update({
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', item_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ [CART PUT] Erro ao atualizar item:', updateError.message)
      throw new Error(updateError.message)
    }

    return NextResponse.json(updatedItem)

  } catch (error) {
    console.error('❌ [CART PUT] Erro geral:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar carrinho' },
      { status: 500 }
    )
  }
}
