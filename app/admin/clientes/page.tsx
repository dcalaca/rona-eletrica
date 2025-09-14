import { CustomerManagement } from "@/components/customer-management"

export default function AdminCustomersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
        <p className="text-muted-foreground">Visualize e gerencie informações dos clientes</p>
      </div>
      <CustomerManagement />
    </>
  )
}
