import { useState, useEffect } from 'react'

interface DeliveryPerson {
  id: string
  name: string
  phone?: string
}

interface Delivery {
  id: string
  order_number: string
  customer: {
    id: string
    name: string
    email: string
    phone?: string
  }
  delivery_person?: DeliveryPerson
  status: 'pending' | 'in_transit' | 'delivered' | 'failed'
  order_status: string
  total_amount: number
  shipping_address?: any
  tracking_code?: string
  estimated_delivery?: string
  delivered_at?: string
  created_at: string
  updated_at: string
  items: any[]
  notes?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface UseAdminDeliveriesOptions {
  page?: number
  limit?: number
  search?: string
  status?: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'all'
  deliveryPerson?: string
}

export function useAdminDeliveries(options: UseAdminDeliveriesOptions = {}) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.status) params.append('status', options.status)
      if (options.deliveryPerson) params.append('delivery_person', options.deliveryPerson)

      const url = `/api/admin/deliveries?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [useAdminDeliveries] Erro na resposta:', response.status, errorText)
        throw new Error(`Erro ao buscar entregas: ${response.status}`)
      }

      const data = await response.json()
      setDeliveries(data.deliveries || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      console.error('❌ [useAdminDeliveries] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateDeliveryStatus = async (orderId: string, status: string, additionalData?: any) => {
    try {
      const response = await fetch(`/api/admin/deliveries/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          ...additionalData
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atualizar entrega: ${response.status}`)
      }

      const updatedDelivery = await response.json()
      // Atualizar lista local
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === orderId 
            ? { 
                ...delivery, 
                status: status as any,
                ...additionalData,
                updated_at: new Date().toISOString() 
              }
            : delivery
        )
      )

      return updatedDelivery
    } catch (err) {
      console.error('❌ [useAdminDeliveries] Erro ao atualizar entrega:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar entrega')
      throw err
    }
  }

  const assignDeliveryPerson = async (orderId: string, deliveryPersonId: string) => {
    try {
      const response = await fetch(`/api/admin/deliveries/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          delivery_person_id: deliveryPersonId
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atribuir entregador: ${response.status}`)
      }

      const updatedDelivery = await response.json()
      // Recarregar lista para pegar dados atualizados do entregador
      await fetchDeliveries()

      return updatedDelivery
    } catch (err) {
      console.error('❌ [useAdminDeliveries] Erro ao atribuir entregador:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atribuir entregador')
      throw err
    }
  }

  const addTrackingCode = async (orderId: string, trackingCode: string) => {
    try {
      const response = await fetch(`/api/admin/deliveries/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tracking_code: trackingCode
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao adicionar código de rastreamento: ${response.status}`)
      }

      const updatedDelivery = await response.json()
      // Atualizar lista local
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === orderId 
            ? { 
                ...delivery, 
                tracking_code: trackingCode,
                updated_at: new Date().toISOString() 
              }
            : delivery
        )
      )

      return updatedDelivery
    } catch (err) {
      console.error('❌ [useAdminDeliveries] Erro ao adicionar código de rastreamento:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar código de rastreamento')
      throw err
    }
  }

  const getDeliveryDetails = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/deliveries/${orderId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao buscar entrega: ${response.status}`)
      }

      const deliveryDetails = await response.json()
      return deliveryDetails
    } catch (err) {
      console.error('❌ [useAdminDeliveries] Erro ao buscar detalhes:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar detalhes')
      throw err
    }
  }

  const addTrackingMovement = async (orderId: string, movementData: {
    status: string
    description: string
    location?: string
  }) => {
    try {
      const response = await fetch(`/api/admin/deliveries/${orderId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movementData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao adicionar movimentação: ${response.status}`)
      }

      const result = await response.json()
      // Recarregar lista
      await fetchDeliveries()

      return result
    } catch (err) {
      console.error('❌ [useAdminDeliveries] Erro ao adicionar movimentação:', err)
      setError(err instanceof Error ? err.message : 'Erro ao adicionar movimentação')
      throw err
    }
  }

  useEffect(() => {
    fetchDeliveries()
  }, [options.page, options.limit, options.search, options.status, options.deliveryPerson])

  return {
    deliveries,
    pagination,
    loading,
    error,
    fetchDeliveries,
    updateDeliveryStatus,
    assignDeliveryPerson,
    addTrackingCode,
    getDeliveryDetails,
    addTrackingMovement
  }
}
