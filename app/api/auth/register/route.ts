import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, birth_date, gender, password } = body

    // Validar dados obrigatórios
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const { data: existingUser } = await supabase
      .from(tables.users)
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const { data: user, error } = await supabase
      .from(tables.users)
      .insert([{
        name,
        email,
        phone,
        birth_date,
        gender,
        password: hashedPassword,
        role: 'customer',
        is_active: true,
      }])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Remover a senha da resposta
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário' },
      { status: 500 }
    )
  }
}
