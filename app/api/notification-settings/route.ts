import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/notification-settings - Buscar configurações de notificações do usuário
export async function GET(request: NextRequest) {
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

    // Buscar configurações de notificações do usuário
    const { data: settings, error: settingsError } = await supabase
      .from(tables.notification_settings)
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (settingsError) {
      // Se não existir configurações, criar padrão
      const defaultSettings = {
        user_id: user.id,
        email_notifications: true,
        sms_notifications: false,
        push_notifications: true,
        order_updates: true,
        promotions: true,
        security_alerts: true,
        newsletter: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data: newSettings, error: createError } = await supabase
        .from(tables.notification_settings)
        .insert(defaultSettings)
        .select()
        .single()

      if (createError) {
        throw new Error(createError.message)
      }

      return NextResponse.json(newSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao buscar configurações de notificações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações de notificações' },
      { status: 500 }
    )
  }
}

// PUT /api/notification-settings - Atualizar configurações de notificações
export async function PUT(request: NextRequest) {
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
    const { 
      email_notifications,
      sms_notifications,
      push_notifications,
      order_updates,
      promotions,
      security_alerts,
      newsletter
    } = body

    // Atualizar ou criar configurações
    const { data: settings, error: settingsError } = await supabase
      .from(tables.notification_settings)
      .upsert({
        user_id: user.id,
        email_notifications,
        sms_notifications,
        push_notifications,
        order_updates,
        promotions,
        security_alerts,
        newsletter,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (settingsError) {
      throw new Error(settingsError.message)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Erro ao atualizar configurações de notificações:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações de notificações' },
      { status: 500 }
    )
  }
}
