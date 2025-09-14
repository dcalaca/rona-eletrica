import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { SettingsManagement } from '@/components/settings-management'

export default function AdminSettingsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie as configurações gerais do sistema e da loja
            </p>
          </div>

          <SettingsManagement />
        </main>
      </div>
    </div>
  )
}
