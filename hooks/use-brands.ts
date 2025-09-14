'use client'

import { useState, useEffect } from 'react'

interface Brand {
  id: string
  name: string
  description?: string
  logo_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/brands')
        
        if (!response.ok) {
          throw new Error('Erro ao buscar marcas')
        }

        const data = await response.json()
        setBrands(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchBrands()
  }, [])

  return { brands, loading, error }
}
