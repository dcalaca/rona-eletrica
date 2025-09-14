import { useState, useEffect } from 'react'

export interface Payment {
  id: string
  order_id: string
  transaction_id: string
  payment_method: 'credit_card' | 'pix' | 'boleto' | 'debit_card'
  amount: number
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  gateway: string
  gateway_transaction_id?: string
  notes?: string
  refund_amount?: number
  refund_reason?: string
  created_at: string
  updated_at: string
  order?: {
    id: string
    order_number: string
    total_amount: number
    status: string
    created_at: string
  }
  customer?: {
    id: string
    name: string
    email: string
    phone: string
  }
}

export interface PaymentFilters {
  search?: string
  status?: string
  method?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface PaymentStats {
  totalPayments: number
  totalAmount: number
  pendingPayments: number
  paidPayments: number
  failedPayments: number
  refundedPayments: number
  averageAmount: number
  successRate: number
}

export function useAdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Buscar pagamentos
  const fetchPayments = async (filters: PaymentFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.method) params.append('method', filters.method)
      if (filters.dateFrom) params.append('date_from', filters.dateFrom)
      if (filters.dateTo) params.append('date_to', filters.dateTo)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/admin/payments?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar pagamentos')
      }

      const data = await response.json()
      setPayments(data.payments || [])
      setPagination(data.pagination || pagination)
      
      // Calcular estatísticas
      calculateStats(data.payments || [])
    } catch (err) {
      console.error('❌ [useAdminPayments] Erro ao buscar pagamentos:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar pagamentos')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const calculateStats = (paymentsData: Payment[]) => {
    const totalPayments = paymentsData.length
    const totalAmount = paymentsData.reduce((sum, payment) => sum + payment.amount, 0)
    const pendingPayments = paymentsData.filter(p => p.status === 'pending').length
    const paidPayments = paymentsData.filter(p => p.status === 'paid').length
    const failedPayments = paymentsData.filter(p => p.status === 'failed').length
    const refundedPayments = paymentsData.filter(p => p.status === 'refunded').length
    const averageAmount = totalPayments > 0 ? totalAmount / totalPayments : 0
    const successRate = totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0

    setStats({
      totalPayments,
      totalAmount,
      pendingPayments,
      paidPayments,
      failedPayments,
      refundedPayments,
      averageAmount,
      successRate
    })
  }

  // Atualizar status do pagamento
  const updatePaymentStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar pagamento')
      }

      // Atualizar lista local
      setPayments(prev => 
        prev.map(payment => 
          payment.id === id 
            ? { ...payment, status: status as any, notes, updated_at: new Date().toISOString() }
            : payment
        )
      )

      return true
    } catch (err) {
      console.error('❌ [useAdminPayments] Erro ao atualizar pagamento:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pagamento')
      return false
    }
  }

  // Processar reembolso
  const processRefund = async (id: string, refundAmount: number, refundReason: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'refunded', 
          refund_amount: refundAmount,
          refund_reason: refundReason 
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao processar reembolso')
      }

      // Atualizar lista local
      setPayments(prev => 
        prev.map(payment => 
          payment.id === id 
            ? { 
                ...payment, 
                status: 'refunded', 
                refund_amount: refundAmount,
                refund_reason: refundReason,
                updated_at: new Date().toISOString() 
              }
            : payment
        )
      )

      return true
    } catch (err) {
      console.error('❌ [useAdminPayments] Erro ao processar reembolso:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar reembolso')
      return false
    }
  }

  // Buscar detalhes de um pagamento
  const getPaymentDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes do pagamento')
      }

      const data = await response.json()
      return data.payment
    } catch (err) {
      console.error('❌ [useAdminPayments] Erro ao buscar detalhes:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar detalhes')
      return null
    }
  }

  // Deletar pagamento
  const deletePayment = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar pagamento')
      }

      // Remover da lista local
      setPayments(prev => prev.filter(payment => payment.id !== id))
      return true
    } catch (err) {
      console.error('❌ [useAdminPayments] Erro ao deletar pagamento:', err)
      setError(err instanceof Error ? err.message : 'Erro ao deletar pagamento')
      return false
    }
  }

  // Buscar pagamentos na montagem
  useEffect(() => {
    fetchPayments()
  }, [])

  return {
    payments,
    loading,
    error,
    stats,
    pagination,
    fetchPayments,
    updatePaymentStatus,
    processRefund,
    getPaymentDetails,
    deletePayment
  }
}
