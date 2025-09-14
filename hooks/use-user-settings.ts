import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface UserSettings {
  id: string
  email: string
  name: string
  phone?: string
  cpf?: string
  birth_date?: string
  gender?: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UpdateUserData {
  name?: string
  phone?: string
  cpf?: string
  birth_date?: string
  gender?: string
  current_password?: string
  new_password?: string
  confirm_password?: string
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const fetchSettings = async () => {
    if (status === 'loading') return
    
    if (!session) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/settings')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar configurações do usuário')
      }

      const data = await response.json()
      setSettings(data)
    } catch (err) {
      console.error('Erro ao buscar configurações:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (userData: UpdateUserData) => {
    try {
      setError(null)

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar configurações')
      }

      const updatedSettings = await response.json()
      setSettings(updatedSettings)
      return updatedSettings
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const formatCPF = (cpf: string) => {
    // Remove tudo que não é número
    const numbers = cpf.replace(/\D/g, '')
    
    // Aplica a máscara 000.000.000-00
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
    }
  }

  const formatPhone = (phone: string) => {
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, '')
    
    // Aplica a máscara (00) 00000-0000 ou (00) 0000-0000
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'masculino': return 'Masculino'
      case 'feminino': return 'Feminino'
      case 'outro': return 'Outro'
      case 'nao_informar': return 'Não informar'
      default: return gender
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'customer': return 'Cliente'
      case 'vendor': return 'Vendedor'
      case 'admin': return 'Administrador'
      default: return role
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [session, status])

  const refetch = () => {
    fetchSettings()
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
    formatCPF,
    formatPhone,
    getGenderLabel,
    getRoleLabel,
    refetch
  }
}
