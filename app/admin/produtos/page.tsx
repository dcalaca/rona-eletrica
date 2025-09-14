import { ProductManagement } from "@/components/product-management"

export default function AdminProductsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
        <p className="text-muted-foreground">Adicione, edite e gerencie o catálogo de produtos</p>
      </div>
      <ProductManagement />
    </>
  )
}
