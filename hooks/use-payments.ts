import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface PaymentMethod {
  id: string
  user_id: string
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto'
  card_number: string
  card_holder_name: string
  expiry_month: number
  expiry_year: number
  cvv: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreatePaymentData {
  type: 'credit_card' | 'debit_card' | 'pix' | 'boleto'
  card_number: string
  card_holder_name: string
  expiry_month: number
  expiry_year: number
  cvv: string
  is_default?: boolean
}

export function usePayments() {
  const [payments, setPayments] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const fetchPayments = async () => {
    if (status === 'loading') return
    
    if (!session) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar métodos de pagamento')
      }

      const data = await response.json()
      setPayments(data)
    } catch (err) {
      console.error('Erro ao buscar métodos de pagamento:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async (paymentData: CreatePaymentData) => {
    try {
      setError(null)

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao criar método de pagamento')
      }

      const newPayment = await response.json()
      setPayments(prev => [newPayment, ...prev])
      return newPayment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updatePayment = async (id: string, paymentData: CreatePaymentData) => {
    try {
      setError(null)

      const response = await fetch(`/api/payments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao atualizar método de pagamento')
      }

      const updatedPayment = await response.json()
      setPayments(prev => 
        prev.map(payment => payment.id === id ? updatedPayment : payment)
      )
      return updatedPayment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const deletePayment = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/payments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao deletar método de pagamento')
      }

      setPayments(prev => prev.filter(payment => payment.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const setDefaultPayment = async (id: string) => {
    const payment = payments.find(p => p.id === id)
    if (!payment) return

    try {
      await updatePayment(id, {
        ...payment,
        is_default: true
      })
    } catch (err) {
      console.error('Erro ao definir método de pagamento padrão:', err)
    }
  }

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    if (cleaned.length <= 4) return cleaned
    return '**** **** **** ' + cleaned.slice(-4)
  }

  const getCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    
    if (/^4/.test(cleaned)) return 'Visa'
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard'
    if (/^3[47]/.test(cleaned)) return 'American Express'
    if (/^6/.test(cleaned)) return 'Discover'
    
    return 'Cartão'
  }

  const getPaymentTypeLabel = (type: string) => {
    switch (type) {
      case 'credit_card': return 'Cartão de Crédito'
      case 'debit_card': return 'Cartão de Débito'
      case 'pix': return 'PIX'
      case 'boleto': return 'Boleto'
      default: return type
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [session, status])

  const refetch = () => {
    fetchPayments()
  }

  return {
    payments,
    loading,
    error,
    createPayment,
    updatePayment,
    deletePayment,
    setDefaultPayment,
    maskCardNumber,
    getCardType,
    getPaymentTypeLabel,
    refetch
  }
}
