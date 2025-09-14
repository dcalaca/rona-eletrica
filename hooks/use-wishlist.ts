'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { RonaProduct } from '@/lib/supabase-fixed'

interface WishlistItem {
  id: string
  product_id: string
  created_at: string
  product: RonaProduct
}

interface UseWishlistReturn {
  items: WishlistItem[]
  loading: boolean
  error: string | null
  refetch: () => void
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

export function useWishlist(): UseWishlistReturn {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWishlist = async () => {
    if (status === 'loading') return
    
    if (!session?.user?.id) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/wishlist')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar lista de desejos')
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao adicionar à lista de desejos')
      }

      const newItem = await response.json()
      setItems(prev => [newItem, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?product_id=${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover da lista de desejos')
      }

      setItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      throw err
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  useEffect(() => {
    if (status === 'loading') return
    fetchWishlist()
  }, [session?.user?.id, status])

  return {
    items,
    loading,
    error,
    refetch: fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }
}
