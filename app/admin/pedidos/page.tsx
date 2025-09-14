import { OrderManagement } from "@/components/order-management"

export default function AdminOrdersPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Pedidos</h1>
        <p className="text-muted-foreground">Acompanhe e gerencie todos os pedidos da loja</p>
      </div>
      <OrderManagement />
    </>
  )
}
