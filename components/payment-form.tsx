"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CreditCard } from "lucide-react"
import { usePayments, PaymentMethod, CreatePaymentData } from "@/hooks/use-payments"

interface PaymentFormProps {
  isOpen: boolean
  onClose: () => void
  payment?: PaymentMethod | null
}

export function PaymentForm({ isOpen, onClose, payment }: PaymentFormProps) {
  const { createPayment, updatePayment } = usePayments()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePaymentData>({
    type: 'credit_card',
    card_number: '',
    card_holder_name: '',
    expiry_month: 1,
    expiry_year: new Date().getFullYear(),
    cvv: '',
    is_default: false
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  useEffect(() => {
    if (payment) {
      setFormData({
        type: payment.type,
        card_number: payment.card_number,
        card_holder_name: payment.card_holder_name,
        expiry_month: payment.expiry_month,
        expiry_year: payment.expiry_year,
        cvv: payment.cvv,
        is_default: payment.is_default
      })
    } else {
      setFormData({
        type: 'credit_card',
        card_number: '',
        card_holder_name: '',
        expiry_month: 1,
        expiry_year: currentYear,
        cvv: '',
        is_default: false
      })
    }
  }, [payment, isOpen, currentYear])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.card_number || !formData.card_holder_name || !formData.cvv) {
      return
    }

    try {
      setLoading(true)
      
      if (payment) {
        await updatePayment(payment.id, formData)
      } else {
        await createPayment(formData)
      }
      
      onClose()
    } catch (error) {
      console.error('Erro ao salvar método de pagamento:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreatePaymentData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCardNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    
    // Aplica a máscara 0000 0000 0000 0000
    const groups = numbers.match(/.{1,4}/g) || []
    return groups.join(' ').slice(0, 19) // Máximo 16 dígitos + 3 espaços
  }

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value)
    handleInputChange('card_number', formatted)
  }

  const formatCVV = (value: string) => {
    // Remove tudo que não é número e limita a 3 dígitos
    return value.replace(/\D/g, '').slice(0, 3)
  }

  const handleCVVChange = (value: string) => {
    const formatted = formatCVV(value)
    handleInputChange('cvv', formatted)
  }

  const getCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    
    if (/^4/.test(cleaned)) return 'Visa'
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard'
    if (/^3[47]/.test(cleaned)) return 'American Express'
    if (/^6/.test(cleaned)) return 'Discover'
    
    return 'Cartão'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {payment ? 'Editar Método de Pagamento' : 'Adicionar Método de Pagamento'}
          </DialogTitle>
          <DialogDescription>
            {payment 
              ? 'Atualize as informações do seu método de pagamento' 
              : 'Adicione um novo método de pagamento'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Pagamento *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Número do Cartão */}
          <div className="space-y-2">
            <Label htmlFor="card_number">Número do Cartão *</Label>
            <div className="relative">
              <Input
                id="card_number"
                value={formData.card_number}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                required
              />
              {formData.card_number && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            {formData.card_number && (
              <p className="text-xs text-muted-foreground">
                {getCardType(formData.card_number)}
              </p>
            )}
          </div>

          {/* Nome do Portador */}
          <div className="space-y-2">
            <Label htmlFor="card_holder_name">Nome do Portador *</Label>
            <Input
              id="card_holder_name"
              value={formData.card_holder_name}
              onChange={(e) => handleInputChange('card_holder_name', e.target.value.toUpperCase())}
              placeholder="NOME COMO NO CARTÃO"
              required
            />
          </div>

          {/* Validade e CVV */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry_month">Mês *</Label>
              <Select
                value={formData.expiry_month.toString()}
                onValueChange={(value) => handleInputChange('expiry_month', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_year">Ano *</Label>
              <Select
                value={formData.expiry_year.toString()}
                onValueChange={(value) => handleInputChange('expiry_year', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleCVVChange(e.target.value)}
                placeholder="000"
                maxLength={3}
                required
              />
            </div>
          </div>

          {/* Método Padrão */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => handleInputChange('is_default', checked as boolean)}
            />
            <Label htmlFor="is_default" className="text-sm">
              Definir como método de pagamento padrão
            </Label>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {payment ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
