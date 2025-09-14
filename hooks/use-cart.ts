import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
  total: number
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const fetchCart = async () => {
    if (status === 'loading') {
      return
    }
    
    if (!session) {
      setItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/cart')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar carrinho')
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      console.error('Erro ao buscar carrinho:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product_id: string, quantity: number = 1) => {
    try {
      setError(null)

      // Verificar se o usuário está logado
      if (!session) {
        throw new Error('Você precisa fazer login para adicionar produtos ao carrinho')
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao adicionar ao carrinho')
      }

      // Recarregar carrinho imediatamente após adicionar
      await fetchCart()
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateQuantity = async (item_id: string, quantity: number) => {
    try {
      setError(null)

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item_id, quantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar carrinho')
      }

      // Recarregar carrinho após atualizar
      await fetchCart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const removeFromCart = async (item_id: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/cart?item_id=${item_id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao remover do carrinho')
      }

      // Recarregar carrinho após remover
      await fetchCart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      throw new Error(errorMessage)
    }
  }

  const clearCart = async () => {
    try {
      setError(null)

      // Remover todos os itens do carrinho
      const deletePromises = items.map(item => 
        fetch(`/api/cart?item_id=${item.id}`, {
          method: 'DELETE',
        })
      )

      await Promise.all(deletePromises)
      setItems([])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const getShipping = () => {
    const subtotal = getSubtotal()
    return subtotal >= 200 ? 0 : 15.9
  }

  const getTotal = () => {
    return getSubtotal() + getShipping()
  }

  const isCartEmpty = () => {
    return items.length === 0
  }

  useEffect(() => {
    fetchCart()
  }, [session, status])

  const refetch = () => {
    fetchCart()
  }

  return {
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    getTotalItems,
    getSubtotal,
    getShipping,
    getTotal,
    isCartEmpty,
    refetch
  }
}
