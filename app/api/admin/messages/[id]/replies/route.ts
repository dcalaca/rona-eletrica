import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar chave de serviço para contornar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/admin/messages/[id]/replies - Criar resposta para mensagem
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { content, user_id, is_internal } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      )
    }

    // Criar resposta
    const { data: reply, error } = await supabase
      .from('rona_message_replies')
      .insert({
        message_id: id,
        content,
        user_id: user_id || null,
        is_internal: is_internal || false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Atualizar status da mensagem para "replied"
    await supabase
      .from('rona_messages')
      .update({
        status: 'replied',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('❌ [ADMIN MESSAGES API] Erro ao criar resposta:', error)
    return NextResponse.json(
      { error: 'Erro ao criar resposta' },
      { status: 500 }
    )
  }
}
