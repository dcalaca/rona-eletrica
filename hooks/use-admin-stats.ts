'use client'

import { useState, useEffect } from 'react'

interface AdminStats {
  totalOrders: number
  pendingOrders: number
  totalCustomers: number
  totalProducts: number
  lowStockProducts: number
  pendingDeliveries: number
  unreadMessages: number
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pendingDeliveries: 0,
    unreadMessages: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Buscar apenas estatísticas básicas para não sobrecarregar
      const [ordersRes, customersRes] = await Promise.all([
        fetch('/api/admin/orders?limit=1'),
        fetch('/api/admin/customers?limit=1')
      ])

      const ordersData = await ordersRes.json()
      const customersData = await customersRes.json()

      // Calcular estatísticas básicas
      const totalOrders = ordersData.pagination?.total || 0
      const pendingOrders = ordersData.orders?.filter((order: any) => 
        order.status === 'pending' || order.status === 'processing'
      ).length || 0

      const totalCustomers = customersData.pagination?.total || 0

      setStats({
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts: 0, // Simplificado por enquanto
        lowStockProducts: 0, // Simplificado por enquanto
        pendingDeliveries: 0, // Simplificado por enquanto
        unreadMessages: 0,
      })

    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Atualizar estatísticas a cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return {
    stats,
    loading,
    refetch: fetchStats
  }
}
