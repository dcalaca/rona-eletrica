import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { OrderManagement } from "@/components/order-management"

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciar Pedidos</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie todos os pedidos da loja</p>
          </div>

          <OrderManagement />
        </main>
      </div>
    </div>
  )
}
