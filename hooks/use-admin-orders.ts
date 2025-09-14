'use client'

import { useState, useEffect } from 'react'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    sku: string
    images?: Array<{ url: string }>
  }
}

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  created_at: string
  updated_at: string
  tracking_code?: string
  notes?: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
  order_items: OrderItem[]
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
}

interface UseAdminOrdersOptions {
  page?: number
  limit?: number
  search?: string
  status?: string
  paymentStatus?: string
}

interface UseAdminOrdersReturn {
  orders: Order[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  refetch: () => void
  updateOrderStatus: (orderId: string, status: string, paymentStatus?: string) => Promise<void>
  getOrderDetails: (orderId: string) => Promise<Order>
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}): UseAdminOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.status) params.append('status', options.status)
      if (options.paymentStatus) params.append('payment_status', options.paymentStatus)

      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos')
      }

      const data = await response.json()
      setOrders(data.orders || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      console.error('❌ [useAdminOrders] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string): Promise<void> => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status, paymentStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar pedido')
      }

      // Recarregar lista de pedidos
      await fetchOrders()
    } catch (err) {
      console.error('❌ [useAdminOrders] Erro ao atualizar pedido:', err)
      throw err
    }
  }

  const getOrderDetails = async (orderId: string): Promise<Order> => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao buscar detalhes do pedido')
      }

      const order = await response.json()
      return order
    } catch (err) {
      console.error('❌ [useAdminOrders] Erro ao buscar detalhes do pedido:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [
    options.page,
    options.limit,
    options.search,
    options.status,
    options.paymentStatus
  ])

  return {
    orders,
    loading,
    error,
    pagination,
    refetch: fetchOrders,
    updateOrderStatus,
    getOrderDetails
  }
}
