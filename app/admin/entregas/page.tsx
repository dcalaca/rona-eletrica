import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { DeliveryManagement } from "@/components/delivery-management"

export default function AdminDeliveriesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciar Entregas</h1>
            <p className="text-muted-foreground">Acompanhe e gerencie entregas e logística</p>
          </div>

          <DeliveryManagement />
        </main>
      </div>
    </div>
  )
}
