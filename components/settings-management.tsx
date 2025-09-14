'use client'

import { useState } from 'react'
import { useAdminSettings, AdminSettings } from '@/hooks/use-admin-settings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Store, 
  Settings, 
  CreditCard, 
  Truck, 
  Bell, 
  Search, 
  Share2,
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function SettingsManagement() {
  const {
    settings,
    loading,
    error,
    saving,
    saveSettings
  } = useAdminSettings()

  const [activeTab, setActiveTab] = useState('store')
  const [hasChanges, setHasChanges] = useState(false)

  // Salvar configurações
  const handleSave = async (section: keyof AdminSettings, data: any) => {
    const result = await saveSettings(section, data)
    if (result) {
      toast({
        title: "Configurações salvas",
        description: `Configurações de ${section} foram salvas com sucesso.`,
      })
      setHasChanges(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!settings) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Não foi possível carregar as configurações.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="store" className="flex items-center space-x-2">
            <Store className="h-4 w-4" />
            <span>Loja</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Pagamento</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Entrega</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* Configurações da Loja */}
        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Loja</CardTitle>
              <CardDescription>
                Configure as informações básicas da sua loja
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-name">Nome da Loja</Label>
                  <Input
                    id="store-name"
                    value={settings.store.name}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        store: { ...settings.store, name: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="store-cnpj">CNPJ</Label>
                  <Input
                    id="store-cnpj"
                    value={settings.store.cnpj}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        store: { ...settings.store, cnpj: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="store-description">Descrição</Label>
                <Textarea
                  id="store-description"
                  value={settings.store.description}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      store: { ...settings.store, description: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-phone">Telefone</Label>
                  <Input
                    id="store-phone"
                    value={settings.store.contact.phone}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        store: { 
                          ...settings.store, 
                          contact: { ...settings.store.contact, phone: e.target.value }
                        }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="store-whatsapp">WhatsApp</Label>
                  <Input
                    id="store-whatsapp"
                    value={settings.store.contact.whatsapp}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        store: { 
                          ...settings.store, 
                          contact: { ...settings.store.contact, whatsapp: e.target.value }
                        }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="store-email">E-mail</Label>
                <Input
                  id="store-email"
                  type="email"
                  value={settings.store.contact.email}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      store: { 
                        ...settings.store, 
                        contact: { ...settings.store.contact, email: e.target.value }
                      }
                    })
                    setHasChanges(true)
                  }}
                />
              </div>

              <div>
                <Label htmlFor="store-address">Endereço</Label>
                <Textarea
                  id="store-address"
                  value={settings.store.contact.address}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      store: { 
                        ...settings.store, 
                        contact: { ...settings.store.contact, address: e.target.value }
                      }
                    })
                    setHasChanges(true)
                  }}
                />
              </div>

              <Button 
                onClick={() => handleSave('store', settings.store)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações da Loja'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações do Sistema */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configure as configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="system-currency">Moeda</Label>
                  <Select
                    value={settings.system.currency}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        system: { ...settings.system, currency: value }
                      })
                      setHasChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="system-timezone">Fuso Horário</Label>
                  <Select
                    value={settings.system.timezone}
                    onValueChange={(value) => {
                      setSettings({
                        ...settings,
                        system: { ...settings.system, timezone: value }
                      })
                      setHasChanges(true)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo</SelectItem>
                      <SelectItem value="America/New_York">Nova York</SelectItem>
                      <SelectItem value="Europe/London">Londres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">
                      Ative para colocar o site em manutenção
                    </p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={settings.system.maintenance_mode}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        system: { ...settings.system, maintenance_mode: checked }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration-enabled">Cadastro Habilitado</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite que novos usuários se cadastrem
                    </p>
                  </div>
                  <Switch
                    id="registration-enabled"
                    checked={settings.system.registration_enabled}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        system: { ...settings.system, registration_enabled: checked }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="guest-checkout">Compra como Visitante</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite compras sem cadastro
                    </p>
                  </div>
                  <Switch
                    id="guest-checkout"
                    checked={settings.system.guest_checkout}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        system: { ...settings.system, guest_checkout: checked }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSave('system', settings.system)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações do Sistema'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Pagamento */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
              <CardDescription>
                Configure os métodos de pagamento disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Métodos de Pagamento</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['credit_card', 'pix', 'boleto', 'debit_card'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Switch
                        checked={settings.payment.methods.includes(method)}
                        onCheckedChange={(checked) => {
                          const newMethods = checked
                            ? [...settings.payment.methods, method]
                            : settings.payment.methods.filter(m => m !== method)
                          setSettings({
                            ...settings,
                            payment: { ...settings.payment, methods: newMethods }
                          })
                          setHasChanges(true)
                        }}
                      />
                      <Label className="capitalize">
                        {method === 'credit_card' ? 'Cartão de Crédito' :
                         method === 'pix' ? 'PIX' :
                         method === 'boleto' ? 'Boleto' :
                         method === 'debit_card' ? 'Cartão de Débito' : method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pix-discount">Desconto PIX (%)</Label>
                  <Input
                    id="pix-discount"
                    type="number"
                    value={settings.payment.pix_discount}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, pix_discount: Number(e.target.value) }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="boleto-discount">Desconto Boleto (%)</Label>
                  <Input
                    id="boleto-discount"
                    type="number"
                    value={settings.payment.boleto_discount}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, boleto_discount: Number(e.target.value) }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="installments-enabled">Parcelamento Habilitado</Label>
                    <p className="text-sm text-muted-foreground">
                      Permite parcelamento no cartão de crédito
                    </p>
                  </div>
                  <Switch
                    id="installments-enabled"
                    checked={settings.payment.installments.enabled}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        payment: { 
                          ...settings.payment, 
                          installments: { ...settings.payment.installments, enabled: checked }
                        }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>

                {settings.payment.installments.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-installments">Máximo de Parcelas</Label>
                      <Input
                        id="max-installments"
                        type="number"
                        value={settings.payment.installments.max_installments}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            payment: { 
                              ...settings.payment, 
                              installments: { 
                                ...settings.payment.installments, 
                                max_installments: Number(e.target.value) 
                              }
                            }
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="min-installment-value">Valor Mínimo por Parcela</Label>
                      <Input
                        id="min-installment-value"
                        type="number"
                        value={settings.payment.installments.min_installment_value}
                        onChange={(e) => {
                          setSettings({
                            ...settings,
                            payment: { 
                              ...settings.payment, 
                              installments: { 
                                ...settings.payment.installments, 
                                min_installment_value: Number(e.target.value) 
                              }
                            }
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => handleSave('payment', settings.payment)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações de Pagamento'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Entrega */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Entrega</CardTitle>
              <CardDescription>
                Configure as opções de entrega e frete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="free-shipping-minimum">Valor Mínimo para Frete Grátis</Label>
                  <Input
                    id="free-shipping-minimum"
                    type="number"
                    value={settings.shipping.free_shipping_minimum}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, free_shipping_minimum: Number(e.target.value) }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="default-shipping-cost">Custo Padrão de Frete</Label>
                  <Input
                    id="default-shipping-cost"
                    type="number"
                    value={settings.shipping.default_shipping_cost}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        shipping: { ...settings.shipping, default_shipping_cost: Number(e.target.value) }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <div>
                <Label>Zonas de Entrega</Label>
                <div className="space-y-2 mt-2">
                  {settings.shipping.shipping_zones.map((zone, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                      <div className="flex-1">
                        <Input
                          value={zone.name}
                          onChange={(e) => {
                            const newZones = [...settings.shipping.shipping_zones]
                            newZones[index] = { ...zone, name: e.target.value }
                            setSettings({
                              ...settings,
                              shipping: { ...settings.shipping, shipping_zones: newZones }
                            })
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={zone.cost}
                          onChange={(e) => {
                            const newZones = [...settings.shipping.shipping_zones]
                            newZones[index] = { ...zone, cost: Number(e.target.value) }
                            setSettings({
                              ...settings,
                              shipping: { ...settings.shipping, shipping_zones: newZones }
                            })
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          value={zone.delivery_time}
                          onChange={(e) => {
                            const newZones = [...settings.shipping.shipping_zones]
                            newZones[index] = { ...zone, delivery_time: e.target.value }
                            setSettings({
                              ...settings,
                              shipping: { ...settings.shipping, shipping_zones: newZones }
                            })
                            setHasChanges(true)
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleSave('shipping', settings.shipping)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações de Entrega'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Configure quais notificações enviar para clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notificações por E-mail</h4>
                <div className="space-y-3">
                  {Object.entries(settings.notifications.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">
                        {key.replace('_', ' ')}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => {
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              email: { ...settings.notifications.email, [key]: checked }
                            }
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Notificações por SMS</h4>
                <div className="space-y-3">
                  {Object.entries(settings.notifications.sms).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">
                        {key.replace('_', ' ')}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => {
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              sms: { ...settings.notifications.sms, [key]: checked }
                            }
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Notificações por WhatsApp</h4>
                <div className="space-y-3">
                  {Object.entries(settings.notifications.whatsapp).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <Label className="capitalize">
                        {key.replace('_', ' ')}
                      </Label>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => {
                          setSettings({
                            ...settings,
                            notifications: {
                              ...settings.notifications,
                              whatsapp: { ...settings.notifications.whatsapp, [key]: checked }
                            }
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleSave('notifications', settings.notifications)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações de Notificações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de SEO */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de SEO</CardTitle>
              <CardDescription>
                Configure as meta tags e otimizações para busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Título da Página</Label>
                <Input
                  id="meta-title"
                  value={settings.seo.meta_title}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, meta_title: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                />
              </div>

              <div>
                <Label htmlFor="meta-description">Descrição da Página</Label>
                <Textarea
                  id="meta-description"
                  value={settings.seo.meta_description}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, meta_description: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                />
              </div>

              <div>
                <Label htmlFor="meta-keywords">Palavras-chave</Label>
                <Input
                  id="meta-keywords"
                  value={settings.seo.meta_keywords}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      seo: { ...settings.seo, meta_keywords: e.target.value }
                    })
                    setHasChanges(true)
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="og-image">Imagem Open Graph</Label>
                  <Input
                    id="og-image"
                    value={settings.seo.og_image}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, og_image: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="favicon">Favicon</Label>
                  <Input
                    id="favicon"
                    value={settings.seo.favicon}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        seo: { ...settings.seo, favicon: e.target.value }
                      })
                      setHasChanges(true)
                    }}
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSave('seo', settings.seo)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações de SEO'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Indicador de mudanças */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você tem alterações não salvas. Lembre-se de salvar as configurações.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}