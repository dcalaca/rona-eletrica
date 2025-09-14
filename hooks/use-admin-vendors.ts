import { useState, useEffect } from 'react'

interface VendorStats {
  totalSales: number
  totalOrders: number
  totalCommissions: number
  pendingCommissions: number
  lastSale: string | null
  averageOrderValue: number
}

interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
  addresses?: any[]
  vendor_info?: {
    commission_rate: number
  }
  stats: VendorStats
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface UseAdminVendorsOptions {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive' | 'all'
}

export function useAdminVendors(options: UseAdminVendorsOptions = {}) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.status) params.append('status', options.status)

      const url = `/api/admin/vendors?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [useAdminVendors] Erro na resposta:', response.status, errorText)
        throw new Error(`Erro ao buscar vendedores: ${response.status}`)
      }

      const data = await response.json()
      setVendors(data.vendors || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      console.error('❌ [useAdminVendors] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateVendorStatus = async (vendorId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atualizar vendedor: ${response.status}`)
      }

      const updatedVendor = await response.json()
      // Atualizar lista local
      setVendors(prev => 
        prev.map(vendor => 
          vendor.id === vendorId 
            ? { ...vendor, is_active: isActive, updated_at: new Date().toISOString() }
            : vendor
        )
      )

      return updatedVendor
    } catch (err) {
      console.error('❌ [useAdminVendors] Erro ao atualizar vendedor:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar vendedor')
      throw err
    }
  }

  const updateVendorCommission = async (vendorId: string, commissionRate: number) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commission_rate: commissionRate }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atualizar comissão: ${response.status}`)
      }

      const updatedVendor = await response.json()
      // Atualizar lista local
      setVendors(prev => 
        prev.map(vendor => 
          vendor.id === vendorId 
            ? { 
                ...vendor, 
                vendor_info: { 
                  ...vendor.vendor_info, 
                  commission_rate: commissionRate 
                },
                updated_at: new Date().toISOString() 
              }
            : vendor
        )
      )

      return updatedVendor
    } catch (err) {
      console.error('❌ [useAdminVendors] Erro ao atualizar comissão:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar comissão')
      throw err
    }
  }

  const getVendorDetails = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/admin/vendors/${vendorId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao buscar vendedor: ${response.status}`)
      }

      const vendorDetails = await response.json()
      return vendorDetails
    } catch (err) {
      console.error('❌ [useAdminVendors] Erro ao buscar detalhes:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar detalhes')
      throw err
    }
  }

  const createVendor = async (vendorData: {
    name: string
    email: string
    phone?: string
    commissionRate?: number
  }) => {
    try {
      const response = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao criar vendedor: ${response.status}`)
      }

      const newVendor = await response.json()
      // Recarregar lista
      await fetchVendors()

      return newVendor
    } catch (err) {
      console.error('❌ [useAdminVendors] Erro ao criar vendedor:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar vendedor')
      throw err
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [options.page, options.limit, options.search, options.status])

  return {
    vendors,
    pagination,
    loading,
    error,
    fetchVendors,
    updateVendorStatus,
    updateVendorCommission,
    getVendorDetails,
    createVendor
  }
}
