import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/brands - Listar marcas
export async function GET(request: NextRequest) {
  try {
    const { data: brands, error } = await supabase
      .from(tables.brands)
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(brands)
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar marcas' },
      { status: 500 }
    )
  }
}
