"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Trash2, Settings, Loader2, Mail, Smartphone, Shield, ShoppingBag, Gift, Newspaper } from "lucide-react"
import { useNotifications, Notification, NotificationSettings } from "@/hooks/use-notifications"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export function NotificationManagement() {
  const { 
    notifications, 
    settings, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    updateSettings,
    getNotificationTypeInfo,
    getUnreadCount
  } = useNotifications()
  
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteNotification(id)
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleSettingChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      await updateSettings({ [key]: value })
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Carregando notificações...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Erro ao carregar notificações</h3>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const unreadCount = getUnreadCount()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notificações</h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} notificação${unreadCount === 1 ? '' : 'ões'} não lida${unreadCount === 1 ? '' : 's'}`
              : "Todas as notificações foram lidas"
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
        )}
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </TabsTrigger>
        </TabsList>

        {/* Notificações Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma notificação</h3>
                <p className="text-muted-foreground">
                  Você não tem notificações no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const typeInfo = getNotificationTypeInfo(notification.type)
                return (
                  <Card key={notification.id} className={`${!notification.is_read ? 'border-l-4 border-l-primary' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${typeInfo.bgColor}`}>
                            <Bell className={`h-4 w-4 ${typeInfo.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-lg">{notification.title}</CardTitle>
                              {!notification.is_read && (
                                <Badge variant="secondary">Nova</Badge>
                              )}
                              <Badge variant="outline" className={typeInfo.color}>
                                {typeInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(notification.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deletingId === notification.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  ) : (
                                    <Trash2 className="h-4 w-4 mr-2" />
                                  )}
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Configurações Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <p className="text-sm text-muted-foreground">
                Escolha como você deseja receber notificações
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings && (
                <>
                  {/* Canais de Notificação */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Canais de Notificação</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">Receber notificações por email</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.email_notifications}
                          onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">SMS</p>
                            <p className="text-sm text-muted-foreground">Receber notificações por SMS</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.sms_notifications}
                          onCheckedChange={(checked) => handleSettingChange('sms_notifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Push</p>
                            <p className="text-sm text-muted-foreground">Receber notificações push no navegador</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.push_notifications}
                          onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipos de Notificação */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Tipos de Notificação</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Atualizações de Pedidos</p>
                            <p className="text-sm text-muted-foreground">Status de pedidos e entregas</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.order_updates}
                          onCheckedChange={(checked) => handleSettingChange('order_updates', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Gift className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Promoções</p>
                            <p className="text-sm text-muted-foreground">Ofertas especiais e descontos</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.promotions}
                          onCheckedChange={(checked) => handleSettingChange('promotions', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Alertas de Segurança</p>
                            <p className="text-sm text-muted-foreground">Atividades suspeitas na conta</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.security_alerts}
                          onCheckedChange={(checked) => handleSettingChange('security_alerts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Newspaper className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-muted-foreground">Novidades e dicas da loja</p>
                          </div>
                        </div>
                        <Switch
                          checked={settings.newsletter}
                          onCheckedChange={(checked) => handleSettingChange('newsletter', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
