import { AdminProtection } from '@/components/admin-protection'
import { AdminHeader } from '@/components/admin-header'
import { AdminSidebar } from '@/components/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-muted/30">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminProtection>
  )
}
