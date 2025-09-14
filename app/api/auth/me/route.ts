import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: session.user?.id,
      email: session.user?.email,
      name: session.user?.name,
      role: session.user?.role,
      is_admin: session.user?.is_admin || false
    })
  } catch (error) {
    console.error('❌ [AUTH ME API] Erro:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
