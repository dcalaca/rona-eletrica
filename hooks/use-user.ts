'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { RonaUser, RonaAddress } from '@/lib/supabase-fixed'

interface UseUserReturn {
  user: RonaUser | null
  addresses: RonaAddress[]
  loading: boolean
  error: string | null
  refetch: () => void
  updateUser: (data: Partial<RonaUser>) => Promise<void>
}

export function useUser(): UseUserReturn {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<RonaUser | null>(null)
  const [addresses, setAddresses] = useState<RonaAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    if (status === 'loading') return
    
    if (!session?.user?.id) {
      setUser(null)
      setAddresses([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/users')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário')
      }

      const data = await response.json()
      setUser(data)
      setAddresses(data.addresses || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (data: Partial<RonaUser>) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar usuário')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }

  useEffect(() => {
    if (status === 'loading') return
    fetchUser()
  }, [session?.user?.id, status])

  return {
    user,
    addresses,
    loading,
    error,
    refetch: fetchUser,
    updateUser
  }
}
