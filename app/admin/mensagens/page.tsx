import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { MessageManagement } from '@/components/message-management'

export default function AdminMessagesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciar Mensagens</h1>
            <p className="text-muted-foreground">
              Central de mensagens, suporte ao cliente e comunicação
            </p>
          </div>

          <MessageManagement />
        </main>
      </div>
    </div>
  )
}
