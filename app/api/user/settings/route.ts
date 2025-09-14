import { NextRequest, NextResponse } from 'next/server'
import { supabase, tables } from '@/lib/supabase-fixed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// GET /api/user/settings - Buscar configurações do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Retornar dados do usuário (sem senha)
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações do usuário' },
      { status: 500 }
    )
  }
}

// PUT /api/user/settings - Atualizar configurações do usuário
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('Erro: Sessão não encontrada')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    console.log('Sessão encontrada:', session.user.email)

    // Buscar usuário pelo email da sessão
    const { data: user, error: userError } = await supabase
      .from(tables.users)
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      console.log('Erro ao buscar usuário:', userError)
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    console.log('Usuário encontrado:', user.id)

    const body = await request.json()
    console.log('Dados recebidos:', body)
    
    const { 
      name,
      phone,
      cpf,
      birth_date,
      gender,
      current_password,
      new_password,
      confirm_password
    } = body

    // Preparar dados para atualização
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Atualizar dados básicos se fornecidos
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (cpf !== undefined) updateData.cpf = cpf
    if (birth_date !== undefined) updateData.birth_date = birth_date
    if (gender !== undefined) updateData.gender = gender

    console.log('Dados para atualizar:', updateData)

    // Atualizar senha se fornecida
    if (new_password && current_password) {
      // Verificar senha atual
      const isValidPassword = await bcrypt.compare(current_password, user.password)
      
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 })
      }

      // Verificar se as novas senhas coincidem
      if (new_password !== confirm_password) {
        return NextResponse.json({ error: 'As senhas não coincidem' }, { status: 400 })
      }

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(new_password, 12)
      updateData.password = hashedPassword
    }

    // Atualizar usuário
    console.log('Executando atualização no banco...')
    const { data: updatedUser, error: updateError } = await supabase
      .from(tables.users)
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.log('Erro ao atualizar usuário:', updateError)
      throw new Error(updateError.message)
    }

    console.log('Usuário atualizado com sucesso:', updatedUser.id)

    // Retornar dados atualizados (sem senha)
    const { password, ...userWithoutPassword } = updatedUser
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações do usuário' },
      { status: 500 }
    )
  }
}
