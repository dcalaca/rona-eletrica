import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'

// GET /api/categories - Listar categorias
export async function GET(request: NextRequest) {
  try {
    const { data: categories, error } = await supabase
      .from(tables.categories)
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar categorias' },
      { status: 500 }
    )
  }
}
