import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { supabase, tables } from './supabase-fixed'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Removendo adapter para usar autenticação customizada
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.is_admin = user.role === 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.is_admin = token.is_admin as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/cadastro',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Verificar se o usuário existe no Supabase
          const { data: user, error } = await supabase
            .from(tables.users)
            .select('*')
            .eq('email', credentials.email)
            .eq('is_active', true)
            .single()

          if (error || !user) {
            return null
          }

          // Verificar senha
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
}

// Funções auxiliares para gerenciar usuários
export async function createUser(userData: {
  email: string
  name: string
  phone?: string
  cpf?: string
  birth_date?: string
  gender?: string
  role?: 'customer' | 'vendor' | 'admin'
}) {
  const { data, error } = await supabase
    .from(tables.users)
    .insert([{
      ...userData,
      role: userData.role || 'customer',
      is_active: true,
    }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from(tables.users)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from(tables.users)
    .select('*')
    .eq('email', email)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateUser(id: string, updates: Partial<{
  name: string
  phone: string
  cpf: string
  birth_date: string
  gender: string
  role: 'customer' | 'vendor' | 'admin'
  is_active: boolean
}>) {
  const { data, error } = await supabase
    .from(tables.users)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteUser(id: string) {
  const { error } = await supabase
    .from(tables.users)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
