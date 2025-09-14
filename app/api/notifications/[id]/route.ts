import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/notifications/[id] - Atualizar notificação
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json()
    const { is_read } = body

    // Atualizar notificação
    const { data: notification, error: notificationError } = await supabase
      .from(tables.notifications)
      .update({
        is_read,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (notificationError) {
      throw new Error(notificationError.message)
    }

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar notificação' },
      { status: 500 }
    )
  }
}

// DELETE /api/notifications/[id] - Deletar notificação
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Deletar notificação
    const { error: deleteError } = await supabase
      .from(tables.notifications)
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id)

    if (deleteError) {
      throw new Error(deleteError.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar notificação:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar notificação' },
      { status: 500 }
    )
  }
}
