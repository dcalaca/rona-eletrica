import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { ProductManagement } from "@/components/product-management"

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
            <p className="text-muted-foreground">Adicione, edite e gerencie o catálogo de produtos</p>
          </div>

          <ProductManagement />
        </main>
      </div>
    </div>
  )
}
