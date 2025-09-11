import { VendorSidebar } from "@/components/vendor-sidebar"
import { VendorHeader } from "@/components/vendor-header"
import { CustomerManagement } from "@/components/customer-management"

export default function VendorCustomersPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <VendorHeader />

      <div className="flex">
        <VendorSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Meus Clientes</h1>
            <p className="text-muted-foreground">Gerencie sua carteira de clientes e relacionamentos</p>
          </div>

          <CustomerManagement />
        </main>
      </div>
    </div>
  )
}
