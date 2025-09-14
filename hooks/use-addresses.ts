import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface Address {
  id: string
  user_id: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateAddressData {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  is_default?: boolean
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const fetchAddresses = async () => {
    if (status === 'loading') return
    
    if (!session) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/addresses')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar endereços')
      }

      const data = await response.json()
      setAddresses(data)
    } catch (err) {
      console.error('Erro ao buscar endereços:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createAddress = async (addressData: CreateAddressData) => {
    try {
      setError(null)

      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar endereço')
      }

      const newAddress = await response.json()
      setAddresses(prev => [newAddress, ...prev])
      return newAddress
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateAddress = async (id: string, addressData: CreateAddressData) => {
    try {
      setError(null)

      const response = await fetch(`/api/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar endereço')
      }

      const updatedAddress = await response.json()
      setAddresses(prev => 
        prev.map(addr => addr.id === id ? updatedAddress : addr)
      )
      return updatedAddress
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deleteAddress = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar endereço')
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const setDefaultAddress = async (id: string) => {
    const address = addresses.find(addr => addr.id === id)
    if (!address) return

    try {
      await updateAddress(id, {
        ...address,
        is_default: true
      })
    } catch (err) {
      console.error('Erro ao definir endereço padrão:', err)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [session, status])

  const refetch = () => {
    fetchAddresses()
  }

  return {
    addresses,
    loading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch
  }
}
