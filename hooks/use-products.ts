'use client'

import { useState, useEffect } from 'react'
import { RonaProduct } from '@/lib/supabase'

interface UseProductsOptions {
  page?: number
  limit?: number
  category?: string
  brand?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  featured?: boolean
}

interface UseProductsReturn {
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
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<RonaProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
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
      if (options.category) params.append('category', options.category)
      if (options.brand) params.append('brand', options.brand)
      if (options.search) params.append('search', options.search)
      if (options.minPrice) params.append('min_price', options.minPrice.toString())
      if (options.maxPrice) params.append('max_price', options.maxPrice.toString())
      if (options.sortBy) params.append('sort_by', options.sortBy)
      if (options.sortOrder) params.append('sort_order', options.sortOrder)
      if (options.featured) params.append('featured', 'true')

      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos')
      }

      const data = await response.json()
      
      setProducts(data.products)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [
    options.page,
    options.limit,
    options.category,
    options.brand,
    options.search,
    options.minPrice,
    options.maxPrice,
    options.sortBy,
    options.sortOrder,
    options.featured
  ])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts
  }
}

// Hook para buscar um produto específico
export function useProduct(id: string) {
  const [product, setProduct] = useState<RonaProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${id}`)
        
        if (!response.ok) {
          throw new Error('Produto não encontrado')
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  return { product, loading, error }
}
