import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar chave de serviço para contornar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/messages/[id] - Buscar mensagem específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Buscar mensagem
    const { data: message, error: messageError } = await supabase
      .from('rona_messages')
      .select('*')
      .eq('id', id)
      .single()

    if (messageError) {
      throw new Error(messageError.message)
    }

    // Buscar respostas da mensagem
    const { data: replies } = await supabase
      .from('rona_message_replies')
      .select('*')
      .eq('message_id', id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      message: {
        ...message,
        user: {
          id: message.user_id || 'unknown',
          name: 'Cliente',
          email: 'cliente@email.com',
          phone: ''
        },
        replies: replies || []
      }
    })
  } catch (error) {
    console.error('❌ [ADMIN MESSAGES API] Erro ao buscar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mensagem' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/messages/[id] - Atualizar mensagem específica
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status, priority, assigned_to, notes } = await request.json()

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (priority) updateData.priority = priority
    if (assigned_to) updateData.assigned_to = assigned_to
    if (notes) updateData.notes = notes

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

// DELETE /api/admin/messages/[id] - Deletar mensagem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Deletar respostas primeiro
    await supabase
      .from('rona_message_replies')
      .delete()
      .eq('message_id', id)

    // Deletar mensagem
    const { error } = await supabase
      .from('rona_messages')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ [ADMIN MESSAGES API] Erro ao deletar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar mensagem' },
      { status: 500 }
    )
  }
}
