import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  created_at: string
  updated_at: string
  items: OrderItem[]
  address?: {
    id: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
  }
  payment_method: string
  tracking_code?: string
  notes?: string
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const fetchOrders = async () => {
    if (status === 'loading') return
    
    if (!session) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/orders/user')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos')
      }

      const data = await response.json()
      setOrders(data)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [session, status])

  const refetch = () => {
    fetchOrders()
  }

  return {
    orders,
    loading,
    error,
    refetch
  }
}
