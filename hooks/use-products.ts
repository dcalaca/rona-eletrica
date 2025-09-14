'use client'

import { useState, useEffect, useRef } from 'react'
import { RonaProduct } from '@/lib/supabase-fixed'

// Hook para comparar arrays
function useArrayComparison<T>(array: T[] | undefined): string {
  const [comparison, setComparison] = useState('')
  
  useEffect(() => {
    if (!array) {
      setComparison('')
      return
    }
    setComparison(array.join(','))
  }, [array])
  
  return comparison
}

interface UseProductsOptions {
  page?: number
  limit?: number
  categories?: string[]
  brands?: string[]
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  featured?: boolean
  offers?: boolean
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

  // Usar comparação de arrays para evitar re-renders desnecessários
  const categoriesComparison = useArrayComparison(options.categories)
  const brandsComparison = useArrayComparison(options.brands)
  
  // Ref para controlar chamadas concorrentes
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastParamsRef = useRef<string>('')

  const fetchProducts = async () => {
    try {
      // Cancelar chamada anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Criar novo AbortController para esta chamada
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.categories && options.categories.length > 0) {
        params.append('categories', options.categories.join(','))
      }
      if (options.brands && options.brands.length > 0) params.append('brands', options.brands.join(','))
      if (options.search) params.append('search', options.search)
      if (options.minPrice) params.append('min_price', options.minPrice.toString())
      if (options.maxPrice) params.append('max_price', options.maxPrice.toString())
      if (options.sortBy) params.append('sort_by', options.sortBy)
      if (options.sortOrder) params.append('sort_order', options.sortOrder)
      if (options.featured) params.append('featured', 'true')
      if (options.offers) params.append('offers', 'true')

      const paramsString = params.toString()
      // Verificar se os parâmetros mudaram
      if (lastParamsRef.current === paramsString) {
        setLoading(false)
        return
      }
      
      lastParamsRef.current = paramsString

      const response = await fetch(`/api/products?${paramsString}`, {
        signal: abortController.signal
      })
      
      if (!response.ok) {
        console.error('❌ [useProducts] Erro na resposta:', response.status, response.statusText)
        
        // Para ofertas, não mostrar erro, apenas array vazio
        if (options.offers) {
          setProducts([])
          setPagination({ page: 1, limit: 12, total: 0, pages: 0 })
          return
        }
        
        throw new Error('Erro ao buscar produtos')
      }

      const data = await response.json()
      
      if (data.products && data.products.length > 0) {
        }
      
      setProducts(data.products || [])
      setPagination(data.pagination || { page: 1, limit: 12, total: 0, pages: 0 })
    } catch (err) {
      // Ignorar erros de abort
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      console.error('❌ [useProducts] Erro geral:', err)
      
      // Para ofertas, não mostrar erro, apenas array vazio
      if (options.offers) {
        setProducts([])
        setPagination({ page: 1, limit: 12, total: 0, pages: 0 })
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    
    // Cleanup: cancelar chamadas pendentes quando o componente for desmontado
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [
    options.page,
    options.limit,
    categoriesComparison,
    brandsComparison,
    options.search,
    options.minPrice,
    options.maxPrice,
    options.sortBy,
    options.sortOrder,
    options.featured,
    options.offers
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
