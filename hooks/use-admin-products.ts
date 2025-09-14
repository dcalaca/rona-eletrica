'use client'

import { useState, useEffect } from 'react'
import { RonaProduct } from '@/lib/supabase-fixed'

interface UseAdminProductsOptions {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}

interface UseAdminProductsReturn {
  products: RonaProduct[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  refetch: () => void
  createProduct: (productData: any) => Promise<RonaProduct>
  updateProduct: (id: string, productData: any) => Promise<RonaProduct>
  deleteProduct: (id: string) => Promise<void>
}

export function useAdminProducts(options: UseAdminProductsOptions = {}): UseAdminProductsReturn {
  const [products, setProducts] = useState<RonaProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)

      const response = await fetch(`/api/admin/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos')
      }

      const data = await response.json()
      setProducts(data.products || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      console.error('❌ [useAdminProducts] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createProduct = async (productData: any): Promise<RonaProduct> => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar produto')
      }

      const newProduct = await response.json()
      // Recarregar lista de produtos
      await fetchProducts()
      
      return newProduct
    } catch (err) {
      console.error('❌ [useAdminProducts] Erro ao criar produto:', err)
      throw err
    }
  }

  const updateProduct = async (id: string, productData: any): Promise<RonaProduct> => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar produto')
      }

      const updatedProduct = await response.json()
      // Recarregar lista de produtos
      await fetchProducts()
      
      return updatedProduct
    } catch (err) {
      console.error('❌ [useAdminProducts] Erro ao atualizar produto:', err)
      throw err
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao excluir produto')
      }

      // Recarregar lista de produtos
      await fetchProducts()
    } catch (err) {
      console.error('❌ [useAdminProducts] Erro ao excluir produto:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [
    options.page,
    options.limit,
    options.search,
    options.category,
    options.status
  ])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
