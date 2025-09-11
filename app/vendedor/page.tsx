import { VendorSidebar } from "@/components/vendor-sidebar"
import { VendorDashboard } from "@/components/vendor-dashboard"
import { VendorHeader } from "@/components/vendor-header"

export default function VendorPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <VendorHeader />

      <div className="flex">
        <VendorSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard do Vendedor</h1>
            <p className="text-muted-foreground">Acompanhe suas vendas, metas e comissões</p>
          </div>

          <VendorDashboard />
        </main>
      </div>
    </div>
  )
}
