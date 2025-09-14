import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { PaymentManagement } from '@/components/payment-management'

export default function AdminPaymentsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciar Pagamentos</h1>
            <p className="text-muted-foreground">
              Acompanhe e gerencie pagamentos, transações e relatórios financeiros
            </p>
          </div>

          <PaymentManagement />
        </main>
      </div>
    </div>
  )
}
