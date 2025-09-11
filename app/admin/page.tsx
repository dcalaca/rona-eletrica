import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminHeader } from "@/components/admin-header"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
            <p className="text-muted-foreground">Visão geral do sistema e métricas principais</p>
          </div>

          <AdminDashboard />
        </main>
      </div>
    </div>
  )
}
