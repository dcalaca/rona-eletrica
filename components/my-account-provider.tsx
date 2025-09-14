'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { useUser } from '@/hooks/use-user'
import { useWishlist } from '@/hooks/use-wishlist'
import { RonaUser, RonaAddress } from '@/lib/supabase-fixed'

interface MyAccountContextType {
  user: RonaUser | null
  addresses: RonaAddress[]
  wishlist: any[]
  loading: boolean
  error: string | null
  refetch: () => void
  updateUser: (data: Partial<RonaUser>) => Promise<void>
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
}

const MyAccountContext = createContext<MyAccountContextType | undefined>(undefined)

export function MyAccountProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const { user, addresses, loading: userLoading, error: userError, refetch: refetchUser, updateUser } = useUser()
  const { items: wishlist, loading: wishlistLoading, error: wishlistError, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const loading = userLoading || wishlistLoading
  const error = userError || wishlistError

  const refetch = () => {
    refetchUser()
  }

  const value: MyAccountContextType = {
    user,
    addresses,
    wishlist,
    loading,
    error,
    refetch,
    updateUser,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }

  return (
    <MyAccountContext.Provider value={value}>
      {children}
    </MyAccountContext.Provider>
  )
}

export function useMyAccount() {
  const context = useContext(MyAccountContext)
  if (context === undefined) {
    throw new Error('useMyAccount must be used within a MyAccountProvider')
  }
  return context
}
