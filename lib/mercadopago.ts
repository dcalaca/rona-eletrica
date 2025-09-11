import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'abc'
  }
})

const preference = new Preference(client)
const payment = new Payment(client)

// Interface para criar preferência de pagamento
export interface CreatePreferenceData {
  items: Array<{
    id: string
    title: string
    description?: string
    quantity: number
    unit_price: number
    currency_id?: string
  }>
  payer?: {
    name?: string
    surname?: string
    email?: string
    phone?: {
      area_code?: string
      number?: string
    }
    identification?: {
      type?: string
      number?: string
    }
    address?: {
      street_name?: string
      street_number?: number
      zip_code?: string
    }
  }
  back_urls?: {
    success?: string
    failure?: string
    pending?: string
  }
  auto_return?: 'approved' | 'all'
  external_reference?: string
  notification_url?: string
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

// Criar preferência de pagamento
export async function createPreference(data: CreatePreferenceData) {
  try {
    const preferenceData = {
      items: data.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id || 'BRL'
      })),
      payer: data.payer,
      back_urls: data.back_urls || {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/erro`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/pendente`
      },
      auto_return: data.auto_return || 'approved',
      external_reference: data.external_reference,
      notification_url: data.notification_url || `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      expires: data.expires || true,
      expiration_date_from: data.expiration_date_from,
      expiration_date_to: data.expiration_date_to
    }

    const response = await preference.create({ body: preferenceData })
    return response
  } catch (error) {
    console.error('Erro ao criar preferência:', error)
    throw new Error('Erro ao criar preferência de pagamento')
  }
}

// Buscar pagamento por ID
export async function getPaymentById(paymentId: string) {
  try {
    const response = await payment.get({ id: paymentId })
    return response
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    throw new Error('Erro ao buscar pagamento')
  }
}

// Buscar pagamentos por external_reference (ID do pedido)
export async function getPaymentsByExternalReference(externalReference: string) {
  try {
    const response = await payment.search({
      filters: {
        external_reference: externalReference
      }
    })
    return response
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error)
    throw new Error('Erro ao buscar pagamentos')
  }
}

// Cancelar pagamento
export async function cancelPayment(paymentId: string) {
  try {
    const response = await payment.cancel({ id: paymentId })
    return response
  } catch (error) {
    console.error('Erro ao cancelar pagamento:', error)
    throw new Error('Erro ao cancelar pagamento')
  }
}

// Reembolsar pagamento
export async function refundPayment(paymentId: string, amount?: number) {
  try {
    const refundData = amount ? { amount } : {}
    const response = await payment.refund({ 
      id: paymentId, 
      body: refundData 
    })
    return response
  } catch (error) {
    console.error('Erro ao reembolsar pagamento:', error)
    throw new Error('Erro ao reembolsar pagamento')
  }
}

// Verificar status do pagamento
export function getPaymentStatus(status: string) {
  const statusMap: Record<string, string> = {
    'pending': 'Pendente',
    'approved': 'Aprovado',
    'authorized': 'Autorizado',
    'in_process': 'Em Processamento',
    'in_mediation': 'Em Mediação',
    'rejected': 'Rejeitado',
    'cancelled': 'Cancelado',
    'refunded': 'Reembolsado',
    'partially_refunded': 'Parcialmente Reembolsado',
    'charged_back': 'Estornado'
  }

  return statusMap[status] || 'Desconhecido'
}

// Verificar método de pagamento
export function getPaymentMethod(paymentMethodId: string) {
  const methodMap: Record<string, string> = {
    'pix': 'PIX',
    'credit_card': 'Cartão de Crédito',
    'debit_card': 'Cartão de Débito',
    'bank_transfer': 'Transferência Bancária',
    'ticket': 'Boleto',
    'account_money': 'Dinheiro na Conta',
    'digital_wallet': 'Carteira Digital'
  }

  return methodMap[paymentMethodId] || paymentMethodId
}

// Calcular parcelas
export function calculateInstallments(totalAmount: number, maxInstallments: number = 12) {
  const installments = []
  
  for (let i = 1; i <= maxInstallments; i++) {
    const installmentAmount = totalAmount / i
    const hasInterest = i > 1 // Assumindo que apenas a primeira parcela é sem juros
    
    installments.push({
      installments: i,
      installment_amount: Math.round(installmentAmount * 100) / 100,
      total_amount: totalAmount,
      has_interest: hasInterest,
      interest_rate: hasInterest ? 2.99 : 0 // Taxa de juros exemplo
    })
  }
  
  return installments
}
