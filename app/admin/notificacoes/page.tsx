"use client"

import { useNotifications } from "@/hooks/use-notifications"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check, CheckCheck, AlertCircle, ShoppingCart, MessageSquare, Package } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useRouter } from "next/navigation"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingCart className="h-4 w-4 text-blue-500" />
    case 'message':
      return <MessageSquare className="h-4 w-4 text-green-500" />
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-red-500" />
    case 'system':
      return <Package className="h-4 w-4 text-purple-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'order':
      return 'border-l-blue-500 bg-blue-50'
    case 'message':
      return 'border-l-green-500 bg-green-50'
    case 'alert':
      return 'border-l-red-500 bg-red-50'
    case 'system':
      return 'border-l-purple-500 bg-purple-50'
    default:
      return 'border-l-gray-500 bg-gray-50'
  }
}

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()
  const router = useRouter()

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleNotificationClick = (notification: any) => {
    // Marcar como lida
    markAsRead(notification.id)
    
    // Navegar baseado no tipo
    switch (notification.type) {
      case 'order':
        router.push('/admin/pedidos')
        break
      case 'alert':
        if (notification.data?.product_id) {
          router.push('/admin/produtos')
        } else if (notification.data?.order_id) {
          router.push('/admin/pedidos')
        }
        break
      case 'message':
        router.push('/admin/pedidos')
        break
      default:
        // Já está na página de notificações
        break
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notificações</h1>
            <p className="text-muted-foreground">Central de notificações do sistema</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">Central de notificações do sistema</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
              <p className="text-muted-foreground">
                Você está em dia! Não há notificações no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.is_read ? 'ring-2 ring-blue-200' : ''
              } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-sm">{notification.title}</h3>
                        {!notification.is_read && (
                          <Badge variant="secondary" className="text-xs">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                      className="ml-2"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
