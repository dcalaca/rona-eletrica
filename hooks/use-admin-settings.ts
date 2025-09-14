import { useState, useEffect } from 'react'

export interface StoreSettings {
  name: string
  cnpj: string
  foundation_date: string
  description: string
  services: string[]
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  contact: {
    phone: string
    whatsapp: string
    email: string
    address: string
  }
}

export interface SystemSettings {
  currency: string
  timezone: string
  language: string
  maintenance_mode: boolean
  registration_enabled: boolean
  guest_checkout: boolean
}

export interface PaymentSettings {
  methods: string[]
  default_method: string
  installments: {
    enabled: boolean
    max_installments: number
    min_installment_value: number
  }
  pix_discount: number
  boleto_discount: number
}

export interface ShippingSettings {
  free_shipping_minimum: number
  default_shipping_cost: number
  shipping_zones: Array<{
    name: string
    cost: number
    delivery_time: string
  }>
}

export interface NotificationSettings {
  email: {
    order_confirmation: boolean
    order_shipped: boolean
    order_delivered: boolean
    order_cancelled: boolean
    low_stock: boolean
    new_customer: boolean
  }
  sms: {
    order_confirmation: boolean
    order_shipped: boolean
    order_delivered: boolean
  }
  whatsapp: {
    order_confirmation: boolean
    order_shipped: boolean
    order_delivered: boolean
    customer_support: boolean
  }
}

export interface SEOSettings {
  meta_title: string
  meta_description: string
  meta_keywords: string
  og_image: string
  favicon: string
}

export interface SocialSettings {
  facebook: string
  instagram: string
  linkedin: string
  youtube: string
}

export interface AdminSettings {
  store: StoreSettings
  system: SystemSettings
  payment: PaymentSettings
  shipping: ShippingSettings
  notifications: NotificationSettings
  seo: SEOSettings
  social: SocialSettings
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Carregar configurações
  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/settings')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar configurações')
      }

      const data = await response.json()
      setSettings(data.settings)
      
      return data.settings
    } catch (err) {
      console.error('❌ [useAdminSettings] Erro ao carregar configurações:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Salvar configurações
  const saveSettings = async (section: keyof AdminSettings, data: any) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data }),
      })
      
      if (!response.ok) {
        throw new Error('Erro ao salvar configurações')
      }

      const result = await response.json()
      
      // Atualizar estado local
      if (settings) {
        setSettings({
          ...settings,
          [section]: data
        })
      }
      
      return result
    } catch (err) {
      console.error('❌ [useAdminSettings] Erro ao salvar configurações:', err)
      setError(err instanceof Error ? err.message : 'Erro ao salvar configurações')
      return null
    } finally {
      setSaving(false)
    }
  }

  // Carregar configurações na montagem
  useEffect(() => {
    loadSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    saving,
    loadSettings,
    saveSettings
  }
}
