import { VendorManagement } from "@/components/vendor-management"

export default function AdminVendorsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Vendedores</h1>
        <p className="text-muted-foreground">Gerencie vendedores, comissões e performance de vendas</p>
      </div>
      <VendorManagement />
    </>
  )
}
