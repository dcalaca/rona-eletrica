import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar chave de serviço para contornar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/messages - Listar mensagens para admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const status = searchParams.get('status') // unread, read, replied, all
    const category = searchParams.get('category') // support, general, complaint, suggestion, all
    const priority = searchParams.get('priority') // low, medium, high, urgent, all

    // Buscar pedidos do Supabase para simular mensagens baseadas em problemas reais
    let query = supabase
      .from('rona_orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Filtros
    if (search) {
      query = query.or(`order_number.ilike.%${search}%, notes.ilike.%${search}%`)
    }

    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: orders, error, count } = await query
      .range(from, to)
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    // Simular mensagens baseadas nos pedidos
    const messages = (orders || []).map((order, index) => {
      // Simular diferentes tipos de mensagens baseadas no status do pedido
      let messageData = {
        subject: '',
        content: '',
        category: 'general',
        priority: 'medium',
        status: 'unread'
      }

      if (order.status === 'pending') {
        messageData = {
          subject: `Pedido ${order.order_number} - Aguardando confirmação`,
          content: `Cliente está aguardando confirmação do pedido ${order.order_number} no valor de R$ ${order.total_amount}.`,
          category: 'support',
          priority: 'high',
          status: 'unread'
        }
      } else if (order.status === 'cancelled') {
        messageData = {
          subject: `Pedido ${order.order_number} - Cancelamento`,
          content: `Cliente cancelou o pedido ${order.order_number}. Motivo: ${order.notes || 'Não informado'}.`,
          category: 'complaint',
          priority: 'medium',
          status: 'read'
        }
      } else if (order.status === 'delivered') {
        messageData = {
          subject: `Pedido ${order.order_number} - Entregue com sucesso`,
          content: `Pedido ${order.order_number} foi entregue com sucesso. Cliente satisfeito.`,
          category: 'general',
          priority: 'low',
          status: 'closed'
        }
      } else {
        messageData = {
          subject: `Pedido ${order.order_number} - Status: ${order.status}`,
          content: `Atualização do pedido ${order.order_number}. Status atual: ${order.status}.`,
          category: 'support',
          priority: 'medium',
          status: 'replied'
        }
      }

      return {
        id: order.id,
        subject: messageData.subject,
        content: messageData.content,
        category: messageData.category,
        priority: messageData.priority,
        status: messageData.status,
        user_id: order.user_id,
        assigned_to: order.status === 'cancelled' ? 'admin-1' : null,
        notes: order.notes || null,
        created_at: order.created_at,
        updated_at: order.updated_at,
        user: {
          id: order.user_id || 'unknown',
          name: 'Cliente Exemplo',
          email: 'cliente@exemplo.com',
          phone: '(11) 99999-9999'
        },
        replies: [],
        reply_count: messageData.status === 'replied' ? 1 : 0
      }
    })

    // Aplicar filtros adicionais
    let filteredMessages = messages

    if (status && status !== 'all') {
      filteredMessages = filteredMessages.filter(message => message.status === status)
    }

    if (category && category !== 'all') {
      filteredMessages = filteredMessages.filter(message => message.category === category)
    }

    if (priority && priority !== 'all') {
      filteredMessages = filteredMessages.filter(message => message.priority === priority)
    }

    return NextResponse.json({
      messages: filteredMessages,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN MESSAGES API] Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    )
  }
}

// POST /api/admin/messages - Criar nova mensagem
export async function POST(request: NextRequest) {
  try {
    const { subject, content, category, priority, user_id } = await request.json()

    if (!subject || !content || !category || !priority) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: subject, content, category, priority' },
        { status: 400 }
      )
    }

    const { data: message, error } = await supabase
      .from('rona_messages')
      .insert({
        subject,
        content,
        category,
        priority,
        user_id: user_id || null,
        status: 'unread',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('❌ [ADMIN MESSAGES API] Erro ao criar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao criar mensagem' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/messages - Atualizar status de mensagem
export async function PUT(request: NextRequest) {
  try {
    const { id, status, priority, assigned_to } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID e status são obrigatórios' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (priority) updateData.priority = priority
    if (assigned_to) updateData.assigned_to = assigned_to

    const { data: message, error } = await supabase
      .from('rona_messages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error('❌ [ADMIN MESSAGES API] Erro ao atualizar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar mensagem' },
      { status: 500 }
    )
  }
}
