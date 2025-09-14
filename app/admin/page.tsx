import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do sistema e métricas principais</p>
      </div>

      <AdminDashboard />
    </>
  )
}
