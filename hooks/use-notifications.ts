import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export interface Notification {
  id: string
  type: 'order' | 'message' | 'system' | 'alert'
  title: string
  message: string
  is_read: boolean
  created_at: string
  data?: any
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const fetchNotifications = async () => {
    if (!session?.user?.email) {
      setNotifications([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/notifications')
      
      if (!response.ok) {
        throw new Error('Erro ao buscar notificações')
      }

      const data = await response.json()
      setNotifications(data)
    } catch (err) {
      console.error('Erro ao buscar notificações:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, is_read: true }
              : notif
          )
        )
      }
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        )
      }
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err)
    }
  }

  useEffect(() => {
    if (session?.user?.email) {
      fetchNotifications()
    }
  }, [session?.user?.email])

  const unreadCount = notifications.filter(notif => !notif.is_read).length

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}