"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useCart, CartItem } from '@/hooks/use-cart'

interface CartContextType {
  items: CartItem[]
  loading: boolean
  error: string | null
  addToCart: (product_id: string, quantity?: number) => Promise<void>
  updateQuantity: (item_id: string, quantity: number) => Promise<void>
  removeFromCart: (item_id: string) => Promise<void>
  clearCart: () => Promise<void>
  formatPrice: (price: number) => string
  getTotalItems: () => number
  getSubtotal: () => number
  getShipping: () => number
  getTotal: () => number
  isCartEmpty: () => boolean
  refetch: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart()

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
}
