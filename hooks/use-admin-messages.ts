import { useState, useEffect } from 'react'

export interface Message {
  id: string
  subject: string
  content: string
  category: 'support' | 'general' | 'complaint' | 'suggestion'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'unread' | 'read' | 'replied' | 'closed'
  user_id?: string
  assigned_to?: string
  notes?: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
    phone: string
  }
  replies?: MessageReply[]
  reply_count: number
}

export interface MessageReply {
  id: string
  message_id: string
  content: string
  user_id?: string
  is_internal: boolean
  created_at: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface MessageFilters {
  search?: string
  status?: string
  category?: string
  priority?: string
  page?: number
  limit?: number
}

export interface MessageStats {
  totalMessages: number
  unreadMessages: number
  readMessages: number
  repliedMessages: number
  closedMessages: number
  urgentMessages: number
  supportMessages: number
  averageResponseTime: number
}

export function useAdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<MessageStats | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Buscar mensagens
  const fetchMessages = async (filters: MessageFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.category) params.append('category', filters.category)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())

      const response = await fetch(`/api/admin/messages?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar mensagens')
      }

      const data = await response.json()
      setMessages(data.messages || [])
      setPagination(data.pagination || pagination)
      
      // Calcular estatísticas
      calculateStats(data.messages || [])
    } catch (err) {
      console.error('❌ [useAdminMessages] Erro ao buscar mensagens:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar mensagens')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estatísticas
  const calculateStats = (messagesData: Message[]) => {
    const totalMessages = messagesData.length
    const unreadMessages = messagesData.filter(m => m.status === 'unread').length
    const readMessages = messagesData.filter(m => m.status === 'read').length
    const repliedMessages = messagesData.filter(m => m.status === 'replied').length
    const closedMessages = messagesData.filter(m => m.status === 'closed').length
    const urgentMessages = messagesData.filter(m => m.priority === 'urgent').length
    const supportMessages = messagesData.filter(m => m.category === 'support').length

    setStats({
      totalMessages,
      unreadMessages,
      readMessages,
      repliedMessages,
      closedMessages,
      urgentMessages,
      supportMessages,
      averageResponseTime: 0 // Calculado baseado em timestamps reais
    })
  }

  // Atualizar status da mensagem
  const updateMessageStatus = async (id: string, status: string, priority?: string, assignedTo?: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, priority, assigned_to: assignedTo }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar mensagem')
      }

      // Atualizar lista local
      setMessages(prev => 
        prev.map(message => 
          message.id === id 
            ? { ...message, status: status as any, priority: priority as any, assigned_to: assignedTo, updated_at: new Date().toISOString() }
            : message
        )
      )

      return true
    } catch (err) {
      console.error('❌ [useAdminMessages] Erro ao atualizar mensagem:', err)
      setError(err instanceof Error ? err.message : 'Erro ao atualizar mensagem')
      return false
    }
  }

  // Criar resposta para mensagem
  const createReply = async (messageId: string, content: string, isInternal: boolean = false) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, is_internal: isInternal }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar resposta')
      }

      // Atualizar lista local
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { 
                ...message, 
                status: 'replied',
                reply_count: message.reply_count + 1,
                updated_at: new Date().toISOString() 
              }
            : message
        )
      )

      return true
    } catch (err) {
      console.error('❌ [useAdminMessages] Erro ao criar resposta:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar resposta')
      return false
    }
  }

  // Buscar detalhes de uma mensagem
  const getMessageDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes da mensagem')
      }

      const data = await response.json()
      return data.message
    } catch (err) {
      console.error('❌ [useAdminMessages] Erro ao buscar detalhes:', err)
      setError(err instanceof Error ? err.message : 'Erro ao buscar detalhes')
      return null
    }
  }

  // Deletar mensagem
  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar mensagem')
      }

      // Remover da lista local
      setMessages(prev => prev.filter(message => message.id !== id))
      return true
    } catch (err) {
      console.error('❌ [useAdminMessages] Erro ao deletar mensagem:', err)
      setError(err instanceof Error ? err.message : 'Erro ao deletar mensagem')
      return false
    }
  }

  // Marcar como lida
  const markAsRead = async (id: string) => {
    return await updateMessageStatus(id, 'read')
  }

  // Fechar mensagem
  const closeMessage = async (id: string) => {
    return await updateMessageStatus(id, 'closed')
  }

  // Buscar mensagens na montagem
  useEffect(() => {
    fetchMessages()
  }, [])

  return {
    messages,
    loading,
    error,
    stats,
    pagination,
    fetchMessages,
    updateMessageStatus,
    createReply,
    getMessageDetails,
    deleteMessage,
    markAsRead,
    closeMessage
  }
}