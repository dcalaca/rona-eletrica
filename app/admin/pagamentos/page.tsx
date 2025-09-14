import { PaymentManagement } from '@/components/payment-management'

export default function AdminPaymentsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Pagamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie pagamentos, transações e relatórios financeiros
        </p>
      </div>
      <PaymentManagement />
    </>
  )
}
