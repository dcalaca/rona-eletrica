'use client'

import { useState, useEffect } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
  addresses?: any[]
  orders?: any[]
  stats: {
    totalOrders: number
    totalSpent: number
    lastOrder: string | null
    averageOrderValue: number
    ordersByStatus?: Record<string, number>
  }
}

interface UseAdminCustomersOptions {
  page?: number
  limit?: number
  search?: string
  status?: string
}

interface UseAdminCustomersReturn {
  customers: Customer[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  refetch: () => void
  updateCustomerStatus: (customerId: string, isActive: boolean) => Promise<void>
  getCustomerDetails: (customerId: string) => Promise<Customer>
}

export function useAdminCustomers(options: UseAdminCustomersOptions = {}): UseAdminCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.status) params.append('status', options.status)

      const url = `/api/admin/customers?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [useAdminCustomers] Erro na resposta:', response.status, errorText)
        throw new Error(`Erro ao buscar clientes: ${response.status}`)
      }

      const data = await response.json()
      setCustomers(data.customers || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      console.error('❌ [useAdminCustomers] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateCustomerStatus = async (customerId: string, isActive: boolean): Promise<void> => {
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, isActive }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar cliente')
      }

      // Recarregar lista de clientes
      await fetchCustomers()
    } catch (err) {
      console.error('❌ [useAdminCustomers] Erro ao atualizar cliente:', err)
      throw err
    }
  }

  const getCustomerDetails = async (customerId: string): Promise<Customer> => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao buscar detalhes do cliente')
      }

      const customer = await response.json()
      return customer
    } catch (err) {
      console.error('❌ [useAdminCustomers] Erro ao buscar detalhes do cliente:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [
    options.page,
    options.limit,
    options.search,
    options.status
  ])

  return {
    customers,
    loading,
    error,
    pagination,
    refetch: fetchCustomers,
    updateCustomerStatus,
    getCustomerDetails
  }
}
