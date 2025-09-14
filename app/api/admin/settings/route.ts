import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Usar chave de serviço para contornar RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/admin/settings - Buscar configurações
export async function GET(request: NextRequest) {
  try {
    // Buscar configurações do Supabase
    const { data: settingsData, error } = await supabase
      .from('rona_settings')
      .select('key, value')
      .eq('type', 'json')

    if (error) {
      throw new Error(error.message)
    }

    // Transformar dados do Supabase em objeto de configurações
    const settings: any = {}
    
    if (settingsData) {
      settingsData.forEach((item: any) => {
        try {
          settings[item.key] = JSON.parse(item.value)
        } catch (parseError) {
          console.error(`❌ Erro ao fazer parse de ${item.key}:`, parseError)
        }
      })
    }

    return NextResponse.json({
      settings,
      last_updated: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [ADMIN SETTINGS API] Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Atualizar configurações
export async function PUT(request: NextRequest) {
  try {
    const { section, data } = await request.json()

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Seção e dados são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar configurações no Supabase
    const { error: upsertError } = await supabase
      .from('rona_settings')
      .upsert({
        key: section,
        value: JSON.stringify(data),
        type: 'json',
        description: `Configurações de ${section}`,
        is_public: true
      }, {
        onConflict: 'key'
      })

    if (upsertError) {
      throw new Error(upsertError.message)
    }

    return NextResponse.json({
      success: true,
      message: `Configurações de ${section} salvas com sucesso`,
      updated_at: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ [ADMIN SETTINGS API] Erro ao salvar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar configurações' },
      { status: 500 }
    )
  }
}
