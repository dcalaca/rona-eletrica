import { useState, useEffect } from 'react'

interface CategoryStats {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  totalSubcategories: number
  activeSubcategories: number
}

interface Category {
  id: string
  name: string
  description?: string
  slug: string
  parent_id?: string
  image_url?: string
  icon?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  parent?: {
    id: string
    name: string
    slug: string
  }
  children?: Array<{
    id: string
    name: string
    slug: string
    is_active: boolean
  }>
  stats: CategoryStats
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

interface UseAdminCategoriesOptions {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive' | 'all'
  parentId?: string | 'root'
}

export function useAdminCategories(options: UseAdminCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page.toString())
      if (options.limit) params.append('limit', options.limit.toString())
      if (options.search) params.append('search', options.search)
      if (options.status) params.append('status', options.status)
      if (options.parentId) params.append('parent_id', options.parentId)

      const url = `/api/admin/categories?${params.toString()}`
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [useAdminCategories] Erro na resposta:', response.status, errorText)
        throw new Error(`Erro ao buscar categorias: ${response.status}`)
      }

      const data = await response.json()
      setCategories(data.categories || [])
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const updateCategoryStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atualizar categoria: ${response.status}`)
      }

      const updatedCategory = await response.json()
      // Atualizar lista local
      setCategories(prev => 
        prev.map(category => 
          category.id === categoryId 
            ? { ...category, is_active: isActive, updated_at: new Date().toISOString() }
            : category
        )
      )

      return updatedCategory
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro ao atualizar categoria:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria')
      throw err
    }
  }

  const updateCategoryOrder = async (categoryId: string, sortOrder: number) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sort_order: sortOrder }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atualizar ordem: ${response.status}`)
      }

      const updatedCategory = await response.json()
      // Atualizar lista local
      setCategories(prev => 
        prev.map(category => 
          category.id === categoryId 
            ? { ...category, sort_order: sortOrder, updated_at: new Date().toISOString() }
            : category
        )
      )

      return updatedCategory
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro ao atualizar ordem:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar ordem')
      throw err
    }
  }

  const getCategoryDetails = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao buscar categoria: ${response.status}`)
      }

      const categoryDetails = await response.json()
      return categoryDetails
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro ao buscar detalhes:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar detalhes')
      throw err
    }
  }

  const createCategory = async (categoryData: {
    name: string
    description?: string
    slug: string
    parent_id?: string
    image_url?: string
    icon?: string
    is_active?: boolean
    sort_order?: number
  }) => {
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao criar categoria: ${response.status}`)
      }

      const newCategory = await response.json()
      // Recarregar lista
      await fetchCategories()

      return newCategory
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro ao criar categoria:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria')
      throw err
    }
  }

  const updateCategory = async (categoryId: string, categoryData: Partial<Category>) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao atualizar categoria: ${response.status}`)
      }

      const updatedCategory = await response.json()
      // Atualizar lista local
      setCategories(prev => 
        prev.map(category => 
          category.id === categoryId 
            ? { ...category, ...updatedCategory }
            : category
        )
      )

      return updatedCategory
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro ao atualizar categoria:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria')
      throw err
    }
  }

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Erro ao deletar categoria: ${response.status}`)
      }

      const deletedCategory = await response.json()
      // Recarregar lista
      await fetchCategories()

      return deletedCategory
    } catch (err) {
      console.error('❌ [useAdminCategories] Erro ao deletar categoria:', err)
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria')
      throw err
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [options.page, options.limit, options.search, options.status, options.parentId])

  return {
    categories,
    pagination,
    loading,
    error,
    fetchCategories,
    updateCategoryStatus,
    updateCategoryOrder,
    getCategoryDetails,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
